import ICheckSimpleDTO from '@modules/simple/dtos/ICheckSimpleDTO'
import IResourceManagerRepository from '@modules/simple/repositories/IResourceManagerRepository'
import CNPJInvalidError from '@shared/errors/CNPJInvalidError'
import puppeteer, { Browser, Page } from 'puppeteer'
import puppeteerExtra from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import randomUseragent from 'random-useragent'

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36'
puppeteerExtra.use(StealthPlugin())

class ResourceManagerRepository implements IResourceManagerRepository {
  private isReleased: boolean
  private retries: number
  private browser: Browser

  constructor() {
    this.isReleased = false
    this.retries = 0
  }

  private async runBrowser(): Promise<Browser> {
    const bw = await puppeteerExtra.launch({
      headless: true,
      devtools: false,
      ignoreHTTPSErrors: true,
      executablePath: puppeteer.executablePath(),
      slowMo: 0,
      args: [
        '--disable-gpu',
        '--no-sandbox',
        '--no-zygote',
        '--disable-setuid-sandbox',
        '--disable-accelerated-2d-canvas',
        '--disable-dev-shm-usage',
        "--proxy-server='direct://'",
        '--proxy-bypass-list=*'
      ]
    })

    bw.on('disconnected', async () => {
      if (this.isReleased) return
      console.log('BROWSER CRASH')
      if (this.retries <= 3) {
        this.retries += 1
        if (this.browser && this.browser.process() != null)
          this.browser.process().kill('SIGINT')
        await this.init()
      } else {
        throw new Error('BROWSER crashed more than 3 times')
      }
    })

    return (bw as unknown) as Browser
  }

  public async init(): Promise<void> {
    this.isReleased = false
    this.retries = 0
    this.browser = await this.runBrowser()
  }

  public async release(): Promise<void> {
    this.isReleased = true
    if (this.browser) await this.browser.close()
  }

  public async createPage(url: string): Promise<Page> {
    if (!this.browser) this.browser = await this.runBrowser()
    const userAgent = randomUseragent.getRandom()
    const UA = userAgent || USER_AGENT
    const page = await this.browser.newPage()
    await page.setViewport({
      width: 1920 + Math.floor(Math.random() * 100),
      height: 3000 + Math.floor(Math.random() * 100),
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      isMobile: false
    })
    await page.setUserAgent(UA)
    await page.setJavaScriptEnabled(true)
    page.setDefaultNavigationTimeout(0)
    await page.setRequestInterception(true)
    page.on('request', req => {
      if (
        req.resourceType() === 'stylesheet' ||
        req.resourceType() === 'font' ||
        req.resourceType() === 'image'
      ) {
        req.abort()
      } else {
        req.continue()
      }
    })

    await page.evaluateOnNewDocument(() => {
      // pass webdriver check
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false
      })
    })

    await page.evaluateOnNewDocument(() => {
      // pass chrome check
      // window.chrome = {
      //   runtime: {}
      //   // etc.
      // }
    })

    await page.evaluateOnNewDocument(() => {
      // pass plugins check
      const originalQuery = window.navigator.permissions.query
      return (window.navigator.permissions.query = parameters =>
        parameters.name === 'notifications'
          ? Promise.resolve({
              state: Notification.permission
            } as PermissionStatus)
          : originalQuery(parameters))
    })

    await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, 'plugins', {
        // This just needs to have `length > 0` for the current test,
        // but we could mock the plugins too if necessary.
        get: () => [1, 2, 3, 4, 5]
      })
    })

    await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en']
      })
    })

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 })
    return page
  }

  public async isSimple(page: Page, cnpj: string): Promise<ICheckSimpleDTO> {
    await page.waitForSelector('input[name=Cnpj]')
    await page.$eval(
      'input[name=Cnpj]',
      (el, value) => (el.value = value),
      cnpj
    )
    await page.click('#consultarForm button')
    await page.waitForNavigation()

    const error = await page.evaluate(() => {
      const element = document.querySelector('.field-validation-error')
      if (!element) return ''
      return element.textContent
    })
    if (error) throw new CNPJInvalidError(error)
    const simple = await page.evaluate(() => {
      const texts: string[] = []
      document
        .querySelectorAll('.spanValorVerde')
        .forEach(({ textContent }) => texts.push(textContent))
      return {
        cnpj: texts[0],
        name: texts[1],
        simple: texts[2],
        simei: texts[3],
        isSimple: !texts[2]?.includes('NÃO')
      }
    })
    await page.close()
    return simple
  }
}

export default ResourceManagerRepository

import uploadConfig from '@config/upload'
import fs from 'fs'
import path from 'path'

import IUploadProvider from '../../models/IUploadProvider'

class DiskProvider implements IUploadProvider {
  public async saveFile(file: string): Promise<string> {
    return `/uploads/${file}`
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsDir, file)

    try {
      await fs.promises.stat(filePath)
    } catch (err) {
      return
    }

    await fs.promises.unlink(filePath)
  }
}

export default DiskProvider

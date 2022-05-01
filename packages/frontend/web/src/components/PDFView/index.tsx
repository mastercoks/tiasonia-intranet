import { useCallback, useEffect, useState } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'

import Loading from '../../components/Loading'
import { Container } from './styles'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface Props {
  src: string
}

const PDFView: React.FC<Props> = ({ src }) => {
  const [numPages, setNumPages] = useState(null)
  const [sizePage, setSizePage] = useState(768)

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }) => setNumPages(numPages),
    []
  )

  useEffect(() => {
    function handleResize() {
      const size =
        window.innerWidth > 1068
          ? 768
          : window.innerWidth > 768
          ? window.innerWidth - 300
          : window.innerWidth
      setSizePage(size)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Container>
      <Document
        file={src}
        noData="PDF vazio"
        loading={<Loading />}
        error="Falha ao carregar o PDF"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={sizePage - 40 || undefined}
          />
        ))}
      </Document>
    </Container>
  )
}

export default PDFView

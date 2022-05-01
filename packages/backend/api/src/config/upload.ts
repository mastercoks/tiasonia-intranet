import multer from 'multer'
import path from 'path'
import { v4 as uuid } from 'uuid'

interface UploadConfig {
  driver: 'disk'
  tmpDir: string
  uploadsDir: string
  config: {
    disk: multer.Options
  }
}

const tmpDir = path.resolve(__dirname, '..', '..', 'tmp')
const uploadsDir = path.resolve(tmpDir, 'uploads')

export default {
  driver: 'disk',
  tmpDir,
  uploadsDir,
  config: {
    disk: {
      storage: multer.diskStorage({
        destination: uploadsDir,
        filename(req, file, cb) {
          const fileName = uuid() + path.extname(file.originalname)
          cb(null, fileName)
        }
      })
    }
  }
} as UploadConfig

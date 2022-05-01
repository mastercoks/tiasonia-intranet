export default interface IUploadProvider {
  saveFile(file: string): Promise<string>
  deleteFile(file: string): Promise<void>
}

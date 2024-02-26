import { type FileStorage } from 'any-cloud-storage'
import ArtifactStorage from './ArtifactStorage'

export default class AnyCloudArtifactStorage extends ArtifactStorage {
  constructor(private readonly storage: FileStorage) {
    super()
  }

  protected override async saveFile(
    artifactPath: string,
    data: Buffer
  ): Promise<void> {
    await this.storage.saveFile(artifactPath, data)
  }

  protected getAbsolutePath(filePath: string): string | Promise<string> {
    return this.storage.getAbsolutePath(filePath)
  }
}

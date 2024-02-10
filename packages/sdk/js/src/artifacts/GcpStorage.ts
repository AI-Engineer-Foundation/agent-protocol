import { type Storage } from '@google-cloud/storage'
import ArtifactStorage from './ArtifactStorage'

export default class GcpStorage extends ArtifactStorage {
  constructor(
    private readonly storage: Storage,
    private readonly bucketName: string
  ) {
    super()
  }

  protected override async saveFile(
    artifactPath: string,
    data: Buffer
  ): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName)
    const file = bucket.file(artifactPath)
    await file.save(data)
  }
}

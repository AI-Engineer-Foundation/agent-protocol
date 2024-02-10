import { type BlobServiceClient } from '@azure/storage-blob'
import ArtifactStorage from './ArtifactStorage'

export default class AzureStorage extends ArtifactStorage {
  constructor(
    private readonly blobServiceClient: BlobServiceClient,
    private readonly containerName: string
  ) {
    super()
  }

  protected override async saveFile(
    artifactPath: string,
    data: Buffer
  ): Promise<void> {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName
    )
    const blockBlobClient = containerClient.getBlockBlobClient(artifactPath)
    await blockBlobClient.upload(data, data.length)
  }
}

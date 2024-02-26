import type * as AWS from 'aws-sdk'
import ArtifactStorage from './ArtifactStorage'

export default class S3Storage extends ArtifactStorage {
  constructor(
    private readonly s3: AWS.S3,
    private readonly bucket: string
  ) {
    super()
  }

  protected override async saveFile(
    artifactPath: string,
    data: Buffer
  ): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key: artifactPath,
      Body: data,
    }
    await this.s3.putObject(params).promise()
  }
}

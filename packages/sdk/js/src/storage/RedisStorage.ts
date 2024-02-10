import type * as redis from 'redis'
import ArtifactStorage from './ArtifactStorage'

export default class RedisStorage extends ArtifactStorage {
  constructor(private readonly client: redis.RedisClient) {
    super()
  }

  protected override async saveFile(
    artifactPath: string,
    data: Buffer
  ): Promise<void> {
    this.client.set(artifactPath, data.toString())
  }
}

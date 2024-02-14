import createStorage, { type StorageType } from 'any-cloud-storage'
import type ArtifactStorage from './ArtifactStorage'
import { AnyCloudArtifactStorage } from './AnyCloudArtifactStorage'

export default class ArtifactStorageFactory {
  static async create(
    config: { type: StorageType } & Record<string, any>
  ): Promise<ArtifactStorage> {
    const storage = await createStorage(config)

    return new AnyCloudArtifactStorage(storage)
  }
}

import createStorage, {
  type FileStorage,
  type StorageType,
} from 'any-cloud-storage'
import ArtifactStorage from './ArtifactStorage'

class AnyCloudArtifactStorage extends ArtifactStorage {
  constructor(private readonly storage: FileStorage) {
    super()
  }

  protected override async saveFile(
    artifactPath: string,
    data: Buffer
  ): Promise<void> {
    return this.storage.saveFile(artifactPath, data)
  }

  protected getAbsolutePath(filePath: string): string | Promise<string> {
    return this.storage.getAbsolutePath(filePath)
  }
}

export default class ArtifactStorageFactory {
  static async create(
    config: { type: StorageType } & Record<string, any>
  ): Promise<ArtifactStorage> {
    const storage = await createStorage(config)

    return new AnyCloudArtifactStorage(storage)
  }
}

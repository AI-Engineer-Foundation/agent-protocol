import type ArtifactStorage from './ArtifactStorage'

type StorageType =
  | 'firebase'
  | 'azure'
  | 'gcp'
  | 'git'
  | 'file'
  | 's3'
  | 'redis'

export default class ArtifactStorageFactory {
  static async create(
    config: { type: StorageType } & Record<string, any>
  ): Promise<ArtifactStorage> {
    switch (config.type) {
      case 'file':
        return await createFileStorage(config)
      case 'git':
        return await createGitStorage(config)
      case 'firebase':
        return await createFirebaseStorage(config)
      case 'azure':
        return await createAzureStorage(config)
      case 'gcp':
        return await createGcpStorage(config)
      case 's3':
        return await createS3Storage(config)
      case 'redis':
        return await createRedisStorage(config)
      default:
        throw new Error(`Unsupported storage type: ${config.type}`)
    }
  }
}

async function createFileStorage(
  config: Record<string, any>
): Promise<ArtifactStorage> {
  const { default: FileStorage } = await import('./FileStorage')
  return new FileStorage()
}

async function createGitStorage(
  config: Record<string, any>
): Promise<ArtifactStorage> {
  const { default: GitStorage } = await import('./GitStorage')
  return new GitStorage(
    config.workspace,
    config.gitRepo,
    config.gitUsername,
    config.gitOptions
  )
}

async function createFirebaseStorage(
  config: Record<string, any>
): Promise<ArtifactStorage> {
  const { default: FirebaseStorage } = await import('./FirebaseStorage')
  return new FirebaseStorage(config.storage)
}

async function createAzureStorage(
  config: Record<string, any>
): Promise<ArtifactStorage> {
  const { default: AzureStorage } = await import('./AzureStorage')
  return new AzureStorage(config.blobServiceClient, config.containerName)
}

async function createGcpStorage(
  config: Record<string, any>
): Promise<ArtifactStorage> {
  const { default: GcpStorage } = await import('./GcpStorage')
  return new GcpStorage(config.storage, config.bucketName)
}

async function createS3Storage(
  config: Record<string, any>
): Promise<ArtifactStorage> {
  const { default: S3Storage } = await import('./S3Storage')
  return new S3Storage(config.s3, config.bucket)
}

async function createRedisStorage(
  config: Record<string, any>
): Promise<ArtifactStorage> {
  const { default: RedisStorage } = await import('./RedisStorage')
  return new RedisStorage(config.client)
}

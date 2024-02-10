import { ref, uploadBytes } from 'firebase/storage'
import ArtifactStorage from './ArtifactStorage'

export default class FirebaseStorage extends ArtifactStorage {
  constructor(private readonly storage: any) {
    super()
  }

  protected override async saveFile(
    artifactPath: string,
    data: Buffer
  ): Promise<void> {
    const storageRef = ref(this.storage, artifactPath)
    await uploadBytes(storageRef, data)
  }
}

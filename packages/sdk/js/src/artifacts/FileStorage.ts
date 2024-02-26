import * as fs from 'fs'
import * as path from 'path'
import ArtifactStorage from './ArtifactStorage'

export default class FileStorage extends ArtifactStorage {
  protected override async saveFile(
    artifactPath: string,
    data: Buffer
  ): Promise<void> {
    fs.mkdirSync(path.join(artifactPath, '..'), { recursive: true })
    fs.writeFileSync(artifactPath, data)
  }
}

import path from 'path'
import { type Artifact } from '../models'

export default abstract class ArtifactStorage {
  /**
   * Save an artifact associated to a task
   * @param taskId Task associated with artifact
   * @param artifact Artifact associated with the path returned
   * @returns Absolute path of the artifact
   */
  async writeArtifact(
    taskId: string,
    workspace: string,
    artifact: Artifact,
    file: Express.Multer.File
  ): Promise<void> {
    const artifactFolderPath = this.getArtifactPath(taskId, workspace, artifact)
    await this.saveFile(artifactFolderPath, file.buffer)
  }

  /**
   * Get path of an artifact associated to a task
   * @param taskId Task associated with artifact
   * @param workspace The path to the workspace, defaults to './workspace'
   * @param artifact Artifact associated with the path returned
   * @returns Absolute path of the artifact
   */
  getArtifactPath(
    taskId: string,
    workspace: string,
    artifact: Artifact
  ): string {
    const rootDir = path.isAbsolute(workspace)
      ? workspace
      : path.join(process.cwd(), workspace)

    return path.join(
      rootDir,
      taskId,
      artifact.relative_path ?? '',
      artifact.file_name
    )
  }

  protected async saveFile(artifactPath: string, data: Buffer): Promise<void> {}
}

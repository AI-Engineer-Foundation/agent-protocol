import * as fs from 'fs'
import { simpleGit, type SimpleGitOptions, type SimpleGit } from 'simple-git'

import ArtifactStorage from './ArtifactStorage'
import { type Artifact } from '../models'
import path from 'path'

export default class GitStorage extends ArtifactStorage {
  private readonly git: SimpleGit

  constructor(
    private readonly workspace: string,
    repoUrl: string,
    username: string = 'agentprotocol',
    options?: Partial<SimpleGitOptions>
  ) {
    super()

    const git = options != null ? simpleGit(options) : simpleGit(workspace)

    git
      .init((result) => {
        console.log('git repo initialised:', JSON.stringify(result, null, 2))
      })
      .addRemote('main', repoUrl, (result) => {
        console.log('remote added:', JSON.stringify(result, null, 2))
      })
      .addConfig('user.name', username, (result) => {
        console.log('user name set:', JSON.stringify(result, null, 2))
      })
      .catch((err) => {
        console.error('Failed to initialise git:', err)
      })

    this.git = git
  }

  override async writeArtifact(
    taskId: string,
    workspace: string,
    artifact: Artifact,
    file: Express.Multer.File
  ): Promise<void> {
    fs.writeFileSync(path.join(workspace, artifact.file_name), file.buffer)
    await this.git.add('./*')
    await this.git.commit(`🤖 task ${taskId}`)
    await this.git.push()
  }
}

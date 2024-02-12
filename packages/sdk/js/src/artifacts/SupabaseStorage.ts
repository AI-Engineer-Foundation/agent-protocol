import { type SupabaseClient, createClient } from '@supabase/supabase-js'
import ArtifactStorage from './ArtifactStorage'

export default class SupabaseStorage extends ArtifactStorage {
  private readonly supabase: SupabaseClient

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    private readonly bucket: string
  ) {
    super()
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  protected override async saveFile(
    artifactPath: string,
    data: Buffer,
    contentType?: string
  ): Promise<void> {
    await this.supabase.storage
      .from(this.bucket)
      .upload(artifactPath, data, { upsert: true, contentType })
  }
}

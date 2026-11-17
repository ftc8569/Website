import { readdir } from "node:fs/promises"
import path from "node:path"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

/*
 * Development-only review page: every site photo in one grid with the shared
 * colour grade applied, so you can check that tones match side by side.
 * Returns 404 in production builds.
 */
export const metadata: Metadata = {
  title: "Image review",
  robots: { index: false, follow: false }
}

const FOLDERS = ["activity", "gallery", "outreach", "season"]
const PHOTO = /\.(jpe?g|webp|png)$/i

export default async function ImageReview() {
  if (process.env.NODE_ENV === "production") notFound()

  const groups = await Promise.all(
    FOLDERS.map(async (folder) => {
      const files = await readdir(path.join(process.cwd(), "public", folder))
      return {
        folder,
        files: files
          .filter((file) => PHOTO.test(file))
          // Skip the multi-megabyte phone originals.
          .filter((file) => !/-(1|2)\.png$/.test(file))
          .sort()
      }
    })
  )

  return (
    <main>
      <section className="section">
        <div className="wrap--media">
          <h1 className="headline">Image review</h1>
          <p className="subhead">
            Every photo with the site grade, vignette and grain. Development
            only.
          </p>
          {groups.map((group) => (
            <div key={group.folder} style={{ marginTop: 56 }}>
              <h2 style={{ fontSize: 24, marginBottom: 16 }}>
                /{group.folder} ({group.files.length})
              </h2>
              <div className="grid grid--4">
                {group.files.map((file) => (
                  <figure key={file} style={{ margin: 0 }}>
                    <div className="media media--4x3">
                      <Image
                        src={`/${group.folder}/${file}`}
                        alt={file}
                        fill
                        sizes="300px"
                      />
                    </div>
                    <figcaption className="caption" style={{ marginTop: 6 }}>
                      {file}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

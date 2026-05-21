import ScrollReveal from '@/components/ScrollReveal'
import spotifyJson from '../../public/spotify-top.json'
import steamJson from '../../public/steam-recent.json'
import styles from './Interests.module.css'

interface Artist {
  name: string
  url: string
  image: string
  genres: string[]
}

interface Game {
  appid: number
  name: string
  playtime_2weeks_min: number
  playtime_forever_min: number
  imageUrl: string
  url: string
}

interface SpotifyData {
  fetchedAt: string | null
  artists: Artist[]
}

interface SteamData {
  fetchedAt: string | null
  games: Game[]
}

interface Props {
  spotify?: SpotifyData
  steam?: SteamData
}

// Profile URLs — replace placeholders when you have them set up
const SPOTIFY_PROFILE = 'https://open.spotify.com/user/fuhriman'
const STEAM_PROFILE = 'https://steamcommunity.com/id/fuhriman'

export default function Interests({
  spotify = spotifyJson as SpotifyData,
  steam = steamJson as SteamData,
}: Props) {
  return (
    <section id="interests" className={styles.interests}>
      <div className="container">
        <ScrollReveal>
          <h2>Off the clock</h2>
          <p className={styles.subhead}>What&apos;s keeping me sane this week</p>
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className={styles.grid}>
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>On rotation</h3>
                <a
                  href={SPOTIFY_PROFILE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.profile}
                >
                  Spotify profile ↗
                </a>
              </div>
              <ul className={styles.list}>
                {spotify.artists.length === 0 ? (
                  <li className={styles.placeholder}>Refreshing…</li>
                ) : (
                  spotify.artists.map((a) => (
                    <li key={a.name} className={styles.tile}>
                      {a.image ? (
                        // biome-ignore lint/performance/noImgElement: external Spotify CDN URL, next/image requires configured remote patterns
                        <img src={a.image} alt="" className={styles.thumb} />
                      ) : (
                        <div className={styles.thumb} aria-hidden="true" />
                      )}
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.tileTitle}
                      >
                        {a.name}
                      </a>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>Recently playing</h3>
                <a
                  href={STEAM_PROFILE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.profile}
                >
                  Steam profile ↗
                </a>
              </div>
              <ul className={styles.list}>
                {steam.games.length === 0 ? (
                  <li className={styles.placeholder}>Refreshing…</li>
                ) : (
                  steam.games.map((g) => (
                    <li key={g.appid} className={styles.tile}>
                      {g.imageUrl ? (
                        // biome-ignore lint/performance/noImgElement: external Steam CDN URL, next/image requires configured remote patterns
                        <img src={g.imageUrl} alt="" className={styles.thumb} />
                      ) : (
                        <div className={styles.thumb} aria-hidden="true" />
                      )}
                      <div className={styles.tileBody}>
                        <a
                          href={g.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.tileTitle}
                        >
                          {g.name}
                        </a>
                        <div className={styles.tileMeta}>
                          {Math.round(g.playtime_2weeks_min / 60)} hrs · 2 weeks
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const clientId = requireEnv('SPOTIFY_CLIENT_ID')
const clientSecret = requireEnv('SPOTIFY_CLIENT_SECRET')
const refreshToken = requireEnv('SPOTIFY_REFRESH_TOKEN')

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env var ${name}`)
  return v
}

async function exchangeToken(): Promise<string> {
  const body = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken })
  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body,
  })
  if (!r.ok) throw new Error(`Spotify token exchange ${r.status}: ${await r.text()}`)
  const data = (await r.json()) as { access_token: string }
  return data.access_token
}

interface RawArtist {
  name: string
  external_urls: { spotify: string }
  images: { url: string }[]
  genres: string[]
}

async function fetchTopArtists(token: string): Promise<RawArtist[]> {
  const r = await fetch(
    'https://api.spotify.com/v1/me/top/artists?limit=5&time_range=medium_term',
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  if (!r.ok) throw new Error(`Spotify top artists ${r.status}: ${await r.text()}`)
  const data = (await r.json()) as { items: RawArtist[] }
  return data.items
}

const accessToken = await exchangeToken()
const items = await fetchTopArtists(accessToken)
const out = {
  fetchedAt: new Date().toISOString(),
  artists: items.map((a) => ({
    name: a.name,
    url: a.external_urls.spotify,
    image: a.images[0]?.url ?? '',
    genres: a.genres,
  })),
}
writeFileSync(resolve('public/spotify-top.json'), `${JSON.stringify(out, null, 2)}\n`)
console.log(`Wrote ${out.artists.length} Spotify artists`)

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env var ${name}`)
  return v
}

const key = requireEnv('STEAM_API_KEY')
const steamId = requireEnv('STEAM_ID_64')

interface RawGame {
  appid: number
  name: string
  playtime_2weeks: number
  playtime_forever: number
  img_icon_url: string
}

async function fetchRecent(): Promise<RawGame[]> {
  const url = new URL('https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/')
  url.searchParams.set('key', key)
  url.searchParams.set('steamid', steamId)
  url.searchParams.set('count', '5')
  const r = await fetch(url.toString())
  if (!r.ok) throw new Error(`Steam ${r.status}: ${await r.text()}`)
  const data = (await r.json()) as { response?: { games?: RawGame[] } }
  return data.response?.games ?? []
}

const games = await fetchRecent()
const out = {
  fetchedAt: new Date().toISOString(),
  games: games.map((g) => ({
    appid: g.appid,
    name: g.name,
    playtime_2weeks_min: g.playtime_2weeks,
    playtime_forever_min: g.playtime_forever,
    imageUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appid}/header.jpg`,
    url: `https://store.steampowered.com/app/${g.appid}/`,
  })),
}
writeFileSync(resolve('public/steam-recent.json'), `${JSON.stringify(out, null, 2)}\n`)
console.log(`Wrote ${out.games.length} Steam games`)

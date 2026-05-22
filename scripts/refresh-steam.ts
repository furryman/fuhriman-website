import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env var ${name}`)
  return v
}

const key = requireEnv('STEAM_API_KEY')
const steamId = requireEnv('STEAM_ID_64')

// Games to exclude from the public "recently playing" list.
// Configured via the STEAM_BLOCKLIST_APPIDS env var (comma-separated Steam
// appids). Kept out of source so the list itself isn't part of the public repo.
const BLOCKLIST_APPIDS: ReadonlySet<number> = new Set(
  (process.env.STEAM_BLOCKLIST_APPIDS ?? '')
    .split(',')
    .map((s) => Number.parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0)
)

// We fetch a wider window than we display so the blocklist doesn't shrink the
// visible list below TOP_N.
const FETCH_COUNT = 15
const TOP_N = 5

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
  url.searchParams.set('count', String(FETCH_COUNT))
  const r = await fetch(url.toString())
  if (!r.ok) throw new Error(`Steam ${r.status}: ${await r.text()}`)
  const data = (await r.json()) as { response?: { games?: RawGame[] } }
  return data.response?.games ?? []
}

// Steam moved newer titles to a content-hashed asset host
// (shared.akamai.steamstatic.com/store_item_assets/...) and the legacy
// cdn.cloudflare.steamstatic.com/steam/apps/{appid}/header.jpg path returns 404
// for those games. The storefront API is the only reliable source of the
// canonical header URL — fall back to the legacy path only if it errors.
async function fetchHeaderImage(appid: number): Promise<string> {
  const fallback = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`
  try {
    const r = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appid}&filters=basic`
    )
    if (!r.ok) return fallback
    const data = (await r.json()) as Record<
      string,
      { success: boolean; data?: { header_image?: string } }
    >
    return data[String(appid)]?.data?.header_image ?? fallback
  } catch {
    return fallback
  }
}

async function main() {
  const raw = await fetchRecent()
  const games = raw.filter((g) => !BLOCKLIST_APPIDS.has(g.appid)).slice(0, TOP_N)
  const imageUrls = await Promise.all(games.map((g) => fetchHeaderImage(g.appid)))
  const out = {
    fetchedAt: new Date().toISOString(),
    games: games.map((g, i) => ({
      appid: g.appid,
      name: g.name,
      playtime_2weeks_min: g.playtime_2weeks,
      playtime_forever_min: g.playtime_forever,
      imageUrl: imageUrls[i],
      url: `https://store.steampowered.com/app/${g.appid}/`,
    })),
  }
  writeFileSync(resolve('public/steam-recent.json'), `${JSON.stringify(out, null, 2)}\n`)
  console.log(`Wrote ${out.games.length} Steam games`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

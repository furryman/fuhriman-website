/**
 * One-time helper: exchange an authorization code for a refresh token.
 *
 * Usage:
 *   pnpm tsx scripts/get-spotify-refresh-token.ts \
 *     --client-id=XXX --client-secret=YYY --code=ZZZ
 *
 * The code comes from the URL bar after authorizing at
 * https://accounts.spotify.com/authorize?client_id=XXX&response_type=code&redirect_uri=http://127.0.0.1:8888/callback&scope=user-top-read
 */

export {}

interface Args {
  clientId: string
  clientSecret: string
  code: string
}

function parseArgs(): Args {
  const out: Partial<Args> = {}
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--client-id=')) out.clientId = arg.slice('--client-id='.length)
    else if (arg.startsWith('--client-secret='))
      out.clientSecret = arg.slice('--client-secret='.length)
    else if (arg.startsWith('--code=')) out.code = arg.slice('--code='.length)
  }
  const missing: string[] = []
  if (!out.clientId) missing.push('--client-id')
  if (!out.clientSecret) missing.push('--client-secret')
  if (!out.code) missing.push('--code')
  if (missing.length) {
    console.error(`Missing required args: ${missing.join(', ')}`)
    console.error(
      'Usage: pnpm tsx scripts/get-spotify-refresh-token.ts --client-id=XXX --client-secret=YYY --code=ZZZ'
    )
    process.exit(1)
  }
  return out as Args
}

async function main() {
  const { clientId, clientSecret, code } = parseArgs()
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'http://127.0.0.1:8888/callback',
  })
  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body,
  })
  const text = await r.text()
  if (!r.ok) {
    console.error(`Spotify rejected the exchange (HTTP ${r.status}):`)
    console.error(text)
    process.exit(1)
  }
  const data = JSON.parse(text) as {
    refresh_token?: string
    access_token?: string
    error_description?: string
  }
  if (!data.refresh_token) {
    console.error('Response did not include a refresh_token:')
    console.error(text)
    process.exit(1)
  }
  console.log('\nSuccess. Add this as the SPOTIFY_REFRESH_TOKEN GitHub secret:\n')
  console.log(data.refresh_token)
  console.log('\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

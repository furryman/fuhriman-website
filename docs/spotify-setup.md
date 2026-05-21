# Spotify Top Artists Setup

The Interests section's "On rotation" panel reads from `public/spotify-top.json`, refreshed weekly (Mondays at 06:00 UTC) by the GitHub Action at `.github/workflows/interests-refresh.yaml`. This file documents the one-time setup needed to obtain a refresh token.

## 1. Create a Spotify Developer App

1. Visit https://developer.spotify.com/dashboard
2. Click **Create app**
3. Name it (e.g. "fuhriman-website-interests")
4. Add redirect URI: `http://127.0.0.1:8888/callback`
5. Note your **Client ID** and **Client Secret**

## 2. Get a refresh token (one-time)

Use the [Authorization Code flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow):

```bash
# 1. Open in browser to authorize and receive the `code` query param
open "https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://127.0.0.1:8888/callback&scope=user-top-read"

# 2. After redirect, grab the `code` value from the URL and exchange it:
curl -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic $(echo -n 'YOUR_CLIENT_ID:YOUR_CLIENT_SECRET' | base64)" \
  -d "grant_type=authorization_code&code=YOUR_CODE&redirect_uri=http://127.0.0.1:8888/callback"

# Response includes `refresh_token` — save it for the next step
```

## 3. Add three GitHub secrets

Repo Settings → Secrets and variables → Actions → New repository secret:

| Name | Value |
|---|---|
| `SPOTIFY_CLIENT_ID` | from step 1 |
| `SPOTIFY_CLIENT_SECRET` | from step 1 |
| `SPOTIFY_REFRESH_TOKEN` | from step 2 |

## 4. Verify

Trigger the workflow manually: Actions → "Refresh Interests (Spotify + Steam)" → Run workflow.

If the Spotify step succeeds, `public/spotify-top.json` will be committed with the latest top 5 artists.

## Steam setup

For the Steam side, also add:

| Name | Value |
|---|---|
| `STEAM_API_KEY` | https://steamcommunity.com/dev/apikey (free, instant) |
| `STEAM_ID_64` | your 64-bit SteamID — find it via https://steamid.io |

Your Steam profile (or at least Game Details privacy) must be Public for the API to return data.

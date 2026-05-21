# Spotify Top Artists Setup

The Interests section's "On rotation" panel reads from `public/spotify-top.json`, refreshed daily by the GitHub Action at `.github/workflows/interests-refresh.yaml`. This file documents the one-time setup needed to obtain a refresh token.

## 1. Create a Spotify Developer App

1. Visit <https://developer.spotify.com/dashboard>
2. Click **Create app**
3. Name it (e.g. "fuhriman-website-interests")
4. Add redirect URI: `http://127.0.0.1:8888/callback`
5. Note your **Client ID** and **Client Secret**

## 2. Get a refresh token (one-time)

Use the [Authorization Code flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow). You're going to authorize the app in your browser, then exchange the resulting code for a refresh token.

### Step 2a — Authorize

Open this URL in your browser (replace `YOUR_CLIENT_ID`):

```text
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://127.0.0.1:8888/callback&scope=user-top-read
```

Spotify will show a consent screen. Click **Agree**.

### Step 2b — Capture the code

Spotify redirects you to `http://127.0.0.1:8888/callback?code=...`. Your browser will show **"This site can't be reached"** or **"Looks like there's a problem with this site"**.

**That's expected.** Nothing is running on port 8888. You're not running a local server — you don't need to. The only thing you care about is the URL in the address bar.

Look at the address bar. It will look like:

```text
http://127.0.0.1:8888/callback?code=AQD-VERY-LONG-STRING-HERE&state=...
```

Copy everything between `code=` and the next `&` (or end of URL). That's your authorization code.

### Step 2c — Exchange the code for a refresh token

```bash
curl -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic $(echo -n 'YOUR_CLIENT_ID:YOUR_CLIENT_SECRET' | base64)" \
  -d "grant_type=authorization_code&code=YOUR_CODE&redirect_uri=http://127.0.0.1:8888/callback"
```

The JSON response includes a `refresh_token` field. **Save that value** — you'll add it as a GitHub secret in the next step.

## 3. Add three GitHub secrets

Repo Settings → Secrets and variables → Actions → New repository secret:

| Name                    | Value                                       |
| ----------------------- | ------------------------------------------- |
| `SPOTIFY_CLIENT_ID`     | from step 1                                 |
| `SPOTIFY_CLIENT_SECRET` | from step 1                                 |
| `SPOTIFY_REFRESH_TOKEN` | from step 2c                                |

## 4. Verify

Trigger the workflow manually: **Actions** → **"Refresh Interests (Spotify + Steam)"** → **Run workflow**.

If the Spotify step succeeds, `public/spotify-top.json` will be committed with the latest top 5 artists.

## Steam setup

For the Steam side, also add these secrets:

| Name             | Value                                                              |
| ---------------- | ------------------------------------------------------------------ |
| `STEAM_API_KEY`  | <https://steamcommunity.com/dev/apikey> (free, instant)            |
| `STEAM_ID_64`    | your 64-bit SteamID — find it via <https://steamid.io>             |

Your Steam profile (or at least the Game Details privacy setting) must be **Public** for the API to return data.

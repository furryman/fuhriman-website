import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Interests from './Interests'

const empty = {
  spotify: { fetchedAt: null, artists: [] },
  steam: { fetchedAt: null, games: [] },
}

describe('Interests', () => {
  it('renders the section heading', () => {
    render(<Interests {...empty} />)
    expect(screen.getByRole('heading', { name: /off the clock/i, level: 2 })).toBeInTheDocument()
  })

  it('renders refreshing placeholders when data empty', () => {
    render(<Interests {...empty} />)
    expect(screen.getAllByText(/refreshing/i).length).toBeGreaterThanOrEqual(2)
  })

  it('renders artist tiles when populated (no image)', () => {
    render(
      <Interests
        spotify={{
          fetchedAt: '2026-05-20T00:00:00Z',
          artists: [
            {
              name: 'Aphex Twin',
              url: 'https://open.spotify.com/artist/x',
              image: '',
              genres: ['electronic'],
            },
          ],
        }}
        steam={{ fetchedAt: null, games: [] }}
      />
    )
    expect(screen.getByText('Aphex Twin')).toBeInTheDocument()
  })

  it('renders artist tiles when populated (with image)', () => {
    render(
      <Interests
        spotify={{
          fetchedAt: '2026-05-20T00:00:00Z',
          artists: [
            {
              name: 'Boards of Canada',
              url: 'https://open.spotify.com/artist/y',
              image: 'https://i.scdn.co/image/test.jpg',
              genres: ['ambient'],
            },
          ],
        }}
        steam={{ fetchedAt: null, games: [] }}
      />
    )
    expect(screen.getByText('Boards of Canada')).toBeInTheDocument()
    // img has alt="" so role is presentation — query by tag
    const img = document.querySelector('img')
    expect(img).toHaveAttribute('src', 'https://i.scdn.co/image/test.jpg')
  })

  it('renders game tiles when populated (no image)', () => {
    render(
      <Interests
        spotify={{ fetchedAt: null, artists: [] }}
        steam={{
          fetchedAt: '2026-05-20T00:00:00Z',
          games: [
            {
              appid: 413150,
              name: 'Stardew Valley',
              playtime_2weeks_min: 120,
              playtime_forever_min: 600,
              imageUrl: '',
              url: 'https://store.steampowered.com/app/413150/',
            },
          ],
        }}
      />
    )
    expect(screen.getByText('Stardew Valley')).toBeInTheDocument()
  })

  it('renders game tiles when populated (with image)', () => {
    render(
      <Interests
        spotify={{ fetchedAt: null, artists: [] }}
        steam={{
          fetchedAt: '2026-05-20T00:00:00Z',
          games: [
            {
              appid: 413150,
              name: 'Stardew Valley',
              playtime_2weeks_min: 120,
              playtime_forever_min: 600,
              imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg',
              url: 'https://store.steampowered.com/app/413150/',
            },
          ],
        }}
      />
    )
    expect(screen.getByText('Stardew Valley')).toBeInTheDocument()
    // img has alt="" so role is presentation — query by tag
    const img = document.querySelector('img')
    expect(img).toHaveAttribute(
      'src',
      'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg'
    )
  })

  it('renders profile links for both panels', () => {
    render(<Interests {...empty} />)
    expect(screen.getByRole('link', { name: /spotify profile/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /steam profile/i })).toBeInTheDocument()
  })
})

# LemonBids

![Screenshot 2026-05-16 at 10 02 17](https://github.com/user-attachments/assets/a71f12f3-b61f-4da8-8b5f-f9d290021612)

LemonBids is a Single Page Application (SPA) for auctions, built as a Noroff Front-End Development semester project.

Users can register, log in, create listings, place bids, and manage their profile.

## Features

- User registration and authentication
- Create, edit, relist, and delete listings
- Place bids on active auctions
- View own listings and own bids
- Profile page with credits and editable info
- Mobile-friendly navigation and search
- Toast notifications for feedback
- SPA routing using History API

## Tech Stack

- HTML5
- Tailwind CSS
- Vanilla JavaScript (ES modules)
- Vite
- Noroff API v2

## Project Structure

```text
src/
  components/
  router/
  services/
  state/
  styles/
  ui/
  utils/
  views/
  main.js
public/
  images/
docs/
```

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/GroAnita/SP_2.git
cd SP_2
```

1. Install dependencies

```bash
npm install
```

1. Add environment variables in `.env`

```env
VITE_NOROFF_API_KEY=your_api_key_here
```

1. Start development server

```bash
npm run dev
```

## Available Scripts

| Script            | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start Vite development server       |
| `npm run build`   | Build production files into `docs/` |
| `npm run preview` | Preview production build locally    |
| `npm run format`  | Format files with Prettier          |

## Build and Deployment

This project is configured with:

- `base: '/SP_2/'`
- `build.outDir: 'docs'`

So running `npm run build` generates the deployable site in `docs/` for GitHub Pages.

## API

The app uses Noroff API v2:

<https://docs.noroff.dev/docs/v2>

## Live Demo

<https://groanita.github.io/SP_2/>

## Author

Gro Anita Brathen

GitHub:
<https://github.com/GroAnita>

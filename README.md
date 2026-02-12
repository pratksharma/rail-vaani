# RailVaani

RailVaani is a Next.js app that generates Hindi train and metro station announcements using live train metadata and text-to-speech. Enter a 5-digit Indian train number or a metro station name to produce a downloadable audio announcement.

## Features

- Train announcements powered by IRCTC metadata
- Metro station announcements with configurable station names
- Hindi text-to-speech via SarvamAI
- In-app audio player with progress, seek, and download
- Clean, mobile-friendly UI

## Tech Stack

- Next.js App Router
- React 19
- Tailwind CSS v4
- SarvamAI SDK
- irctc-connect

## Prerequisites

- Node.js 18+ (recommended)
- A SarvamAI API subscription key

## Setup

1. Install dependencies

```bash
npm install
```

2. Create an environment file

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SARVAM_API_TOKEN=your_sarvamai_api_key
```

3. Start the dev server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Usage

1. Choose Train or Metro.
2. Enter a 5-digit train number or a station name.
3. Click Generate to create the announcement.
4. Play or download the audio from the modal.

## Project Structure

```
app/
	layout.js           # App shell, fonts, metadata
	page.js             # Main UI and form logic
	utils/
		get-audio.js      # TTS + data fetching logic
components/
	modal.js            # Audio player modal
public/
	banner.jpg          # Header image
```

## Scripts

- `npm run dev` - start the development server
- `npm run build` - build for production
- `npm run start` - run the production build
- `npm run lint` - run ESLint

## Environment Variables

- `NEXT_PUBLIC_SARVAM_API_TOKEN` - SarvamAI API key used for text-to-speech

## Notes

- Train announcements use `irctc-connect` to fetch live train details.
- Audio is created in the browser using the SarvamAI client SDK.

## License

MIT

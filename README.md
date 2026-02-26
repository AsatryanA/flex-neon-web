# Flex Neon Web

Frontend for a neon-sign business website built with React.  
It includes marketing pages, a custom sign design flow, rental inquiry flow, and authentication UI with Google OAuth support.

## Tech Stack

- React 18
- React Router v6
- Axios
- Google OAuth (`@react-oauth/google`)
- Create React App (`react-scripts`)

## Features

- Multi-page SPA with routes for home, portfolio, about, contact, order, rent, login, and register
- Custom sign builder UI (`/order`) with text/font/color controls, background image upload, drag/resize/rotate/stretch interactions, and undo/redo history
- Rental package selection and booking request form (`/rent`)
- Contact form and FAQ (`/contact`)
- Auth flows (`/login`, `/register`) with email/password and Google sign-in
- Token-based auth state with localStorage persistence
- Language context and switcher (EN / RU / HY)

## Routes

- `/` Home
- `/portfolio` Portfolio
- `/about` About
- `/contact` Contact
- `/order` Custom sign designer
- `/rent` Rental page
- `/login` Login
- `/register` Register

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

- `REACT_APP_API_URL`: backend base URL used by Axios
- `REACT_APP_GOOGLE_CLIENT_ID`: Google OAuth Client ID for login/register

### Run Locally

```bash
npm start
```

App runs at `http://localhost:3000`.

## API Expectations

The frontend calls these backend endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/me`
- `POST /api/orders/sessions` (create order editing session)
- `POST /api/orders/sessions/:sessionId/actions` (save user order actions/history events)
- `POST /api/orders/sessions/:sessionId/complete` (mark order session complete on submit)

Expected auth response shape:

```json
{
  "token": "jwt_token_here",
  "user": {
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

## Scripts

- `npm start` Start dev server
- `npm run build` Create production build
- `npm test` Run tests
- `npm run eject` Eject CRA config

## Project Structure

```text
src/
  api/            # Axios client + auth service
  components/     # Shared UI (Header, Footer, LanguageSwitcher, ProtectedRoute)
  context/        # Auth context
  i18n/           # Language context + translation map
  pages/          # Route pages
  App.js          # Router and providers
```

## Current Notes

- Contact, rent, and order submissions are currently demo flows (client-side handling, console logging, UI success state).
- `ProtectedRoute` exists but is not currently applied to any route in `App.js`.
- Translation data exists for EN/RU/HY, but not all page text is wired through translation keys yet.

## Additional Docs

- `MODERN_DESIGN.md` design notes
- `MULTILINGUAL.md` multilingual notes

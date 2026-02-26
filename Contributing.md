# Contributing Guide

Thanks for contributing to Flex Neon Web.

## Prerequisites

- Node.js 18+
- npm

## Local Setup

```bash
npm install
```

Create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Start the app:

```bash
npm start
```

## Development Workflow

1. Create a feature branch from `main`.
2. Make focused changes for a single concern.
3. Keep components, styles, and context updates consistent with the current structure in `src/`.
4. Prefer small, reviewable commits with clear commit messages.

## Branch Naming Convention

Use lowercase kebab-case and prefix by change type:

- `feature/<short-description>`
- `fix/<short-description>`
- `chore/<short-description>`
- `docs/<short-description>`
- `refactor/<short-description>`

Examples:

- `feature/order-preview-controls`
- `fix/google-auth-error-handling`
- `docs/update-contributing-guide`

## Project Structure Notes

- `src/pages/`: route-level pages
- `src/components/`: shared UI components
- `src/api/`: Axios client and auth service
- `src/context/`: auth context
- `src/i18n/`: language context and translation data

## Code Expectations

- Follow existing React and CSS patterns used in the repository.
- Keep naming explicit (`PageName.js`, `PageName.css`, service/context names by role).
- If you add user-facing text, consider whether EN/RU/HY translations should be updated.
- Avoid introducing unused dependencies.

## Validation Before PR

Run these commands before opening a pull request:

```bash
npm test
npm run build
```

If tests are updated or added, ensure they pass locally.

## Pull Request Checklist

- Change is scoped and documented in the PR description.
- UI changes include screenshots or short recordings when relevant.
- Environment variable changes are documented.
- Any routing/auth/i18n impact is called out explicitly.

## Related Docs

- `README.md`
- `MODERN_DESIGN.md`
- `MULTILINGUAL.md`

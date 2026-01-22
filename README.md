# Neon Roulette (Angular)

A Balatro-inspired roguelike roulette game built with Angular.

## Features
- Roguelike progression (Antes & Blinds)
- Scaling target scores and rewards
- Upgrade shop between rounds
- Pure Angular implementation (No React Native)

## Development
Run `npm start` for a local development server. Navigate to `http://localhost:4200/`.

## Deployment

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `npm run deploy:vercel`
3. Run `vercel` to deploy the `dist/neon-roulette/browser` folder (or just link your repo to Vercel).
   - **Framework Preset**: Angular
   - **Build Command**: `npm run deploy:vercel`
   - **Output Directory**: `dist/neon-roulette/browser`

### GitHub Pages
1. Run `npm run deploy:gh`
2. Use a tool like `angular-cli-ghpages` to deploy the `dist/neon-roulette/browser` folder.
   ```bash
   npx angular-cli-ghpages --dir=dist/neon-roulette/browser
   ```

## Configuration
- `vercel.json`: Handles client-side routing for Vercel.
- `angular.json`: Production build settings.
- `tsconfig.app.json`: Optimized production tsconfig.

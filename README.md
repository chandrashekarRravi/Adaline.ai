# Adaline Website Clone

A React + Tailwind CSS clone of the Adaline homepage featuring a Japanese garden background with scroll effects.

## Features

- **Exact Adaline Design**: Replicates the original Adaline homepage layout with precise typography, colors, and spacing
- **Japanese Garden Background**: Uses the first image (Japanese garden) as the background
- **Scroll Effects**:
  - Background image zooms out smoothly as you scroll
  - Intro elements (header, headline, logos) fade out smoothly on scroll
- **Responsive Design**: Built with Tailwind CSS for modern, responsive layouts

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your Japanese garden image:
   - Place your Japanese garden image in the `public` folder
   - Name it `japanese-garden.jpg`
   - Or update the image path in `src/App.jsx` (line 28)

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Image Requirements

- Place your Japanese garden image in the `public` folder
- Recommended name: `japanese-garden.jpg`
- The image will be used as a background with zoom effects

## Technologies

- React 18.3+
- Tailwind CSS 3.4+
- Vite 5.4+
- Inter font family (Google Fonts)

## Customization

The scroll effects can be adjusted in `src/App.jsx`:
- `zoomScale`: Controls background zoom (line 17)
- `introOpacity`: Controls fade out speed (line 20)



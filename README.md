# McMaster Study Places - Mobile Prototype

A medium-fidelity mobile prototype for a "Yelp for campus study places" application, built for a university assignment at McMaster University.

## Overview

This app helps students discover and review study spaces on the McMaster University campus. Users can browse study places, filter by noise level and crowd density, save favorites, set preferences, and leave reviews.

## Design & Branding

The app uses **McMaster's heritage colours** for consistent branding:

- **Primary Maroon** (`#7A003C`) - Main brand colour for headers, primary buttons, and active states
- **Accent Gold** (`#FDBF57`) - Accent colour for highlights, ratings, and secondary elements
- **Text Grey** (`#495965`) - Body text and secondary labels
- **Surface** (`#F5F5F7`) - Light neutral background for cards
- **Border** (`#E0E0E0`) - Light grey for dividers and borders

The design follows a light mode theme with white backgrounds, ensuring good contrast and readability.

## Features

- **Browse Study Places**: View a list of study spaces across campus with details like building, floor, noise level, and crowd density
- **Search & Filter**: Search by name or building, and filter by noise level, crowd level, and tags (Outlets, Group friendly, Near food)
- **Recommended Places**: Personalized recommendations based on user preferences
- **Place Details**: View detailed information about each study place, including reviews and ratings
- **Favorites**: Save favorite study places and toggle notifications for when they become quiet
- **Reviews**: Add ratings and reviews for study places
- **Preferences**: Set study preferences (noise level, need for outlets, preference for food nearby) to get personalized recommendations

## Technology Stack

- **React Native** with **Expo** (TypeScript)
- **React Navigation** (Bottom Tabs + Stack Navigator)
- **React Context** for global state management

## Project Structure

```
/src
  /components
    - PlaceCard.tsx          # Reusable card component for displaying study places
    - FilterChips.tsx         # Horizontal filter chip component
  /context
    - StudyPlacesContext.tsx # Global state management (favorites, visited, preferences, reviews)
  /data
    - places.ts              # Hard-coded sample data (8-10 study places)
  /navigation
    - RootNavigator.tsx      # Navigation setup (tabs + stack)
  /screens
    - HomeScreen.tsx         # Main listing screen with search and filters
    - PlaceDetailsScreen.tsx # Detailed view of a study place
    - FavoritesScreen.tsx    # List of favorited places
    - PreferencesScreen.tsx  # User preferences settings
  /theme
    - colors.ts              # McMaster colour palette
  /types.ts                  # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo Go app installed on your Android device

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Expo development server:
   ```bash
   npx expo start
   ```

3. Scan the QR code with Expo Go on your Android device

### Running on Android

- Make sure your Android device and computer are on the same network
- Open Expo Go on your Android device
- Scan the QR code displayed in the terminal or browser

### Running on Web

1. Start the web development server:
   ```bash
   npm run web
   ```

2. Open your browser to the URL shown (typically `http://localhost:8081`)

3. The app will display in a mobile-like container on desktop, or full-screen on mobile viewports

### Deploying to GitHub Pages

The app is configured to automatically deploy to GitHub Pages when you push to the `main` branch:

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: Select "GitHub Actions"

2. **Push to main branch** - The GitHub Actions workflow will automatically:
   - Build the web app
   - Deploy it to GitHub Pages

3. **Access your app** at: `https://[your-username].github.io/[repository-name]/`

The app is responsive and will display in a phone-like container on desktop browsers, or full-screen when viewed in mobile/phone mode (device width < 768px).

## Important Notes

⚠️ **This is a prototype for demonstration purposes only.**

- All data is **in-memory** and will reset when the app is restarted
- No backend or persistent storage is implemented
- The app is designed for **Expo Go on Android** as specified
- Sample data includes 8-10 fictionalized but McMaster-inspired study places

## Data Model

Each study place includes:
- Basic info (name, building, floor, description)
- Tags (e.g., "Quiet", "Outlets", "Group friendly", "Food nearby")
- Noise level (Quiet, Moderate, Loud)
- Crowd level (Empty, Some, Busy)
- Rating (1-5 average) and review count
- Favorite and visited status

## Assignment Context

This prototype was created for a university assignment at McMaster University. It demonstrates:
- React Native + Expo development
- TypeScript implementation
- Navigation patterns (tabs + stack)
- State management with Context API
- UI/UX design with McMaster branding
- Medium-fidelity wireframe implementation

---

**Note**: This app is for educational/demonstration purposes only and is not affiliated with McMaster University.


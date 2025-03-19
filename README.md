# Real Estate Property Listing Application

A mobile-responsive real estate application with property listings, viewing bookings, and Google Maps integration.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.x or later
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/downloads)

## Recommended VSCode Extensions

1. ESLint
2. Prettier
3. Tailwind CSS IntelliSense
4. TypeScript and JavaScript Language Features

## Environment Variables

1. Create a `.env` file in the root directory by copying `.env.example`:
```bash
copy .env.example .env
```

2. Fill in the following variables:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a web app to your project
4. Enable Google Authentication
5. Copy the configuration values to your `.env` file

## Google Maps Setup

1. Visit the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Maps JavaScript API
4. Create API credentials and copy the API key to your `.env` file

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd real-estate-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions and configurations
│   │   ├── pages/      # Page components
│   │   └── App.tsx     # Root React component
├── server/              # Backend Express server
│   ├── routes.ts       # API routes
│   └── storage.ts      # Data storage implementation
└── shared/             # Shared types and schemas
    └── schema.ts      # Database schema and types
```

## Features

- Property listing with images and details
- Property viewing booking system
- Google Maps integration for property location
- Firebase authentication
- Mobile-responsive design

## Development

- Use `npm run dev` to start the development server
- The server runs on port 5000 by default
- Hot reloading is enabled for both frontend and backend

## Debugging

1. Open the project in VSCode
2. Use the "Debug Server" launch configuration
3. Set breakpoints in your code
4. Press F5 to start debugging

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request
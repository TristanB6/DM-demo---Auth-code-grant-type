# Dailymotion OAuth Demo App

A simple demonstration of OAuth 2.0 authentication flow with the Dailymotion API. This app shows how to implement the Authorization Code grant type in a client-side application.

## Features

- OAuth 2.0 Authorization Code flow implementation
- Token management and display
- Automatic token refresh
- Token expiration countdown
- Visual indicators for token validity

## Prerequisites

- A Dailymotion account
- API credentials (public key and secret + callback URL)
- Node.js and npm installed

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Dailymotion API credentials:
   ```
   VITE_public_API_key=your_public_key
   VITE_public_API_key_secret=your_secret_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## How It Works

1. The app generates an authorization URL that redirects users to Dailymotion's login page
2. After authentication, Dailymotion redirects back with an authorization code
3. The app exchanges this code for access and refresh tokens
4. Tokens are stored in localStorage and displayed on the UI

## Security Note

This is a demo application using client-side OAuth implementation. For production use:
- Consider implementing server-side token exchange
- Use proper environment variable management
- Implement additional security measures

## Deployment

The app can be deployed to static hosting services like GitHub Pages or Netlify. Remember to:
- Set up environment variables in your hosting platform
- Use HTTPS in production
- Configure proper CORS settings

## Disclaimer

This is a demo application. The API keys used are for demonstration purposes only. For production applications, implement proper server-side authentication and security measures. 
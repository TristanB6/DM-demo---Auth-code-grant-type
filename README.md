# Dailymotion Authorization Code grant type

A simple demonstration of the Authorization Code grant type auth method in a client-side application. This demo shows how to obtain an access token on behalf of a Dailymotion user, allowing your application to make API requests with their permissions.

## Purpose and Use Case

This authorization flow is particularly useful when you need to:
- Access a user's Dailymotion data (like their videos, playlists, or channel information)
- Perform actions on behalf of the user (like uploading videos or managing their content)
- Create integrations that require user-specific permissions

For example, imagine you're building a video management dashboard where users can:
- View their Dailymotion upload statistics
- Schedule video uploads
- Manage their playlists
- Monitor their channel performance

In this case, you would need the user's permission to access their Dailymotion account. The authorization flow demonstrated here allows you to:
1. Request the user's permission through Dailymotion's login page
2. Obtain an access token that represents their authorization
3. Use this token to make API requests on their behalf

## Live Demo
Try it out: [https://tristanb6.github.io/DM-demo---Auth-code-grant-type/](https://tristanb6.github.io/DM-demo---Auth-code-grant-type/)

## Features

- Access token.
- Refresh token
- Token expiration countdown
- Scopes

## Prerequisites

- A Dailymotion account.
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

## How It Works - Step by Step Authentication Flow

### 1. Initial Setup
- The app is configured with your Dailymotion API credentials (public key and secret)
- A callback URL is set up where Dailymotion will redirect after authentication
- The app generates an authorization URL that includes:
  - Your app's public key
  - The callback URL
  - The permissions (scopes) your app needs

### 2. User Authentication
- When a user clicks the "Generate access token" button, they are redirected to Dailymotion's login page
- The user must:
  - Log in to their Dailymotion account (or create one if they don't have it)
  - Review and approve the permissions your app is requesting
  - Click "Allow" to grant access

### 3. Authorization Code
- After the user approves, Dailymotion redirects back to your app
- The redirect URL includes an authorization code in the URL parameters
- This code is temporary and can only be used once
- The app automatically extracts this code from the URL

### 4. Token Exchange
- The app sends the authorization code to Dailymotion's token endpoint
- Along with the code, it sends:
  - Your app's public key
  - Your app's secret key
  - The callback URL
- If everything is correct, Dailymotion responds with:
  - An access token (used to make API requests)
  - A refresh token (used to get new access tokens)
  - Token expiration time
  - Granted permissions (scopes)

### 5. Token Storage and Display
- The tokens are securely stored in the browser's localStorage
- The UI displays:
  - The access token
  - The refresh token
  - When the access token will expire
  - The granted permissions
- A countdown timer shows how long until the access token expires

### 6. Token Refresh
- When the access token expires, the app can use the refresh token to get a new one
- This happens automatically without requiring the user to log in again
- The new tokens are stored and displayed just like the original ones



## ⚠️ Important Security Warning

**This is a demo application only and should NOT be used in production.**

The current implementation is client-side only, which means:
- All requests to the Dailymotion API are visible in the browser's network tab
- The public API key and secret are exposed in the client-side code
- This setup is not secure and should never be used in production

**Important Note for Partners:**
- We do not recommend using this template as-is for production applications
- If you want to use this as inspiration, you MUST implement a server-side component to:
  - Securely handle API keys
  - Manage token exchange
  - Protect sensitive credentials

For production applications, always implement proper server-side authentication and security measures.

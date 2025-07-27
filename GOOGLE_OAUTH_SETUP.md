# Google OAuth Setup Guide for Ease Supply

This guide will help you set up Google OAuth authentication using Clerk for your Ease Supply application.

## Prerequisites

1. A Clerk account and application
2. A Google Cloud Console project
3. Your Next.js application running

## Step 1: Set Up Google OAuth in Google Cloud Console

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

### 1.2 Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Ease Supply"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `email`
   - `profile`
   - `openid`
5. Add test users (your email addresses for testing)

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Set the following:
   - Name: "Ease Supply Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://your-domain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/sign-in/[[...sign-in]]` (for development)
     - `http://localhost:3000/sign-up/[[...sign-up]]` (for development)
     - `https://your-domain.com/sign-in/[[...sign-in]]` (for production)
     - `https://your-domain.com/sign-up/[[...sign-up]]` (for production)
5. Click "Create"
6. **Save the Client ID and Client Secret** - you'll need these for Clerk

## Step 2: Configure Clerk for Google OAuth

### 2.1 Enable Google OAuth in Clerk Dashboard
1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to "User & Authentication" > "Social Connections"
4. Find "Google" and click "Configure"
5. Enter your Google OAuth credentials:
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
6. Save the configuration

### 2.2 Configure Redirect URLs in Clerk
1. In your Clerk Dashboard, go to "User & Authentication" > "Email, Phone, Username"
2. Add your redirect URLs:
   - `http://localhost:3000/sign-in/[[...sign-in]]`
   - `http://localhost:3000/sign-up/[[...sign-up]]`
   - `https://your-domain.com/sign-in/[[...sign-in]]` (for production)
   - `https://your-domain.com/sign-up/[[...sign-up]]` (for production)

### 2.3 Configure OAuth Redirect URLs in Google Cloud Console
Make sure your Google OAuth redirect URIs include:
- `https://clerk.your-domain.com/v1/oauth_callback`
- `https://clerk.your-domain.com/v1/oauth_callback/google`

## Step 3: Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLERK_WEBHOOK_SECRET=your_webhook_secret_here

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string_here
```

## Step 4: Test the Implementation

### 4.1 Start Your Development Server
```bash
npm run dev
```

### 4.2 Test Google Sign-In
1. Go to `http://localhost:3000/sign-in`
2. Click the "Continue with Google" button
3. You should be redirected to Google's OAuth consent screen
4. After authorization, you should be redirected back to your dashboard

### 4.3 Test Google Sign-Up
1. Go to `http://localhost:3000/sign-up`
2. Click the "Continue with Google" button
3. Complete the OAuth flow
4. Verify that a new user is created in your MongoDB database

## Step 5: Production Deployment

### 5.1 Update Google OAuth Settings
1. In Google Cloud Console, add your production domain to authorized origins and redirect URIs
2. Remove `localhost` URLs for production

### 5.2 Update Clerk Settings
1. In Clerk Dashboard, add your production domain to redirect URLs
2. Remove `localhost` URLs for production

### 5.3 Environment Variables
Make sure to set all environment variables in your production environment (Vercel, Netlify, etc.)

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Check that your redirect URIs in Google Cloud Console match exactly
   - Ensure Clerk redirect URLs are configured correctly

2. **"OAuth consent screen not configured"**
   - Make sure you've completed the OAuth consent screen setup
   - Add your email as a test user

3. **"Client ID not found"**
   - Verify your Google OAuth credentials in Clerk Dashboard
   - Check that you're using the correct Client ID and Secret

4. **"User not created in database"**
   - Check your webhook configuration in Clerk
   - Verify your MongoDB connection string
   - Check the webhook logs in Clerk Dashboard

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are loaded correctly
3. Test the webhook endpoint manually
4. Check Clerk Dashboard logs for authentication events

## Security Best Practices

1. **Never commit `.env.local` to version control**
2. **Use environment variables for all sensitive data**
3. **Regularly rotate your OAuth credentials**
4. **Monitor authentication logs for suspicious activity**
5. **Use HTTPS in production**

## Additional OAuth Providers

Clerk supports many other OAuth providers. To add more:

1. Go to Clerk Dashboard > "User & Authentication" > "Social Connections"
2. Configure additional providers (GitHub, Facebook, etc.)
3. Update your UI to include buttons for new providers
4. Follow the same pattern as Google OAuth implementation

## Support

If you encounter issues:

1. Check [Clerk Documentation](https://clerk.com/docs)
2. Check [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
3. Review your browser's network tab for failed requests
4. Check your application logs for errors 
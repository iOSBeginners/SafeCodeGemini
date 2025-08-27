# OAuth Setup for SafeCodeGemini

This fork of Google Gemini CLI requires OAuth credentials to authenticate with Google's services.

## Quick Setup

Set the following environment variables with the OAuth credentials from Google's official repository:

```bash
export GOOGLE_OAUTH_CLIENT_ID="<get_from_google_repo>"
export GOOGLE_OAUTH_CLIENT_SECRET="<get_from_google_repo>"
```

## About These Credentials

These are **public OAuth credentials** for installed applications (desktop/CLI apps). According to Google's OAuth2 documentation:

> "The process results in a client ID and, in some cases, a client secret, which you embed in the source code of your application. (In this context, the client secret is obviously not treated as a secret.)"

- **Source:** [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2#installed)
- **Original Google Code:** These credentials come directly from Google's official Gemini CLI repository

## Security Note

These credentials are safe to include in public repositories for installed applications. They are designed to be embedded in client-side code and are not considered secrets in this context.

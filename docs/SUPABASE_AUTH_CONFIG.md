# Supabase Configuration Guide

## Magic Link Redirect URIs

Para que el magic link funcione correctamente, debes configurar los siguientes redirect URIs en el Dashboard de Supabase:

1. **Development:**
   - `http://localhost:3000/`
   - `http://localhost:3000/#/auth`
   - `http://localhost:5173/` (Vite default)

2. **Production (Vercel):**
   - `https://life-o-sapp.vercel.app/`
   - `https://life-o-sapp.vercel.app/#/auth`
   - `https://yourdomain.com/` (if using custom domain)

## Steps to Configure:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project "Life OS"
3. Navigate to: **Authentication** → **URL Configuration**
4. Under "Redirect URLs", add all the URLs listed above
5. Click "Save"

## How It Works:

1. User clicks "Continue with Magic Link" on Auth page
2. Supabase sends email with magic link containing `access_token` in URL hash
3. User clicks link, redirects to configured redirect URI
4. Supabase SDK automatically detects token in URL (via `detectSessionInUrl: true`)
5. Session is established and user is authenticated
6. App redirects to `/dashboard` automatically

## Environment Variables:

Make sure these are set:
```
VITE_SUPABASE_URL=https://xdsfqkzokripprqmnzag.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Testing Magic Link Locally:

1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click "Continue with Magic Link"
4. Enter your email
5. Check your email for the magic link
6. Click the magic link - should redirect to `localhost:3000/#access_token=...`
7. Should automatically redirect to dashboard

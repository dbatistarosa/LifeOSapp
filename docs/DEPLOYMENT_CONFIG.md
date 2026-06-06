# Vercel Deployment Configuration

## Project Information
- **Vercel Project**: life-o-sapp
- **Project ID**: prj_UzkJosC566MWUoFNPszq69olLLQJ
- **Team ID**: team_XBPoblBJEATCWm6vAzUXBzJy
- **Production URL**: https://life-o-sapp.vercel.app
- **Node Version**: 24.x

## Configured Environment Variables

### Supabase Configuration
```
VITE_SUPABASE_URL=https://xdsfqkzokripprqmnzag.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhkc2Zxa3pva3JpcHBycW1uemFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MDY0NDMsImV4cCI6MjA5NjI4MjQ0M30.4v_yuQhQ6q14Aci7K8D4vprH0r5t5qODdZuh4TX6a94
```

### Stripe Configuration
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_<your-key>  # To be configured
```

### Anthropic Configuration
```
VITE_ANTHROPIC_API_KEY=<your-key>  # To be configured
```

## Supabase Project Details
- **Name**: Life OS
- **Region**: us-east-1
- **Database**: PostgreSQL 17.6.1.127
- **Status**: ACTIVE_HEALTHY
- **RLS Enabled**: Yes (all tables)

### Database Tables
1. **profiles** - User profiles with subscription tiers and settings
2. **checkins** - Daily check-ins for mood, stress, sleep, energy, etc.
3. **micro_actions** - Small daily habits and actions
4. **transactions** - Financial tracking
5. **financial_goals** - User financial goals
6. **squads** - Community teams/groups
7. **squad_members** - Squad membership management
8. **squad_challenges** - Team challenges
9. **squad_messages** - Squad messaging
10. **music_tracks** - Meditation and focus music library
11. **listening_history** - User listening history
12. **user_playlists** - Custom playlists
13. **sleep_records** - Sleep tracking data
14. **sleep_goals** - Personal sleep goals

## Deployment Settings

### Build Configuration
- **Framework**: Vite (React)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### SPA Configuration (vercel.json)
```json
{
  "rewrites": [
    {
      "source": "/((?!api/.*).*)",
      "destination": "/index.html"
    }
  ]
}
```

## Edge Functions Requirements

The following secrets should be configured in Supabase Edge Functions:
- `ANTHROPIC_API_KEY` - For AI-powered features
- `STRIPE_SECRET_KEY` - For payment processing
- `STRIPE_WEBHOOK_SECRET` - For Stripe webhook validation
- `RESEND_API_KEY` - For email notifications

## Next Steps

1. Configure Stripe publishable key in Vercel environment variables
2. Configure Anthropic API key in Vercel environment variables
3. Set up Stripe webhook endpoint
4. Configure email notifications with Resend (optional)
5. Test the deployment at https://life-o-sapp.vercel.app

## GitHub Integration
- Repository: dbatistarosa/LifeOSapp
- Connected: Yes
- Auto-deploy: Yes (on main branch)
- Preview deployments: Yes (on pull requests)

# Vercel Deployment Guide for ERP React App

## Prerequisites
- GitHub/GitLab/Bitbucket repository with your code
- Vercel account (free tier available)
- Supabase project with production database

## Step-by-Step Deployment

### 1. Prepare Your Repository
Ensure these files are committed to your repository:
- `vercel.json` - Vercel configuration
- `package.json` - Dependencies and build scripts
- `.env.production` - Production environment template

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your repository
4. Select the repository containing your ERP React app

### 3. Configure Build Settings
Vercel should auto-detect your React app. Verify these settings:
- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 4. Set Environment Variables
In your Vercel project dashboard:
1. Go to "Settings" → "Environment Variables"
2. Add these variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL | Production |
| `REACT_APP_SUPABASE_ANON_KEY` | Your Supabase anon key | Production |
| `REACT_APP_ENVIRONMENT` | `production` | Production |

**Important**: Get these values from your Supabase project dashboard.

### 5. Deploy
1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## Post-Deployment Configuration

### Supabase Configuration
1. In your Supabase dashboard, go to "Settings" → "API"
2. Add your Vercel domain to "Site URL" and "Redirect URLs":
   - `https://your-project-name.vercel.app`
   - `https://your-project-name.vercel.app/**`

### Custom Domain (Optional)
1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Update Supabase URLs accordingly

## Troubleshooting

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### Runtime Errors
- Check browser console for errors
- Verify Supabase connection
- Check network requests in browser dev tools

### Environment Variables Not Working
- Ensure variables start with `REACT_APP_`
- Redeploy after adding new environment variables
- Check variable names match exactly

## Automatic Deployments
- Vercel automatically deploys when you push to your main branch
- Preview deployments are created for pull requests
- You can configure deployment branches in project settings

## Performance Optimization
Your `vercel.json` includes:
- Static asset caching for 1 year
- SPA routing configuration
- Optimized build settings

## Security Notes
- Never commit `.env.local` or production secrets to Git
- Use Vercel's environment variables for sensitive data
- Regularly rotate API keys and tokens
- Enable Supabase RLS (Row Level Security) policies

## Support
- Vercel Documentation: https://vercel.com/docs
- Supabase Documentation: https://supabase.com/docs
- React Documentation: https://reactjs.org/docs

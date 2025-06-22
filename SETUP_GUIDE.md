# TaskGenius MVP - Quick Setup Guide

## 🚀 Your Configuration Status

✅ **Clerk Authentication**: Keys provided and configured
⏳ **Neon Database**: Needs setup
⏳ **Google AI Studio**: Needs API key

## 📋 Step-by-Step Setup

### 1. Environment Variables Setup

Create a `.env.local` file in your project root with these values:

\`\`\`env
# Your Clerk Keys (Already Configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YXdha2UtYmx1ZWpheS05NC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_Du9s29afPvFICFgrz408J612oHSCIrJLe0rqJ40rJy

# Clerk URLs (Pre-configured)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database - Get from Neon.tech (Step 2)
DATABASE_URL=your_neon_database_url_here

# Google AI - Get from Google AI Studio (Step 3)
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
\`\`\`

### 2. Set Up Neon Database (Free)

1. **Go to [Neon.tech](https://neon.tech)**
2. **Sign up** with GitHub or email
3. **Create a new project**:
   - Project name: `taskgenius-mvp`
   - Database name: `taskgenius`
   - Region: Choose closest to you
4. **Copy the connection string** from the dashboard
5. **Add to your `.env.local`** as `DATABASE_URL`

### 3. Get Google AI Studio API Key (Free)

1. **Go to [Google AI Studio](https://aistudio.google.com)**
2. **Sign in** with your Google account
3. **Click "Get API Key"** in the top right
4. **Create API Key** → **Create API key in new project**
5. **Copy the API key**
6. **Add to your `.env.local`** as `GOOGLE_AI_API_KEY`

### 4. Install and Run

\`\`\`bash
# Install dependencies
npm install

# Generate database schema
npm run db:generate

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
\`\`\`

### 5. Test Your Setup

1. **Open** `http://localhost:3000`
2. **Sign up** for a new account
3. **Try generating tasks** with a topic like "Learn React"
4. **Verify** tasks are saved and can be managed

## 🔧 Troubleshooting

### Database Issues
- Ensure your Neon database URL is correct
- Check if the database is active (not sleeping)
- Run `npm run db:migrate` if tables are missing

### Authentication Issues
- Verify Clerk keys are correctly copied
- Check if your Clerk application is active
- Ensure URLs match your domain settings in Clerk

### AI Generation Issues
- Confirm Google AI Studio API key is valid
- Check if you have quota remaining
- Verify the API key has Gemini Pro access

## 🚀 Ready to Deploy?

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

### Database (Already on Neon)
Your database is already cloud-hosted and ready for production.

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure your API keys are active and have proper permissions
4. Check the terminal for any error messages

Your Clerk authentication is already configured, so you're 2 steps away from having a fully functional AI-powered task management app! 🎉

# SkillUp Production Setup Guide

Welcome to the SkillUp platform source code. This guide will help you configure your production environment and connect the backend.

## 1. Supabase Backend Setup

This project uses Supabase for authentication, PostgreSQL database, and Row Level Security (RLS).

1. Create a new project at [Supabase](https://supabase.com/).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Open the file `supabase/migrations/00_initial_schema.sql` located in this repository.
4. Copy the entire contents of the file and paste it into the SQL Editor.
5. Click **Run** to execute the script. This will create all necessary tables, types, triggers, and RLS policies for your platform to function securely.

## 2. Environment Variables

You need to connect your frontend application to your Supabase project.

1. Rename the `.env.example` file to `.env.local` for local development, or configure these variables in your hosting provider (e.g., Vercel, Netlify).
2. Go to your Supabase Project Settings -> API.
3. Copy the **Project URL** and paste it as `VITE_SUPABASE_URL`.
4. Copy the **anon / public** key and paste it as `VITE_SUPABASE_ANON_KEY`.

**Example:**
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

## 3. Running the App

Once the environment variables are set:

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. To build for production: `npm run build`

## Security Notes
- The database is secured using Postgres Row Level Security (RLS). Ensure you do not disable this.
- Do NOT expose your Supabase `service_role` key anywhere in this frontend application. The `anon` key is strictly required and is safe to expose to the client.

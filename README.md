# Handmade Gift Business Website

A modern web application for a handmade gift business specializing in weddings, engagements, birthdays, and special celebrations.

## Tech Stack

- **Next.js 15+** with App Router
- **JavaScript** (no TypeScript)
- **TailwindCSS v4.x** for styling
- **Prisma ORM** with SQLite database
- **Clerk** for authentication

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

3. Initialize the database:
\`\`\`bash
npx prisma db push
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

\`\`\`
/app                 # Next.js App Router pages
/components          # Reusable React components
/lib                 # Utility functions and configurations
/prisma              # Database schema and migrations
/public              # Static assets
\`\`\`

## Features

- User authentication with role-based access
- Product catalog with categories
- Admin dashboard for content management
- User-to-user messaging system
- Responsive design inspired by skorganizasyon.com

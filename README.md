# RNS ProjectKart

## Overview
RNS ProjectKart is a modern web application designed for comprehensive project and order management. Built with performance and user experience in mind, it leverages a robust tech stack to deliver a seamless interface for administrators and users.

## Technology Stack
- **Frontend Framework**: React (via Vite)
- **Styling**: Tailwind CSS, Shadcn UI (inferred), Framer Motion for animations
- **Database**: Supabase (PostgreSQL)
- **State Management & Data Fetching**: React Hooks, Supabase Client
- **Icons**: Lucide React, Tabler Icons

## Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd RNS-User-View
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### building for Production
To create a production-ready build:
```bash
npm run build
```

## Project Structure
- `/src`: Source code including components, pages, and hooks.
- `/supabase`: Database migrations and configuration.
- `/public`: Static assets.

## Database Setup
This project uses Supabase. Ensure you have the correct environment variables set up in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Required tables and policies are defined in the SQL migration files (ensure these are applied if setting up a fresh instance).

## License
[License Information]

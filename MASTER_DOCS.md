# RNS ProjectKart

## 1. Overview
RNS ProjectKart is a modern web application designed for comprehensive project and order management. Built with performance and user experience in mind, it leverages a robust tech stack to deliver a seamless interface for administrators and users.

## 2. Technology Stack
- **Frontend**: React 18 (Vite), Tailwind CSS, Framer Motion, Shadcn UI
- **Backend & Database**: Supabase (PostgreSQL), Edge Functions
- **AI Integration**: Google Gemini API (`gemini-pro`) for the "Lumo" chatbot
- **Icons**: Lucide React, Tabler Icons

## 3. Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm

### Installation
1. Clone the repository: `git clone <repository-url>`
2. Navigate to directory: `cd RNS-User-View`
3. Install dependencies: `npm install`
4. Create `.env` file with:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### Running the Application
```bash
npm run dev
# App available at http://localhost:5173
```

## 4. Key Features & Modules

### A. Projects Management
- **Display**: Grid view with categories (Hardware, Software, Integration).
- **Search**: Real-time filtering by title and description.
- **Details Page**: Interactive gallery, 3D badge, and specifications.

### B. Order System
- **Direct Checkout**: "Buy Now" flow creating pending orders.
- **Customization**: Wizard for custom requirements and synopsis upload.

### C. AI Assistant ("Lumo")
- Floating chatbot powered by Gemini Pro to assist users with project queries.

## 5. Database Schema
- **projects**: Stores details, packages (JSONB), and specs.
- **reviews**: Customer feedback linked to projects.
- **orders**: Purchase records with status tracking.

## 6. Project Structure
- `/src/components`: UI components and Modals.
- `/supabase`: Database migrations.
- `/public`: Static assets.

## License
[License Information]

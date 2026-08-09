# SkillUp - Modern E-Learning Platform 🎓

> A premium, full-stack e-learning platform designed with modern UI/UX principles, featuring robust authentication, role-based access control, and dynamic dashboards.

![SkillUp Preview](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200)

## 🌟 Overview

**SkillUp** is a responsive web application built to simulate a high-end educational platform. It bridges the gap between expert instructors and eager students by providing a seamless interface for browsing courses, managing progress, and handling secure transactions.

This project was built to demonstrate advanced proficiency in modern frontend architecture, state management, and Backend-as-a-Service (BaaS) integration.

## ✨ Key Features

- **🎨 Premium UI/UX Design**: Built with Tailwind CSS, featuring glassmorphism, subtle grain textures, curated color palettes, and micro-animations for a high-end feel.
- **🔐 Secure Authentication**: Integrated with Supabase Auth for secure sign-up, login, and session management.
- **🛡️ Role-Based Access Control (RBAC)**: Custom routing protection (`ProtectedRoute`, `AdminRoute`) to differentiate between `Student`, `Instructor`, and `Admin` privileges.
- **📱 Fully Responsive**: Flawless experience across desktop, tablet, and mobile devices with interactive mobile navigation.
- **📊 Dynamic Dashboards**: Separate, protected dashboard experiences for users and administrators to manage their specific data.
- **🚀 High Performance**: Built with Vite & React for lightning-fast HMR and optimized production builds.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS & Vanilla CSS (Custom tokens)
- **UI Components**: Radix UI (Headless) + Custom integrations
- **Icons**: Lucide React
- **Backend & Database**: Supabase (PostgreSQL)
- **Language**: TypeScript
- **Build Tool**: Vite

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/skillup.git
   cd skillup
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 🗄️ Database Schema (Supabase)
This project relies on a custom PostgreSQL schema with Row Level Security (RLS) policies. To replicate the backend:
1. Go to your Supabase SQL Editor.
2. Run the provided SQL setup script (available in the project documentation or setup files) to create the `profiles`, `courses`, and `enrollments` tables along with their respective RLS policies and trigger functions.

## 👨‍💻 About the Developer

I built this project to showcase my ability to develop full-stack applications with a strong emphasis on frontend aesthetics and user experience, while securely connecting to a scalable backend. 

If you are a hiring manager or recruiter looking for a developer who cares about both the code architecture and the final user experience, feel free to reach out!

---
*Built with passion and ❤️*

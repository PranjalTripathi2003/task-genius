# TaskGenius - AI-Powered Task Management

A full-stack web application that leverages Google Gemini AI to generate and manage tasks with complete CRUD operations, user authentication, and progress visualization.

## 🚀 Features

- **AI Task Generation**: Generate 5 actionable tasks from any topic using Google Gemini AI
- **User Authentication**: Secure sign-up/sign-in with Clerk
- **CRUD Operations**: Create, read, update, and delete tasks
- **Progress Tracking**: Visual progress indicators and completion statistics
- **Task Management**: Edit tasks, mark as complete, categorize, and filter
- **Responsive Design**: Mobile-first design with Tailwind CSS and ShadCN UI
- **Real-time Updates**: Live progress updates and task synchronization

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Modern UI components
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Relational database (Neon.tech)
- **Drizzle ORM** - Type-safe database operations
- **Google Gemini AI** - AI task generation

### Authentication & Deployment
- **Clerk** - User authentication and management
- **Vercel** - Frontend deployment
- **Neon** - PostgreSQL database hosting
- **Docker** - Containerization support

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or Neon.tech)
- Google AI Studio API key
- Clerk account for authentication

## 🔧 Installation & Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd taskgenius-mvp
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `GOOGLE_AI_API_KEY`: Your Google AI Studio API key
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
   - `CLERK_SECRET_KEY`: Your Clerk secret key

4. **Database Setup**
   \`\`\`bash
   npm run db:generate
   npm run db:migrate
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🐳 Docker Setup

1. **Build and run with Docker Compose**
   \`\`\`bash
   docker-compose up --build
   \`\`\`

2. **Access the application**
   Navigate to `http://localhost:3000`

## 📚 API Documentation

### Authentication
All API routes require authentication via Clerk.

### Endpoints

#### Generate Tasks
- **POST** `/api/generate-tasks`
- **Body**: `{ "topic": "Learn Python" }`
- **Response**: Array of 5 AI-generated tasks

#### Tasks CRUD
- **GET** `/api/tasks` - Get all user tasks
- **POST** `/api/tasks` - Create multiple tasks
- **PATCH** `/api/tasks/[id]` - Update a specific task
- **DELETE** `/api/tasks/[id]` - Delete a specific task

#### Task Statistics
- **GET** `/api/tasks/stats` - Get user's task statistics

## 🎯 Key Features Implemented

### ✅ Core Requirements
- [x] User authentication with Clerk
- [x] Google Gemini AI integration for task generation
- [x] Full CRUD operations for tasks
- [x] PostgreSQL database with Drizzle ORM
- [x] ShadCN UI components with Tailwind CSS
- [x] Task completion status and progress visualization
- [x] Docker containerization
- [x] TypeScript throughout
- [x] Proper error handling and validation

### ✅ Enhanced Features
- [x] Real-time progress tracking
- [x] Task categorization and filtering
- [x] Search functionality
- [x] Responsive mobile design
- [x] Toast notifications
- [x] Loading states and error handling
- [x] Task editing with modal dialogs
- [x] Category-based progress breakdown

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render.com)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Add environment variables
4. Deploy with Docker or Node.js

### Database (Neon.tech)
1. Create a new project on Neon
2. Copy the connection string to your environment variables
3. Run migrations: `npm run db:migrate`

## 📱 Usage

1. **Sign Up/Sign In**: Create an account or sign in with existing credentials
2. **Generate Tasks**: Enter a topic (e.g., "Learn React") and click "Generate"
3. **Manage Tasks**: Edit, delete, or mark tasks as complete
4. **Track Progress**: View your completion statistics and category breakdown
5. **Filter & Search**: Use filters to find specific tasks

## 🔍 Project Structure

\`\`\`
├── app/
│   ├── api/                 # API routes
│   ├── dashboard/           # Dashboard page
│   ├── sign-in/            # Authentication pages
│   ├── sign-up/
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ui/                 # ShadCN UI components
│   ├── task-generator.tsx  # AI task generation
│   ├── task-list.tsx       # Task management
│   └── progress-overview.tsx # Progress tracking
├── lib/
│   └── db/                 # Database configuration
├── docker-compose.yml      # Docker setup
└── drizzle.config.js      # Database migrations
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the environment variables are correctly set
2. Ensure your database is running and accessible
3. Verify your API keys are valid
4. Check the console for error messages

For additional help, please create an issue in the GitHub repository.

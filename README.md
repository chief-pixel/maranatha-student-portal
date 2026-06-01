# Maranatha Christian College Student Portal

A comprehensive student learning management system for Maranatha Christian College that enables students to view their subjects, download assignments, and submit work while allowing teachers to manage courses and upload tasks.

## Features

### Student Features
- **Secure Login** with unique student identity keys
- **Subject Management** - View all enrolled subjects
- **Task Access** - Download assignments and tasks from teachers
- **Submission System** - Submit completed work

### Teacher Features
- **Course Management** - Create and manage subjects
- **Task Uploading** - Upload assignments with due dates
- **Grade Management** - View student submissions and provide feedback

### Admin Features
- **User Management** - Manage students, teachers, and administrators
- **Subject Assignment** - Enroll students in subjects

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Vercel (recommended)

## Installation

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 12+ database
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd maranatha-student-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup PostgreSQL Database**
   ```bash
   # Create a new database
   createdb maranatha_db
   
   # Run the schema file
   psql -U postgres -d maranatha_db -f db/schema.sql
   ```

4. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/maranatha_db
   JWT_SECRET=your-super-secret-key-change-in-production
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NODE_ENV=development
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new student
- `POST /api/auth/login` - Login with student ID and password

### Subjects
- `GET /api/subjects` - Get all subjects for the logged-in student
- `POST /api/subjects` - Create a new subject (teachers only)

### Tasks
- `GET /api/tasks?subjectId=<id>` - Get tasks for a specific subject
- `POST /api/tasks` - Upload a new task (teachers only)
- `POST /api/tasks` (action=submit) - Submit a task (students)

## Database Schema

The application uses the following main tables:

- **users** - Student, teacher, and admin accounts
- **subjects** - Course/subject information
- **student_subjects** - Enrollment mapping (many-to-many)
- **tasks** - Assignments and work items
- **submissions** - Student submissions and grades

## Default User Roles

- **Student**: Can view subjects, download tasks, and submit work
- **Teacher**: Can create subjects, upload tasks, and grade submissions
- **Admin**: Full system access

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- CORS configuration (to be added)
- Environment variable protection

## Future Enhancements

- [ ] Email notifications for new tasks
- [ ] Real-time notifications
- [ ] Discussion forums per subject
- [ ] Grade analytics dashboard
- [ ] File upload to cloud storage (AWS S3, etc.)
- [ ] Mobile app with React Native
- [ ] Two-factor authentication
- [ ] Activity audit logging

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or create an issue in the repository.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set environment variables in Vercel dashboard
5. Deploy

### Deploy to Other Platforms

The application can also be deployed to:
- Heroku
- AWS
- DigitalOcean
- Self-hosted servers

## Changelog

### Version 1.0.0 (Initial Release)
- Student login and registration
- Subject listing
- Task management
- Basic submission system

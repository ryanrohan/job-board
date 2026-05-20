# Job Board

A full-stack job board application where employers can post listings and applicants can apply. Built to demonstrate a modern web development stack including GraphQL, containerization, testing, and CI/CD.

**[Live Demo](https://job-board-ryan-rohan.vercel.app)**

## Tech Stack

**Frontend:** Next.js, TypeScript, Apollo Client, Zustand, Tailwind CSS  
**Backend:** Node.js, Apollo Server, GraphQL, Prisma  
**Database:** PostgreSQL  
**DevOps:** Docker, docker-compose, GitHub Actions  
**Testing:** Jest, Cypress  

## Features

- Role-based auth (employer / applicant) with JWT
- Employers can post job listings
- Applicants can browse and apply to listings
- Fully containerized with Docker
- CI/CD pipeline runs unit and e2e tests on every push

## Running Locally

### Prerequisites
- Docker and docker-compose
- Node.js 20+

### Steps

1. Clone the repo
```bash
   git clone https://github.com/YOUR_USERNAME/job-board.git
   cd job-board
```

2. Start all services
```bash
   docker-compose up --build
```

3. Run database migrations
```bash
   docker-compose exec backend npx prisma migrate deploy
```

4. Open the app at `http://localhost:3000`

## Running Tests

**Unit tests (Jest):**
```bash
cd backend
npm test
```

**End-to-end tests (Cypress):**
```bash
# Make sure the app is running first
cd frontend
npx cypress run
```

## Project Structure

```
job-board/
├── backend/         # Node.js GraphQL API
│   ├── prisma/      # Database schema and migrations
│   └── src/         # TypeScript source
├── frontend/        # Next.js app
│   ├── app/         # App router pages
│   ├── lib/         # Apollo client setup
│   └── store/       # Zustand state
└── docker-compose.yml
```

## Deployment

- **Frontend**: Vercel — https://job-board-ryan-rohan.vercel.app
- **Backend**: Render — https://job-board-backend-hewd.onrender.com
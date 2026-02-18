# ProposalIQ

An AI-powered RFP (Request for Proposal) response tool that helps organizations create professional, comprehensive proposal responses efficiently.

## Tech Stack

### Frontend
- **React** with TypeScript
- Create React App (CRA)

### Backend
- **Node.js** with Express
- TypeScript
- PostgreSQL database

## Project Structure

```
proposaliq/
├── frontend/          # React frontend application
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── backend/           # Node.js/Express API
│   ├── src/
│   │   ├── config/    # Configuration files (database, etc.)
│   │   ├── controllers/  # Route controllers
│   │   ├── models/    # Database models
│   │   ├── routes/    # API routes
│   │   ├── middleware/   # Custom middleware
│   │   └── server.ts  # Express server entry point
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. Install PostgreSQL if not already installed
2. Create a new database:
```sql
CREATE DATABASE proposaliq;
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Copy the environment example file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your database credentials and other configuration

4. Install dependencies:
```bash
npm install
```

5. Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Copy the environment example file:
```bash
cp .env.example .env
```

3. Update the `.env` file if needed

4. Install dependencies (if not already done):
```bash
npm install
```

5. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build

### Frontend
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run eject` - Eject from CRA (one-way operation)

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret for JWT tokens
- `OPENAI_API_KEY` - API key for AI integration

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_ENV` - Environment

## Contributing

Please follow the existing code style and structure when contributing to this project.

## License

ISC

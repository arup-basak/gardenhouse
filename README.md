# GardenHouse

This project consists of three main components: a Next.js dashboard, a chat server, and a main server. Each component is containerized using Docker for consistent deployment.

## Components

### 1. Dashboard (Next.js)
A web-based dashboard built with Next.js and running on Bun.

#### Docker Configuration
- Base image: `oven/bun`
- Exposed port: 3000
- Production-ready build with multi-stage configuration
- Runs with non-root user for security

### 2. Chat Server
A real-time chat server built with Socket.IO, Express, and TypeScript.

#### Docker Configuration
- Base image: `node:20-slim`
- Exposed port: 5000
- Uses pnpm for package management
- Includes Prisma for database operations

### 3. Main Server
RESTful API server handling user operations, authentication, and orders.

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Build and run the containers:
```bash
docker-compose up --build
```

## API Documentation

### Main Server Endpoints

#### User Operations
- `POST /api/v1/user`: Create user
- `GET /api/v1/user/:id`: Get user
- `PUT /api/v1/user/:id`: Update user
- `DELETE /api/v1/user/:id`: Delete user

#### Authentication
- `POST /api/v1/auth/register`: Register
- `POST /api/v1/auth/login`: Login
- `GET /api/v1/auth/me`: Get current user

#### Orders
- `GET /api/v1/order`: Get all orders
- `POST /api/v1/order`: Create order
- `PUT /api/v1/order/:id`: Update order

### Chat Server Endpoints

#### Admin Namespace (/admin)
- Connection events
- Chat assignment
- Message handling
- Chat management

#### User Namespace (/user)
- Chat initiation
- Message sending
- Chat termination

## Development

### Dashboard
```bash
cd dashboard
bun install
bun run dev
```

### Chat Server
```bash
cd chat-server
pnpm install
pnpm run dev
```

### Main Server
```bash
cd server
npm install
npm run dev
```

## Deployment

The project uses Docker for containerization, making it easy to deploy in any environment that supports Docker.

1. Build the images:
```bash
docker build -t dashboard ./dashboard
docker build -t chat-server ./chat-server
docker build -t main-server ./server
```

2. Run the containers:
```bash
docker-compose up
```

## Environment Variables

Each component requires specific environment variables. Create `.env` files in each component directory:

### Dashboard
- `PORT`: Default 3000
- `HOSTNAME`: Default "0.0.0.0"

### Chat Server
- `PORT`: Default 5000
- `FRONTEND_URL`: Frontend URL for CORS
- Database connection variables for Prisma

### Main Server
- Authentication secrets
- Database connection details
- API configuration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

[Your chosen license]
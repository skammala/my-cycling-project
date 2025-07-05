# 🚴 Cycling App

A comprehensive application for cyclists that integrates maps, routing tools, community features, and crowdsourced data for reporting obstacles, traffic, and weather conditions.

## 🏗️ Project Structure

```
my-cycling-project/
├── client/                     # React + TypeScript frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API calls and external services
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   ├── styles/            # CSS/SCSS files
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
├── server/                     # Express + TypeScript backend
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API route definitions
│   │   ├── middleware/        # Custom middleware
│   │   ├── services/          # Business logic and external API calls
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   ├── config/            # Configuration files
│   │   └── app.ts             # Express app setup
│   ├── package.json
│   └── tsconfig.json
├── shared/                     # Shared types and utilities
│   ├── types/
│   └── utils/
├── docs/                       # Documentation
├── .gitignore
├── package.json               # Root package.json for scripts
└── README.md
```

## 🚀 Features

- **Interactive Maps**: MapBox integration for detailed cycling maps
- **Route Planning**: OpenRouteService integration for optimal cycling routes
- **Crowdsourced Data**: Report and view obstacles, traffic, and weather conditions
- **Real-time Updates**: Live data from community reports
- **User Preferences**: Personalized route recommendations
- **Mobile Responsive**: Works seamlessly on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **MapBox GL JS** for interactive maps
- **Styled Components** for styling
- **React Query** for data fetching
- **Axios** for HTTP requests

### Backend
- **Express.js** with TypeScript
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Helmet** for security
- **CORS** for cross-origin requests
- **Morgan** for logging

### External Services
- **MapBox API** for maps and geocoding
- **OpenRouteService** for route calculation
- **Weather API** for weather data

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (local or cloud)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/skammala/my-cycling-project.git
   cd my-cycling-project
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment example files
   cp server/.env.example server/.env
   
   # Edit the environment variables
   nano server/.env
   ```

4. **Start development servers**
   ```bash
   # Start both client and server
   npm run dev
   
   # Or start individually
   npm run dev:client  # Frontend on http://localhost:3000
   npm run dev:server  # Backend on http://localhost:3001
   ```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build all packages
- `npm run test` - Run tests across all packages
- `npm run lint` - Lint all packages
- `npm run clean` - Clean all build artifacts

### Client
- `npm run dev:client` - Start React development server
- `npm run build:client` - Build React app for production
- `npm run test:client` - Run client tests

### Server
- `npm run dev:server` - Start Express development server
- `npm run build:server` - Build server for production
- `npm run start:server` - Start production server
- `npm run test:server` - Run server tests

## 🌐 API Endpoints

### Base URL: `http://localhost:3001`

- `GET /` - API information
- `GET /health` - Health check
- `GET /api/obstacles` - Get all obstacles
- `POST /api/obstacles` - Report new obstacle
- `GET /api/routes` - Get cycling routes
- `POST /api/routes` - Create new route
- `GET /api/weather` - Get weather data
- `GET /api/traffic` - Get traffic data

## 📝 Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/cycling-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# MapBox Configuration
MAPBOX_ACCESS_TOKEN=your-mapbox-access-token-here

# OpenRouteService Configuration
OPENROUTE_SERVICE_API_KEY=your-openroute-service-api-key-here
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Shiva Kammala**
- GitHub: [@skammala](https://github.com/skammala)

## 🙏 Acknowledgments

- MapBox for mapping services
- OpenRouteService for routing calculations
- The cycling community for inspiration

# INF CommApp - Healthcare Communication Dashboard

A modern React TypeScript frontend for the healthcare communication system, built with Vite and designed for healthcare facility management.

## 🏥 Features

- **Healthcare Dashboard**: Real-time overview of facilities, residents, and staff
- **Facility Management**: Manage care facilities and their operations
- **Resident Care**: Track residents and their care requirements
- **Staff Management**: Healthcare staff coordination and communication
- **Real-time Notifications**: Instant alerts for critical healthcare events
- **Responsive Design**: Mobile-friendly interface for healthcare environments

## 🚀 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Real-time**: SignalR (Microsoft)
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Your .NET API running on `http://localhost:5000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Lint code
npm run lint
```

### Development Server

The app will be available at: **http://localhost:3000**

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout/         # Layout components (Header, Sidebar)
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Facilities.tsx  # Facility management
│   ├── Residents.tsx   # Resident management
│   ├── Staff.tsx       # Staff management
│   ├── Notifications.tsx # Notification center
│   └── Login.tsx       # Authentication
├── services/           # API services and utilities
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## 🎨 Figma Integration

This project is optimized for Figma design integration:

- **Component-first architecture** for easy design system mapping
- **Tailwind CSS classes** that align with design tokens
- **Flexible layout system** for responsive healthcare interfaces
- **Healthcare-themed color palette** and typography

### Using Figma Designs

1. Export your Figma components as React code
2. Copy the generated JSX into new components in `src/components/`
3. Adjust Tailwind classes to match your design system
4. Add TypeScript interfaces for component props
5. Integrate with your healthcare data models

## 🏥 Healthcare-Specific Features

### Color System
- **Primary Blue**: Professional healthcare branding
- **Success Green**: Positive health indicators
- **Warning Orange**: Attention-required states  
- **Danger Red**: Critical alerts and emergencies

### Components
- **Priority Indicators**: Visual priority levels for notifications
- **Healthcare Cards**: Facility, resident, and staff information cards
- **Alert System**: Real-time notification display
- **Dashboard Widgets**: Healthcare metrics and statistics

## 🔗 API Integration

The frontend connects to your existing .NET API:

```typescript
// API Base URL (configured in vite.config.ts)
const API_BASE = '/api'

// Endpoints
GET    /api/facilities     # List facilities
GET    /api/residents      # List residents  
GET    /api/staff          # List staff
GET    /api/notifications  # List notifications
POST   /api/auth/login     # Authentication
```

### Real-time Updates

SignalR integration for live updates:
- Facility notifications
- Emergency alerts
- Staff status changes
- Resident care updates

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 📦 Deployment

### Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Variables

Create `.env` files for different environments:

```bash
# .env.development
VITE_API_URL=http://localhost:5000/api
VITE_SIGNALR_URL=http://localhost:5000/hubs

# .env.production  
VITE_API_URL=https://your-api-domain.com/api
VITE_SIGNALR_URL=https://your-api-domain.com/hubs
```

## 👥 Healthcare User Roles

The interface supports different healthcare user roles:

- **Administrator**: Full system access
- **Facility Manager**: Facility operations
- **Nurse/CNA**: Resident care and notifications  
- **Doctor**: Clinical oversight and emergency responses

## 📱 Mobile Support

- **Progressive Web App (PWA)** ready
- **Responsive design** for tablets and phones
- **Touch-friendly** interface for healthcare environments
- **Offline capability** for critical functions

## 🔧 VS Code Configuration

Recommended VS Code extensions:
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Prettier - Code formatter

## 🤝 Contributing

1. Follow healthcare data privacy guidelines
2. Use TypeScript strict mode
3. Write accessible components (WCAG 2.1)
4. Test on mobile devices
5. Document healthcare-specific workflows

## 📄 License

This project is part of the INF CommApp healthcare communication system.
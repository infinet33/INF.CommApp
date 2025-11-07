# Valencia Assisted Living Dashboard

A comprehensive healthcare facility management dashboard for assisted living communication and administration at the facility level.

## 🏥 Overview

The Valencia Assisted Living Dashboard is designed for "Valencia Assisted Living of Cottonwood" to manage residents, staff, vendors, external care providers, and facility communications in one unified platform.

## ✨ Features

### Residents Management
- Full CRUD operations for resident profiles
- Comprehensive medical information tracking
- Emergency contacts and insurance management
- Medical alerts and care level tracking
- Search and filter by care level
- Pagination support

### Staff Management
- Complete staff directory with CRUD operations
- Role-based organization (Care Coordinator, Nurse, Administrator, etc.)
- Department and shift tracking
- Contact information management
- Search and filter by role

### Vendors Management
- Vendor relationship management
- Categorization by type (Home Health, Hospice, Pharmacy, etc.)
- Contact and address tracking
- Status management (Active/Inactive)
- Notes and communication history

### Users Management
- External care provider management (Doctors, Therapists, etc.)
- Organization and specialty tracking
- Contact information and credentials
- Integration with messaging system

### Messaging System
- **Admin View**: Full conversation management across all residents
- **Family View**: Filtered conversations for family members
- Real-time communication between staff, families, and care providers
- Role-based message identification
- Unread message tracking
- Featured partner integration for vendor marketing

## 🎨 Design System

### Color Scheme
- **Primary Blue**: `#2563eb` - Main actions, staff role
- **Success Green**: `#16a34a` - Success states, active status
- **Warning Orange**: `#d97706` - Warning states, attention needed
- **Danger Red**: `#dc2626` - Critical alerts, delete actions

### Typography
- **Font Family**: Inter
- Consistent sizing through CSS variables
- Proper hierarchy with semantic HTML elements

## 🏗️ Architecture

### Tech Stack
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS v4.0
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect, useCallback)

### Project Structure
```
├── components/
│   ├── ResidentsPage.tsx          # Residents management
│   ├── StaffPage.tsx              # Staff management
│   ├── VendorsPage.tsx            # Vendors management
│   ├── UsersPage.tsx              # Users management
│   ├── MessagingPage.tsx          # Admin messaging view
│   ├── NormalUserMessagingPage.tsx # Family messaging view
│   ├── ConversationList.tsx       # Conversation list component
│   ├── ChatView.tsx               # Chat interface component
│   ├── Sidebar.tsx                # Admin navigation
│   ├── NormalUserSidebar.tsx      # Family navigation
│   ├── Header.tsx                 # App header with user toggle
│   └── ui/                        # Shadcn UI components
├── hooks/                         # Custom React hooks (to be created)
├── services/                      # API service layer (to be created)
├── types/                         # TypeScript type definitions (to be created)
├── styles/
│   └── globals.css                # Global styles and CSS variables
├── App.tsx                        # Main application component
└── README.md                      # This file
```

## 📚 Documentation

This project includes comprehensive documentation for API integration:

- **[API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)** - Complete API integration specifications and migration timeline
- **[COPILOT_INTEGRATION_GUIDE.md](./COPILOT_INTEGRATION_GUIDE.md)** - Step-by-step guide for GitHub Copilot to build API layer
- **[WORKFLOW_DIAGRAMS.md](./WORKFLOW_DIAGRAMS.md)** - Visual user journey maps and data flow diagrams

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
```

## 🔌 API Integration

The frontend is ready for API integration. Follow these steps:

1. **Review Documentation**: Read `COPILOT_INTEGRATION_GUIDE.md`
2. **Create Services**: Use Copilot prompts to generate service layer
3. **Create Hooks**: Use templates to build custom hooks
4. **Integrate**: Connect hooks to existing pages
5. **Test**: Verify all CRUD operations

### Required API Endpoints

#### Residents
- `GET /api/residents?page=1&pageSize=12&search=&careLevel=all`
- `GET /api/residents/:id`
- `POST /api/residents`
- `PUT /api/residents/:id`
- `DELETE /api/residents/:id`

#### Staff
- `GET /api/staff?search=&role=all`
- `GET /api/staff/:id`
- `POST /api/staff`
- `PUT /api/staff/:id`
- `DELETE /api/staff/:id`

#### Vendors
- `GET /api/vendors?search=&type=all`
- `GET /api/vendors/:id`
- `POST /api/vendors`
- `PUT /api/vendors/:id`
- `DELETE /api/vendors/:id`

#### Users
- `GET /api/users?search=&role=all`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

#### Messaging
- `GET /api/conversations?userId=current`
- `GET /api/conversations/:id`
- `POST /api/conversations`
- `POST /api/conversations/:id/messages`
- `PATCH /api/conversations/:id/read`

## 🧪 Testing

### Manual Testing
All CRUD operations are currently working with mock data. Test each module:

1. **Residents**: Add, edit, delete, search, filter by care level
2. **Staff**: Add, edit, delete, search, filter by role
3. **Vendors**: Add, edit, delete, search, filter by type
4. **Users**: Add, edit, delete, search, filter by role
5. **Messaging**: View conversations, send messages, create new conversations

### User Views
Toggle between Admin and Family views using the button in the header to test both perspectives.

## 🔒 Security Considerations

### Data Protection
- Contains PHI/PII data (resident medical information)
- Requires HTTPS in production
- Sensitive fields need encryption at rest
- Server-side validation required

### Access Control
- Role-based access control needed
- Facility-level data isolation
- Audit logging for all operations

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## 🎯 Current Status

### ✅ Completed
- All UI components and layouts
- Full CRUD interfaces for all modules
- Search and filtering functionality
- Messaging system (both admin and family views)
- Responsive design
- TypeScript interfaces
- Mock data for development

### 🚧 In Progress
- API integration layer
- Real-time messaging with WebSocket
- Form validation
- Loading states
- Error handling

### 📋 Planned
- Authentication system
- File upload (resident photos, documents)
- Advanced reporting
- Email/SMS notifications
- Real-time updates

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

### Code Style
- Follow existing patterns
- Use TypeScript for type safety
- Follow component structure conventions
- Keep components focused and reusable

## 📄 License

[Add your license here]

## 👥 Team

[Add your team information here]

## 📞 Support

[Add support contact information here]

---

**Note**: This application is built using Figma Make and is ready for backend integration. All frontend functionality is complete and tested with mock data. Follow the integration guides to connect to your backend API.

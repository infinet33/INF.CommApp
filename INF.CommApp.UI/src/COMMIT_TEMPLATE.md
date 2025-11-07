# Git Commit Template

Use this template for your initial commit and future commits.

## Initial Commit Message

```
Initial commit: Valencia Assisted Living Dashboard

## Features Implemented

### Residents Management
- Complete CRUD functionality with comprehensive profiles
- Medical alerts tracking (fall risk, allergies, dietary restrictions)
- Emergency contacts and insurance management
- Search and filter by care level
- Pagination with 12 cards per page
- Detailed modal view with all resident information

### Staff Management
- Full CRUD operations for staff members
- Role-based organization (Care Coordinator, Activities Director, Nurse, etc.)
- Department and shift tracking
- Search and filter by role
- Table view with contact information
- Status management (Active/Inactive)

### Vendors Management
- Complete vendor relationship management
- 8 vendor type categories (Home Health, Hospice, Pharmacy, etc.)
- Contact and address tracking
- Notes and status management
- Search and filter functionality

### Users Management
- External care provider management (Doctors)
- Organization and specialty tracking
- Contact information management
- Integration ready for messaging system

### Messaging System
- Admin view with full conversation management
- Family view with filtered conversations
- Resident-grouped conversations
- Participant management (Staff, Nurses, Doctors, etc.)
- Message history with timestamps
- Role-based message coloring
- Unread message counts
- New conversation creation
- Featured partner banner for family view

### UI/UX
- Clean, professional healthcare design
- Consistent color scheme (Blue #2563eb, Green #16a34a, Orange #d97706, Red #dc2626)
- Inter font throughout
- Fully responsive (mobile, tablet, desktop)
- Shadcn/ui component library integration
- Accessible forms and interactions

## Documentation Included

### API Integration Guides
- API_INTEGRATION_GUIDE.md: Complete technical reference
- COPILOT_INTEGRATION_GUIDE.md: Step-by-step integration with Copilot prompts
- WORKFLOW_DIAGRAMS.md: Visual user journey maps

### Project Documentation
- README.md: Project overview and setup instructions
- .gitignore: Proper exclusions configured

## Technical Stack
- React 18 with TypeScript
- Tailwind CSS v4.0
- Shadcn/ui components
- Lucide React icons
- Modern React hooks patterns

## Ready for Integration
- All interfaces defined
- Mock data in place
- 23 API endpoints specified
- Hook templates ready
- Service layer templates ready

## Current State
- All frontend functionality complete
- Working with mock data
- Ready for backend API connection
- Full CRUD operations functional
- Search/filter working
- Messaging system operational

## Next Steps
1. Backend team to review integration guides
2. Create API service layer using templates
3. Implement custom hooks
4. Connect to actual API endpoints
5. Add authentication
6. Add real-time messaging via WebSocket
```

---

## Future Commit Message Format

For future commits, use this format:

```
<type>(<scope>): <short description>

<detailed description>

<breaking changes if any>

<issue references>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```
feat(residents): Add photo upload functionality

- Implement image upload component
- Add photo preview in resident card
- Integrate with file storage API
- Add validation for image size and type

Closes #123
```

```
fix(messaging): Resolve unread count not updating

- Fix state update in markAsRead function
- Update conversation list when message is read
- Add optimistic update for better UX

Fixes #456
```

```
docs(api): Update API integration guide with auth examples

- Add authentication flow documentation
- Include JWT token handling examples
- Update service layer with auth headers
```

```
refactor(hooks): Extract common CRUD logic to base hook

- Create useBaseCRUD hook with common operations
- Update all entity hooks to extend base hook
- Reduce code duplication
- Maintain backward compatibility
```

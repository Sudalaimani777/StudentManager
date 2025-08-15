# Student Management Application

A comprehensive React-based web application for managing student data, marks, and user authentication with role-based access control.

## Features

### 🔐 Authentication & User Management
- **User Registration**: Create accounts with role selection (Student/Administrator)
- **User Login**: Secure authentication system
- **Role-Based Access Control**: Different interfaces for students and administrators
- **Session Management**: Persistent login state with localStorage

### 👨‍🎓 Student Features
- **Profile Management**: View and manage personal information
- **Mark Entry System**: Add, edit, and delete academic marks
- **Academic Dashboard**: View performance statistics and recent marks
- **Grade Calculation**: Automatic percentage and grade calculation

### 👨‍💼 Administrator Features
- **Comprehensive Dashboard**: Overview of all users and statistics
- **Student Management**: View, search, and filter student data
- **Detailed Analytics**: Performance metrics and academic insights
- **User Management**: Delete student accounts (admin accounts protected)

### 🎨 User Interface
- **Material-UI Design**: Modern, responsive interface using MUI components
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Interactive Components**: Cards, tables, dialogs, and forms
- **Toast Notifications**: User feedback for all actions

### 💾 Data Management
- **Local Storage**: Persistent data storage without external databases
- **Redux State Management**: Centralized state management with Redux Toolkit
- **Data Validation**: Input validation and error handling
- **Real-time Updates**: Immediate UI updates on data changes

## Technology Stack

- **Frontend**: React 19 with Hooks
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **UI Framework**: Material-UI (MUI)
- **Build Tool**: Vite
- **Notifications**: React Toastify
- **Storage**: Local Storage API

## Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StudentManager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## Application Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx          # User login component
│   │   └── Register.jsx       # User registration component
│   ├── student/
│   │   └── StudentDashboard.jsx # Student main interface
│   ├── admin/
│   │   ├── AdminDashboard.jsx    # Admin main interface
│   │   └── StudentDetailDialog.jsx # Student detail view
│   └── common/
│       └── ProtectedRoute.jsx    # Route protection component
├── store/
│   ├── store.js               # Redux store configuration
│   └── slices/
│       ├── authSlice.js       # Authentication state management
│       └── studentSlice.js    # Student data management
├── App.jsx                    # Main application component
└── main.jsx                   # Application entry point
```

## Usage Guide

### For Students

1. **Registration**: Create a new account with the "Student" role
2. **Login**: Access your personalized dashboard
3. **Add Marks**: Enter your academic performance data
4. **View Progress**: Monitor your academic statistics and recent marks
5. **Manage Profile**: Update personal information

### For Administrators

1. **Registration**: Create an account with the "Administrator" role
2. **Dashboard Access**: View comprehensive system overview
3. **Student Management**: Monitor all student accounts and performance
4. **Data Analysis**: Review academic statistics and trends
5. **User Control**: Manage student accounts (delete if necessary)

## Data Storage

The application uses browser localStorage for data persistence:

- **Users**: Stored in `localStorage.users`
- **Students**: Stored in `localStorage.students`
- **Authentication State**: Managed by Redux with localStorage backup

## Security Features

- **Password Validation**: Minimum 6 characters required
- **Email Validation**: Proper email format verification
- **Role-Based Access**: Separate interfaces for different user types
- **Protected Routes**: Authentication required for dashboard access
- **Input Sanitization**: Form validation and error handling

## Performance Features

- **Lazy Loading**: Components load only when needed
- **Optimized Rendering**: Efficient React component updates
- **Local Storage**: Fast data access without network requests
- **Responsive Design**: Optimized for various screen sizes

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- ES6+ JavaScript features
- React functional components with hooks
- Material-UI component library
- Redux Toolkit for state management
- Consistent naming conventions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Note**: This application is designed for educational purposes and uses localStorage for data persistence. For production use, consider implementing a proper backend database and authentication system.

# Student Manager - Authentication Troubleshooting

## Overview
This is a React-based student management system with authentication functionality.

## Authentication Issues & Solutions

### Common Problems:

1. **localStorage Not Available**
   - **Cause**: Browser privacy settings, incognito mode, or security restrictions
   - **Solution**: Check browser settings, disable privacy extensions, or use regular browsing mode

2. **Login/Register Fails Silently**
   - **Cause**: Redux actions failing or localStorage errors
   - **Solution**: Check browser console for error messages and use the debug info button

3. **Session Not Persisting**
   - **Cause**: localStorage save failures
   - **Solution**: Check browser storage permissions and console errors

4. **"users.find is not a function" Error**
   - **Cause**: Corrupted localStorage data or invalid user data structure
   - **Solution**: Use the "Reset System" button in debug panel or run `window.debugAuth.resetSystemData()` in console

## Testing the System

### Test User (Auto-created):
- **Email**: admin@test.com
- **Password**: password123
- **Role**: Administrator

### Debug Features:
- Click the info icon (ℹ️) on login/register forms to see debug information
- Check browser console for detailed error logs
- Verify localStorage status in debug panel
- Use "Reset System" button to fix corrupted data
- Console debugging utilities available at `window.debugAuth`

## How to Use:

1. **Start the application**: `npm run dev`
2. **Navigate to**: http://localhost:5173
3. **Test Login**: Use the test credentials above
4. **Test Registration**: Create a new account
5. **Check Debug Info**: Click the info icon for troubleshooting
6. **Reset if needed**: Use "Reset System" button in debug panel

## Troubleshooting Steps:

1. **Clear Browser Data**: Clear localStorage and cookies
2. **Check Console**: Look for error messages in browser console
3. **Verify localStorage**: Use debug panel to check storage status
4. **Test in Different Browser**: Try Chrome, Firefox, or Edge
5. **Check Extensions**: Disable ad blockers or privacy extensions
6. **Reset System**: Use "Reset System" button in debug panel
7. **Console Debugging**: Use `window.debugAuth.checkLocalStorageStatus()` in browser console

## Console Debugging Commands:

```javascript
// Check localStorage status
window.debugAuth.checkLocalStorageStatus()

// Reset system data
window.debugAuth.resetSystemData()

// Clear all localStorage data
window.debugAuth.clearAllData()
```

## Technical Details:

- **State Management**: Redux Toolkit
- **Storage**: Browser localStorage
- **UI Framework**: Material-UI (MUI)
- **Routing**: React Router v6
- **Notifications**: React-Toastify

## Support:

If issues persist:
1. Check browser console for errors
2. Verify localStorage is enabled
3. Try different browser or incognito mode
4. Check for conflicting browser extensions
5. Use the "Reset System" button in debug panel
6. Run console debugging commands
7. Check the debug panel for localStorage status

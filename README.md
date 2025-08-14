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

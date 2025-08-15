import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Clear corrupted localStorage data
const clearCorruptedData = () => {
  try {
    localStorage.removeItem('users');
    localStorage.removeItem('currentUser');
    console.log('Cleared corrupted localStorage data');
    return true;
  } catch (error) {
    console.error('Failed to clear corrupted data:', error);
    return false;
  }
};

// Load users from localStorage
const loadUsersFromStorage = () => {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return [];
  }
  
  try {
    const users = localStorage.getItem('users');
    console.log('Raw users from localStorage:', users);
    
    if (!users) {
      console.log('No users found in localStorage, returning empty array');
      return [];
    }
    
    const parsedUsers = JSON.parse(users);
    console.log('Parsed users:', parsedUsers);
    
    // Ensure we always return an array
    if (!Array.isArray(parsedUsers)) {
      console.error('Parsed users is not an array:', parsedUsers);
      // Clear invalid data and return empty array
      localStorage.removeItem('users');
      return [];
    }
    
    return parsedUsers;
  } catch (error) {
    console.error('Error loading users from localStorage:', error);
    // Clear corrupted data and return empty array
    try {
      localStorage.removeItem('users');
    } catch (clearError) {
      console.error('Failed to clear corrupted users data:', clearError);
    }
    return [];
  }
};

// Save users to localStorage
const saveUsersToStorage = (users) => {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return false;
  }
  
  try {
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
    return false;
  }
};

// Session persistence helpers
const saveSession = (user) => {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return false;
  }
  
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error saving session to localStorage:', error);
    return false;
  }
};

const clearSession = () => {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return false;
  }
  
  try {
    localStorage.removeItem('currentUser');
    return true;
  } catch (error) {
    console.error('Error clearing session from localStorage:', error);
    return false;
  }
};

const loadSession = () => {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return null;
  }
  
  try {
    const raw = localStorage.getItem('currentUser');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Error loading session from localStorage:', error);
    return null;
  }
};

// Input normalization helpers
const normalizeEmail = (email) => (email || '').trim().toLowerCase();
const normalizePassword = (password) => (password || '').trim();
const normalizeName = (name) => (name || '').trim();

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Validate input data
      if (!userData.name || !userData.email || !userData.password) {
        return rejectWithValue('All fields are required');
      }

      if (!validateEmail(userData.email)) {
        return rejectWithValue('Please enter a valid email address');
      }

      if (!validatePassword(userData.password)) {
        return rejectWithValue('Password must be at least 6 characters long');
      }

      const users = loadUsersFromStorage();
      
      // Ensure users is an array
      if (!Array.isArray(users)) {
        console.error('Users is not an array:', users);
        return rejectWithValue('Failed to load existing users. Please refresh the page.');
      }

      const normalized = {
        ...userData,
        name: normalizeName(userData.name),
        email: normalizeEmail(userData.email),
        password: normalizePassword(userData.password),
        role: userData.role || 'student',
      };
      
      // Check if user already exists
      const existingUser = users.find(user => normalizeEmail(user.email) === normalized.email);
      if (existingUser) {
        return rejectWithValue('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...normalized,
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      const saveSuccess = saveUsersToStorage(updatedUsers);
      
      if (!saveSuccess) {
        return rejectWithValue('Failed to save user data. Please check your browser settings.');
      }

      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // Validate input data
      if (!credentials.email || !credentials.password) {
        return rejectWithValue('Email and password are required');
      }

      if (!validateEmail(credentials.email)) {
        return rejectWithValue('Please enter a valid email address');
      }

      const users = loadUsersFromStorage();
      
      // Ensure users is an array
      if (!Array.isArray(users)) {
        console.error('Users is not an array:', users);
        return rejectWithValue('Failed to load existing users. Please refresh the page.');
      }
      
      const email = normalizeEmail(credentials.email);
      const password = normalizePassword(credentials.password);
      
      const user = users.find(
        (u) => normalizeEmail(u.email) === email && normalizePassword(u.password) === password
      );

      if (!user) {
        return rejectWithValue('Invalid email or password');
      }

      // Test if we can save to localStorage
      const testSave = saveSession(user);
      if (!testSave) {
        return rejectWithValue('Login successful but failed to save session. Please check your browser settings.');
      }

      return user;
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

const persistedUser = loadSession();
const initialState = {
  currentUser: persistedUser,
  isAuthenticated: !!persistedUser,
  loading: false,
  error: null,
  users: loadUsersFromStorage(),
};

// Add initial test user if no users exist
if (initialState.users.length === 0 && isLocalStorageAvailable()) {
  const testUser = {
    id: '1',
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  };
  initialState.users = [testUser];
  saveUsersToStorage([testUser]);
  console.log('Created test user:', testUser.email);
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      clearSession();
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSystem: (state) => {
      clearCorruptedData();
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      state.users = [];
      // Recreate test user
      if (isLocalStorageAvailable()) {
        const testUser = {
          id: '1',
          name: 'Test Admin',
          email: 'admin@test.com',
          password: 'password123',
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
        state.users = [testUser];
        saveUsersToStorage([testUser]);
        console.log('Recreated test user after system reset');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = [...state.users, action.payload];
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        const sessionSaved = saveSession(action.payload);
        if (!sessionSaved) {
          state.error = 'Registration successful but failed to save session. Please check your browser settings.';
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        const sessionSaved = saveSession(action.payload);
        if (!sessionSaved) {
          state.error = 'Login successful but failed to save session. Please check your browser settings.';
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, resetSystem } = authSlice.actions;
export default authSlice.reducer;

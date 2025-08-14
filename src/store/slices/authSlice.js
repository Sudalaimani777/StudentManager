import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Load users from localStorage
const loadUsersFromStorage = () => {
  try {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error loading users from localStorage:', error);
    return [];
  }
};

// Save users to localStorage
const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

// Session persistence helpers
const saveSession = (user) => {
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving session to localStorage:', error);
  }
};

const clearSession = () => {
  try {
    localStorage.removeItem('currentUser');
  } catch (error) {
    console.error('Error clearing session from localStorage:', error);
  }
};

const loadSession = () => {
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

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const users = loadUsersFromStorage();
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
      saveUsersToStorage(updatedUsers);

      return newUser;
    } catch (error) {
      return rejectWithValue('Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const users = loadUsersFromStorage();
      const email = normalizeEmail(credentials.email);
      const password = normalizePassword(credentials.password);
      const user = users.find(
        (u) => normalizeEmail(u.email) === email && normalizePassword(u.password) === password
      );

      if (!user) {
        return rejectWithValue('Invalid credentials');
      }

      return user;
    } catch (error) {
      return rejectWithValue('Login failed');
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
        saveSession(action.payload);
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
        saveSession(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

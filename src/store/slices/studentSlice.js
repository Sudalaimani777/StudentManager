import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Load students from localStorage
const loadStudentsFromStorage = () => {
  try {
    const students = localStorage.getItem('students');
    return students ? JSON.parse(students) : [];
  } catch (error) {
    console.error('Error loading students from localStorage:', error);
    return [];
  }
};

// Save students to localStorage
const saveStudentsToStorage = (students) => {
  try {
    localStorage.setItem('students', JSON.stringify(students));
  } catch (error) {
    console.error('Error saving students to localStorage:', error);
  }
};

export const addStudent = createAsyncThunk(
  'students/addStudent',
  async (studentData, { rejectWithValue }) => {
    try {
      const students = loadStudentsFromStorage();
      
      // Check if student already exists
      const existingStudent = students.find(student => student.email === studentData.email);
      if (existingStudent) {
        return rejectWithValue('Student with this email already exists');
      }

      // Create new student
      const newStudent = {
        id: Date.now().toString(),
        ...studentData,
        marks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedStudents = [...students, newStudent];
      saveStudentsToStorage(updatedStudents);

      return newStudent;
    } catch (error) {
      return rejectWithValue('Failed to add student');
    }
  }
);

export const updateStudentMarks = createAsyncThunk(
  'students/updateStudentMarks',
  async ({ studentId, marks }, { rejectWithValue, getState }) => {
    try {
      const students = loadStudentsFromStorage();
      const studentIndex = students.findIndex(student => student.id === studentId);
      
      if (studentIndex === -1) {
        return rejectWithValue('Student not found');
      }

      // Update student marks
      const updatedStudent = {
        ...students[studentIndex],
        marks: marks,
        updatedAt: new Date().toISOString(),
      };

      const updatedStudents = [...students];
      updatedStudents[studentIndex] = updatedStudent;
      saveStudentsToStorage(updatedStudents);

      return updatedStudent;
    } catch (error) {
      return rejectWithValue('Failed to update marks');
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (studentId, { rejectWithValue }) => {
    try {
      const students = loadStudentsFromStorage();
      const filteredStudents = students.filter(student => student.id !== studentId);
      saveStudentsToStorage(filteredStudents);
      return studentId;
    } catch (error) {
      return rejectWithValue('Failed to delete student');
    }
  }
);

export const loadStudents = createAsyncThunk(
  'students/loadStudents',
  async (_, { rejectWithValue }) => {
    try {
      const students = loadStudentsFromStorage();
      return students;
    } catch (error) {
      return rejectWithValue('Failed to load students');
    }
  }
);

const initialState = {
  students: loadStudentsFromStorage(),
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = [...state.students, action.payload];
        state.error = null;
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateStudentMarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentMarks.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.students.findIndex(student => student.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateStudentMarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter(student => student.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
        state.error = null;
      })
      .addCase(loadStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = studentSlice.actions;
export default studentSlice.reducer;

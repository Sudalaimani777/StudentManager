import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';
import { deleteStudent, loadStudents } from '../../store/slices/studentSlice';
import StudentDetailDialog from './StudentDetailDialog';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const { students, loading } = useSelector((state) => state.students);

  useEffect(() => {
    dispatch(loadStudents());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setDetailDialogOpen(true);
  };

  const handleDeleteStudent = (student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteStudent = () => {
    if (studentToDelete) {
      dispatch(deleteStudent(studentToDelete.id));
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
      toast.success('Student deleted successfully');
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || student.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getStats = () => {
    const totalStudents = students.length;
    const totalAdmins = students.filter(s => s.role === 'admin').length;
    const totalStudentUsers = students.filter(s => s.role === 'student').length;
    const studentsWithMarks = students.filter(s => s.role === 'student' && s.marks && s.marks.length > 0).length;
    
    return { totalStudents, totalAdmins, totalStudentUsers, studentsWithMarks };
  };

  const stats = getStats();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          color="error"
        >
          Logout
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" color="primary">
              {stats.totalStudents}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Users
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <SchoolIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h4" color="secondary">
              {stats.totalStudentUsers}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Students
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <AssessmentIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" color="success.main">
              {stats.studentsWithMarks}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Active Students
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <PeopleIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h4" color="info.main">
              {stats.totalAdmins}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Administrators
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={filterRole}
                label="Filter by Role"
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="student">Students</MenuItem>
                <MenuItem value="admin">Administrators</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="textSecondary">
              Showing {filteredStudents.length} of {students.length} users
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Students Table */}
      <Paper elevation={3}>
        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Marks Count</TableCell>
                <TableCell>Average Score</TableCell>
                <TableCell>Member Since</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => {
                const averageScore = student.marks && student.marks.length > 0
                  ? (student.marks.reduce((sum, mark) => sum + parseFloat(mark.percentage), 0) / student.marks.length).toFixed(2)
                  : 'N/A';

                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {student.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.role}
                        color={student.role === 'admin' ? 'secondary' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {student.marks ? student.marks.length : 0}
                    </TableCell>
                    <TableCell>
                      {averageScore === 'N/A' ? averageScore : `${averageScore}%`}
                    </TableCell>
                    <TableCell>
                      {new Date(student.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewStudent(student)}
                        title="View Details"
                      >
                        <ViewIcon />
                      </IconButton>
                      {student.role === 'student' && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteStudent(student)}
                          title="Delete Student"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Student Detail Dialog */}
      <StudentDetailDialog
        open={detailDialogOpen}
        student={selectedStudent}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedStudent(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {studentToDelete?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteStudent} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;

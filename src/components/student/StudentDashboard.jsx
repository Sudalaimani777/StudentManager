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
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';
import { updateStudentMarks } from '../../store/slices/studentSlice';
import { addStudent, loadStudents } from '../../store/slices/studentSlice';

const StudentDashboard = () => {
  const [editMarksOpen, setEditMarksOpen] = useState(false);
  const [newMark, setNewMark] = useState({
    subject: '',
    score: '',
    maxScore: '',
    date: new Date().toISOString().split('T')[0],
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const { students, loading } = useSelector((state) => state.students);

  const currentStudent = students.find(student => student.email === currentUser?.email);

  useEffect(() => {
    dispatch(loadStudents());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'student' && !currentStudent) {
      dispatch(addStudent({ name: currentUser.name, email: currentUser.email, role: 'student' }));
    }
  }, [currentUser, currentStudent, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleAddMark = () => {
    if (!newMark.subject || !newMark.score || !newMark.maxScore) {
      toast.error('Please fill in all fields');
      return;
    }

    if (parseFloat(newMark.score) > parseFloat(newMark.maxScore)) {
      toast.error('Score cannot be greater than maximum score');
      return;
    }

    const updatedMarks = [
      ...(currentStudent?.marks || []),
      {
        id: Date.now().toString(),
        ...newMark,
        score: parseFloat(newMark.score),
        maxScore: parseFloat(newMark.maxScore),
        percentage: ((parseFloat(newMark.score) / parseFloat(newMark.maxScore)) * 100).toFixed(2),
      },
    ];

    dispatch(updateStudentMarks({
      studentId: currentStudent.id,
      marks: updatedMarks,
    }));

    setNewMark({
      subject: '',
      score: '',
      maxScore: '',
      date: new Date().toISOString().split('T')[0],
    });
    setEditMarksOpen(false);
    toast.success('Mark added successfully');
  };

  const handleDeleteMark = (markId) => {
    const updatedMarks = currentStudent.marks.filter(mark => mark.id !== markId);
    dispatch(updateStudentMarks({
      studentId: currentStudent.id,
      marks: updatedMarks,
    }));
    toast.success('Mark deleted successfully');
  };

  const calculateAverage = () => {
    if (!currentStudent?.marks || currentStudent.marks.length === 0) return 0;
    const totalPercentage = currentStudent.marks.reduce((sum, mark) => sum + parseFloat(mark.percentage), 0);
    return (totalPercentage / currentStudent.marks.length).toFixed(2);
  };

  if (!currentStudent) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Setting up your student profile...
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Please wait a moment.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Student Dashboard
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

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Name
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {currentStudent.name}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {currentStudent.email}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Role
              </Typography>
              <Chip label={currentStudent.role} color="primary" size="small" />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Member Since
              </Typography>
              <Typography variant="body1">
                {new Date(currentStudent.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Academic Summary */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Academic Summary
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setEditMarksOpen(true)}
              >
                Add Mark
              </Button>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} md={3}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {currentStudent.marks?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Marks
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="secondary">
                    {calculateAverage()}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Average Score
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Recent Marks
            </Typography>
            {currentStudent.marks && currentStudent.marks.length > 0 ? (
              <Grid container spacing={2}>
                {currentStudent.marks.slice(-6).reverse().map((mark) => (
                  <Grid item xs={12} sm={6} md={4} key={mark.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {mark.subject}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Score: {mark.score}/{mark.maxScore}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Percentage: {mark.percentage}%
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Date: {new Date(mark.date).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteMark(mark.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                No marks recorded yet. Add your first mark to get started!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Add Mark Dialog */}
      <Dialog open={editMarksOpen} onClose={() => setEditMarksOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Mark</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={newMark.subject}
                onChange={(e) => setNewMark({ ...newMark, subject: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Score"
                type="number"
                value={newMark.score}
                onChange={(e) => setNewMark({ ...newMark, score: e.target.value })}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Score"
                type="number"
                value={newMark.maxScore}
                onChange={(e) => setNewMark({ ...newMark, maxScore: e.target.value })}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={newMark.date}
                onChange={(e) => setNewMark({ ...newMark, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMarksOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMark} variant="contained" disabled={loading}>
            Add Mark
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentDashboard;

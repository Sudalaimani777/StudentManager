import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const StudentDetailDialog = ({ open, student, onClose }) => {
  if (!student) return null;

  const calculateAverage = () => {
    if (!student.marks || student.marks.length === 0) return 0;
    const totalPercentage = student.marks.reduce((sum, mark) => sum + parseFloat(mark.percentage), 0);
    return (totalPercentage / student.marks.length).toFixed(2);
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'success' };
    if (percentage >= 80) return { grade: 'A', color: 'success' };
    if (percentage >= 70) return { grade: 'B+', color: 'primary' };
    if (percentage >= 60) return { grade: 'B', color: 'primary' };
    if (percentage >= 50) return { grade: 'C+', color: 'warning' };
    if (percentage >= 40) return { grade: 'C', color: 'warning' };
    return { grade: 'F', color: 'error' };
  };

  const averageScore = calculateAverage();
  const gradeInfo = getGrade(averageScore);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Student Details</Typography>
          <Button
            icon={<CloseIcon />}
            onClick={onClose}
            sx={{ minWidth: 'auto' }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Full Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {student.name}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Email Address
                </Typography>
                <Typography variant="body1">
                  {student.email}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Role
                </Typography>
                <Chip
                  label={student.role}
                  color={student.role === 'admin' ? 'secondary' : 'primary'}
                  size="small"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Member Since
                </Typography>
                <Typography variant="body1">
                  {new Date(student.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              {student.updatedAt && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {new Date(student.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Academic Summary */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Academic Summary
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Total Marks Recorded
                </Typography>
                <Typography variant="h4" color="primary">
                  {student.marks ? student.marks.length : 0}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Average Score
                </Typography>
                <Typography variant="h4" color="secondary">
                  {averageScore}%
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Overall Grade
                </Typography>
                <Chip
                  label={gradeInfo.grade}
                  color={gradeInfo.color}
                  size="large"
                  sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Marks Details */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Detailed Marks
              </Typography>
              {student.marks && student.marks.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Subject</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Percentage</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {student.marks.map((mark) => {
                        const markGrade = getGrade(mark.percentage);
                        return (
                          <TableRow key={mark.id}>
                            <TableCell>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {mark.subject}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {mark.score}/{mark.maxScore}
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body1"
                                color={markGrade.color === 'error' ? 'error' : 'textPrimary'}
                              >
                                {mark.percentage}%
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={markGrade.grade}
                                color={markGrade.color}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {new Date(mark.date).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  No marks recorded yet.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentDetailDialog;

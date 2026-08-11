
'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import type { GradeDistribution, AssessmentsData, AssessmentRecord } from '@/types/analytics';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CourseGradeProps {
  grades: GradeDistribution;
  assessments: AssessmentsData;
}

const CourseGrade = ({ grades, assessments }: CourseGradeProps) => {
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Course Grade Distribution' },
    },
  };

  const renderAssessmentTable = (rows: AssessmentRecord[], title: string) => {
    if (!rows.length) return null;
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Assessment</TableCell>
                <TableCell align="right">Weighting</TableCell>
                <TableCell align="right">A</TableCell>
                <TableCell align="right">B</TableCell>
                <TableCell align="right">C</TableCell>
                <TableCell align="right">D</TableCell>
                <TableCell align="right">F</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((assessment) => (
                <TableRow key={assessment.name}>
                  <TableCell component="th" scope="row">{assessment.name}</TableCell>
                  <TableCell align="right">{assessment.weighting}</TableCell>
                  <TableCell align="right">{assessment.grades.A}</TableCell>
                  <TableCell align="right">{assessment.grades.B}</TableCell>
                  <TableCell align="right">{assessment.grades.C}</TableCell>
                  <TableCell align="right">{assessment.grades.D}</TableCell>
                  <TableCell align="right">{assessment.grades.F}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box>
      <Bar options={options} data={grades} />
      {renderAssessmentTable(assessments.formative, 'Formative Assessments')}
      {renderAssessmentTable(assessments.summative, 'Summative Assessments')}
    </Box>
  );
};

export default CourseGrade;

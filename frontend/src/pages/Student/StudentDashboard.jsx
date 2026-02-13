import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    accuracyPercentage: 0,
    averageScore: 0
  });
  const [subjectPerformance, setSubjectPerformance] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all results for the student
      const resultsRes = await api.get("/results/my-results");
      const results = resultsRes.data || [];
      
      if (results.length === 0) {
        setLoading(false);
        return;
      }

      // Calculate overall statistics
      const totalQuizzes = results.length;
      const totalMarks = results.reduce((sum, r) => sum + r.total_marks, 0);
      const totalScore = results.reduce((sum, r) => sum + r.score, 0);
      const accuracyPercentage = totalMarks > 0 ? Math.round((totalScore / totalMarks) * 100) : 0;
      const averageScore = totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0;

      setStats({
        totalQuizzes,
        totalQuestions: totalMarks, // Using total_marks as question count
        correctAnswers: totalScore,
        accuracyPercentage,
        averageScore
      });

      // Calculate subject-wise performance
      const subjectMap = {};
      results.forEach(result => {
        const subjectName = result.subject_name || 'Unknown';
        if (!subjectMap[subjectName]) {
          subjectMap[subjectName] = {
            subject: subjectName,
            totalScore: 0,
            totalMarks: 0,
            attempts: 0
          };
        }
        subjectMap[subjectName].totalScore += result.score;
        subjectMap[subjectName].totalMarks += result.total_marks;
        subjectMap[subjectName].attempts += 1;
      });

      const subjectPerf = Object.values(subjectMap).map(s => ({
        subject: s.subject,
        accuracy: Math.round((s.totalScore / s.totalMarks) * 100),
        attempts: s.attempts,
        score: s.totalScore,
        total: s.totalMarks
      }));

      setSubjectPerformance(subjectPerf);
      
      // Get recent 5 attempts
      const recent = results.slice(0, 5).map(r => ({
        ...r,
        percentage: Math.round((r.score / r.total_marks) * 100),
        date: new Date(r.attempted_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
      
      setRecentAttempts(recent);
      
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-success"; 
    if (percentage >= 60) return "text-accent"; 
    if (percentage >= 40) return "text-orange-500"; 
    return "text-red-500"; 
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return "#22C55E"; 
    if (percentage >= 60) return "#F59E0B"; 
    if (percentage >= 40) return "#F97316"; 
    return "#EF4444"; 
  };

  return (
    <Navbar>
      <PageContainer
        title="Student Dashboard"
        subtitle="Your performance overview and recent activity"
        actions={
          <Link 
            to="/practice" 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Start Practice
          </Link>
        }
      >
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : stats.totalQuizzes === 0 ? (
          <div className="bg-card p-12 rounded-xl border border-border text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No Quiz Attempts Yet</h3>
            <p className="text-text-muted mb-6">Start practicing to see your performance statistics here!</p>
            <Link 
              to="/practice" 
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium inline-flex items-center gap-2"
            >
              Take Your First Quiz
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted mb-2">Chapter Tests Taken</p>
                    <p className="text-3xl font-bold text-text-primary">{stats.totalQuizzes}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 text-xs text-text-muted">
                  {stats.totalQuestions} total questions answered
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted mb-2">Accuracy</p>
                    <p className={`text-3xl font-bold ${getScoreColor(stats.accuracyPercentage)}`}>
                      {stats.accuracyPercentage}%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 text-xs text-text-muted">
                  {stats.correctAnswers} / {stats.totalQuestions} correct
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted mb-2">Average Score</p>
                    <p className="text-3xl font-bold text-accent">{stats.averageScore}%</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 text-xs text-text-muted">
                  Per quiz average
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted mb-2">Study Time</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {Math.round(stats.totalQuizzes * 15)}m
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 text-xs text-text-muted">
                  Approximate time spent
                </div>
              </div>
            </div>

            {/* Subject-wise Performance Chart */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Subject-wise Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-card p-3 rounded-lg border border-border shadow-lg">
                            <p className="font-semibold text-text-primary">{data.subject}</p>
                            <p className="text-sm text-text-muted">Accuracy: {data.accuracy}%</p>
                            <p className="text-sm text-text-muted">Attempts: {data.attempts}</p>
                            <p className="text-sm text-text-muted">Score: {data.score}/{data.total}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="accuracy" fill="#2563EB" name="Accuracy %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Quiz Attempts */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recent Chapter Tests
                </h3>
                <Link to="/results" className="text-primary hover:text-primary/80 text-sm font-medium">
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {recentAttempts.map((attempt, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-background rounded-lg hover:bg-border/20 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary">
                        {attempt.subject_name} - {attempt.chapter_name}
                      </h4>
                      <p className="text-sm text-text-muted mt-1">
                        {attempt.total_marks} Questions • {attempt.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getScoreColor(attempt.percentage)}`}>
                          {attempt.percentage}%
                        </p>
                        <p className="text-sm text-text-muted">
                          {attempt.score}/{attempt.total_marks}
                        </p>
                      </div>
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: getScoreBgColor(attempt.percentage) }}
                      >
                        {attempt.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </Navbar>
  );
};

export default StudentDashboard;
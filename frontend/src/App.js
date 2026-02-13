import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentDashboard from "./pages/Student/StudentDashboard";
import Practice from "./pages/Student/Practice";
import Profile from "./pages/Student/Profile";
import Result from "./pages/Student/Result";
import AttemptMCQs from "./pages/Student/AttemptMCQs";
import ViewNotes from "./pages/Student/ViewNotes";
import PerformanceInsights from "./pages/Student/PerformanceInsights";
import Leaderboard from "./pages/Student/Leaderboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Subjects from "./pages/Admin/Subjects";
import Chapters from "./pages/Admin/Chapters";
import Analytics from "./pages/Admin/Analytics";
import AddMCQ from "./pages/Admin/AddMCQ";
import ViewMCQs from "./pages/Admin/ViewMCQs";
import ManageNotes from "./pages/Admin/ManageNotes";
import TestConfiguration from "./pages/Admin/TestConfiguration";
import StudentManagement from "./pages/Admin/StudentManagement";
import EnhancedAnalytics from "./pages/Admin/EnhancedAnalytics";
import BatchImport from "./pages/Admin/BatchImport";

import ProtectedRoute from "./auth/ProtectedRoute";
import RequireAdmin from "./auth/RequireAdmin";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Home - redirects based on auth & role */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        
        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <Practice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
  path="/results"
  element={
    <ProtectedRoute>
      <Result />
    </ProtectedRoute>
  }
/>
        <Route
          path="/chapters/:chapterId/test"
          element={
            <ProtectedRoute>
              <AttemptMCQs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chapters/:chapterId/notes"
          element={
            <ProtectedRoute>
              <ViewNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/performance"
          element={
            <ProtectedRoute>
              <PerformanceInsights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Home */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/analytics"
  element={
    <ProtectedRoute>
      <RequireAdmin>
        <Analytics />
      </RequireAdmin>
    </ProtectedRoute>
  }
/>

        {/* Admin Subjects */}
        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute>
              <RequireAdmin>
                <Subjects />
              </RequireAdmin>
            </ProtectedRoute>
          }
        />

        {/* Admin Chapters */}
        <Route
          path="/admin/subjects/:subjectId/chapters"
          element={
            <ProtectedRoute>
              <RequireAdmin>
                <Chapters />
              </RequireAdmin>
            </ProtectedRoute>
          }
        />

        {/* Admin Add MCQ */}
        <Route
          path="/admin/chapters/:chapterId/mcqs"
          element={
            <ProtectedRoute>
              <RequireAdmin>
                <AddMCQ />
              </RequireAdmin>
            </ProtectedRoute>
          }
        />

        {/* Admin View MCQs */}
        <Route
          path="/admin/chapters/:chapterId/view-mcqs"
          element={
            <ProtectedRoute>
              <RequireAdmin>
                <ViewMCQs />
              </RequireAdmin>
            </ProtectedRoute>
          }
        />

        {/* Admin Manage Notes */}
        <Route
          path="/admin/chapters/:chapterId/notes"
          element={
            <ProtectedRoute>
              <RequireAdmin>
                <ManageNotes />
              </RequireAdmin>
            </ProtectedRoute>
          }
        />

        {/* Admin Test Configuration */}
        <Route
          path="/admin/chapters/:chapterId/test-config"
          element={
            <ProtectedRoute>
              <RequireAdmin>
                <TestConfiguration />
              </RequireAdmin>
            </ProtectedRoute>
          }
        />

        {/* Admin Student Management */}
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute>
              <RequireAdmin>
                <StudentManagement />
              </RequireAdmin>
            </ProtectedRoute>
          }
        />

        {/* Admin Batch Import */}
        <Route
          path="/admin/batch-import"
          element={
            <ProtectedRoute>
              <RequireAdmin>
                <BatchImport />
              </RequireAdmin>
            </ProtectedRoute>
          }
        />

        {/* Admin Enhanced Analytics */}
        <Route
          path="/admin/analytics/enhanced"
          element={
            <ProtectedRoute>
              <RequireAdmin>
                <EnhancedAnalytics />
              </RequireAdmin>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
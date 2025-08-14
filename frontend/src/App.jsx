// src/App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import NotFound from "./pages/NotFound";
import NotificationPopupHandler from "./components/layout/NotificationPopupHandler.jsx";

import { AuthProvider } from "./auth/AuthContext";
import "./styles/main.scss";
import { RequireAuth, RequireRole } from "./utils/ProtectedRoutes";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', 'Helvetica', 'Arial', sans-serif",
  },
});

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Lessons = lazy(() => import("./pages/Lessons"));
const QnA = lazy(() => import("./pages/QnA"));
const Profile = lazy(() => import("./pages/Profile"));
const LearnerDashboard = lazy(() => import("./pages/LearnerDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Login = lazy(() => import("./components/auth/Login.jsx"));
const Register = lazy(() => import("./components/auth/Register.jsx"));


// Contributor
const ContributorLayout = lazy(() =>
  import("./components/contributor/ContributorLayout")
);
const ContributorUploads = lazy(() =>
  import("./components/contributor/ContributorUploads")
);
const ContributorStats = lazy(() =>
  import("./components/contributor/ContributorStats")
);
const ContributorNewUpload = lazy(() =>
  import("./components/contributor/ContributorNewUpload")
);
const ContributorDashboard = lazy(() => import("./pages/ContributorDashboard"));

const ContributorHome = lazy(() => import("./pages/ContributorHome"));
const MyUploads = lazy(() => import("./components/contributor/MyUploads"));

const LessonViewer = lazy(() => import("./pages/LessonViewer"));
const PendingLessons = lazy(() => import("./pages/PendingLessons"));
const AdminAllLessons = lazy(() => import("./pages/AdminAllLessons"));
const LessonAnalytics = lazy(() => import("./pages/LessonAnalytics"));
const UserManagement = lazy(() => import("./components/admin/UserManagement"));
const QuestionDetail = lazy(() => import("./components/forum/QuestionDetail"));
const QuestionForm = lazy(() => import("./components/forum/QuestionForm"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading..." size="lg" />}>
      <AuthProvider>
        {/* Wrap everything inside ThemeProvider for MUI global theming */}
        <ThemeProvider theme={theme}>
          <Router>
            <ScrollToTop />
            <Header />
            <NotificationPopupHandler />
            <main className="py-4">
              <Container fluid>
                <Suspense
                  fallback={<LoadingSpinner size="lg" message="Loading..." />}
                >
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/lessons" element={<Lessons />} />
                    <Route path="/qna" element={<QnA />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                      path="/profile"
                      element={
                        <RequireAuth>
                          <Profile />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/learner"
                      element={
                        <RequireAuth>
                          <LearnerDashboard />
                        </RequireAuth>
                      }
                    />

                    <Route
                      path="/lessons/:id"
                      element={
                        <RequireAuth>
                          <LessonViewer />
                        </RequireAuth>
                      }
                    />

                    {/* Contributor Routes */}
                    <Route
                      path="/contributor/*"
                      element={
                        <RequireRole allowedRoles={["CONTRIBUTOR"]}>
                          <ContributorLayout />
                        </RequireRole>
                      }
                    >
                      <Route path="" element={<ContributorDashboard />} />
                      <Route index element={<ContributorHome />} />
                      <Route path="uploads" element={<ContributorUploads />} />
                      <Route path="stats" element={<ContributorStats />} />
                      <Route path="my-uploads" element={<MyUploads />} />
                      <Route path="new" element={<ContributorNewUpload />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <RequireRole allowedRoles={["ADMIN"]}>
                          <AdminDashboard />
                        </RequireRole>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <RequireRole allowedRoles={["ADMIN"]}>
                          <UserManagement />
                        </RequireRole>
                      }
                    />
                    <Route
                      path="/admin/approvals"
                      element={
                        <RequireRole allowedRoles={["ADMIN"]}>
                          <PendingLessons />
                        </RequireRole>
                      }
                    />
                    <Route
                      path="/admin/lessons"
                      element={
                        <RequireRole allowedRoles={["ADMIN"]}>
                          <AdminAllLessons />
                        </RequireRole>
                      }
                    />
                    <Route
                      path="/admin/analytics"
                      element={
                        <RequireRole allowedRoles={["ADMIN"]}>
                          <LessonAnalytics />
                        </RequireRole>
                      }
                    />
                    {/* Forum Routes */}
                    <Route path="/questions/:id" element={<QuestionDetail />} />
                    <Route
                      path="/new-question"
                      element={
                        <RequireAuth>
                          <QuestionForm />
                        </RequireAuth>
                      }
                    />
                    <Route path="/questions" element={<QnA />} />

                    {/* Notifications Route */}
                    <Route
                      path="/notifications"
                      element={
                        <RequireAuth>
                          <Notifications />
                        </RequireAuth>
                      }
                    />

                    {/* 404 fallback */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </Container>
            </main>
            <Footer />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;

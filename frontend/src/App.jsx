import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./auth/AuthContext"; // ✅ Add this
import "./styles/main.scss";
import { RequireAuth, RequireRole } from "./utils/ProtectedRoutes";


// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Lessons = lazy(() => import("./pages/Lessons"));
const QnA = lazy(() => import("./pages/QnA"));
const Profile = lazy(() => import("./pages/Profile"));
const LearnerDashboard = lazy(() => import("./pages/LearnerDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

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

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* ✅ Wrap everything inside AuthProvider */}
      <Router>
        <ScrollToTop />
        <Header />
        <main className="py-4">
          <Container fluid>
            <Suspense fallback={<p>Loading...</p>}>
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

                {/* Contributor Routes */}
                <Route
                  path="/contributor/*"
                  element={
                    <RequireRole allowedRoles={["CONTRIBUTOR"]}>
                      <ContributorLayout />
                    </RequireRole>
                  }
                >
                  <Route path="uploads" element={<ContributorUploads />} />
                  <Route path="stats" element={<ContributorStats />} />
                  <Route path="new" element={<ContributorNewUpload />} />
                </Route>

                {/* Admin */}
                <Route
                  path="/admin"
                  element={
                    <RequireRole allowedRoles={["ADMIN"]}>
                      <AdminDashboard />
                    </RequireRole>
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
    </AuthProvider>
  );
}

export default App;

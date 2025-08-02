import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

// Layout components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import NotFound from "./pages/NotFound";

// Auth & Role middleware
import { withAuth, withRole } from "./utils/auth";
import "./styles/main.scss";

// Lazy-loaded pages (corrected paths)
const Home = lazy(() => import("./pages/Home"));
const Lessons = lazy(() => import("./pages/Lessons"));
const QnA = lazy(() => import("./pages/QnA"));
const Profile = lazy(() => import("./pages/Profile"));
const LearnerDashboard = lazy(() => import("./pages/LearnerDashboard"));
const ContributorDashboard = lazy(() => import("./pages/ContributorDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// 🔧 Corrected auth path based on your structure
const Login = lazy(() => import("./components/auth/Login.jsx"));
const Register = lazy(() => import("./components/auth/Register.jsx"));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <main className="py-4">
        <Container>
          <Suspense fallback={<p>Loading...</p>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/qna" element={<QnA />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/profile" element={withAuth(Profile)} />
              <Route path="/learner" element={withAuth(LearnerDashboard)} />
              <Route
                path="/contributor"
                element={withRole(["CONTRIBUTOR"])(ContributorDashboard)}
              />
              <Route
                path="/admin"
                element={withRole(["ADMIN"])(AdminDashboard)}
              />

              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;

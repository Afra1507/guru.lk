import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Lessons from "./pages/Lessons";
import QnA from "./pages/QnA";
import Profile from "./pages/Profile";
import LearnerDashboard from "./pages/LearnerDashboard";
import ContributorDashboard from "./pages/ContributorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Unauthorized from "./pages/Unauthorized";
import { withAuth, withRole } from "./utils/auth";
import "./styles/main.scss";

function App() {
  return (
    <Router>
      <Header />
      <main className="py-4">
        <Container>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/qna" element={<QnA />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={withAuth(Profile)}
            />
            <Route
              path="/learner"
              element={withAuth(LearnerDashboard)}
            />
            <Route
              path="/contributor"
              element={withRole(["CONTRIBUTOR"])(ContributorDashboard)}
            />
            <Route
              path="/admin"
              element={withRole(["ADMIN"])(AdminDashboard)}
            />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;

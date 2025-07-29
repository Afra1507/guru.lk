// Auth utility functions
export const isAuthenticated = () => {
  // Check if user is authenticated
  const token = localStorage.getItem("token");
  return !!token;
};

export const getCurrentUser = () => {
  // Get current user from localStorage or context
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || "learner";
};

export const setAuthToken = (token) => {
  localStorage.setItem("token", token);
};

export const setCurrentUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Higher-order component for protected routes
export const withAuth = (Component) => {
  return (props) => {
    if (!isAuthenticated()) {
      // Redirect to login or show unauthorized
      window.location.href = "/login";
      return null;
    }
    return <Component {...props} />;
  };
};

// Higher-order component for role-based access
export const withRole = (allowedRoles) => (Component) => {
  return (props) => {
    const userRole = getUserRole();
    if (!allowedRoles.includes(userRole)) {
      // Redirect to unauthorized or show access denied
      window.location.href = "/unauthorized";
      return null;
    }
    return <Component {...props} />;
  };
};

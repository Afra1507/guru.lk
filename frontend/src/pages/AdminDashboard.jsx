import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  useTheme,
  Fade,
  useMediaQuery,
  keyframes,
  styled
} from "@mui/material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People";

// Import your admin page components
import PendingLessons from "./PendingLessons";
import AdminAllLessons from "./AdminAllLessons";
import LessonAnalytics from "./LessonAnalytics";
import UserManagement from "../components/admin/UserManagement";

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled components
const DashboardTitle = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(90deg, #001f54, #4fc3f7)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  textShadow: "0 2px 8px rgba(0,31,84,0.15)",
  letterSpacing: "1px",
  fontWeight: "bold",
  marginBottom: theme.spacing(1)
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    height: "4px",
    borderRadius: "2px 2px 0 0",
    background: "linear-gradient(90deg, #001f54, #4fc3f7)",
    animation: `${gradientAnimation} 6s ease infinite`,
    backgroundSize: "200% 200%"
  },
  "& .MuiTabs-flexContainer": {
    background: "rgba(255,255,255,0.95)",
    borderRadius: "12px 12px 0 0",
    backdropFilter: "blur(8px)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  minHeight: "64px",
  transition: "all 0.3s ease",
  "&.Mui-selected": {
    color: "#001f54",
    "& .MuiSvgIcon-root": {
      color: "#4fc3f7",
      animation: `${floatAnimation} 2s ease-in-out infinite`
    }
  },
  "& .MuiSvgIcon-root": {
    transition: "all 0.3s ease",
    marginRight: theme.spacing(1),
    fontSize: "1.25rem"
  },
  "&:hover": {
    background: "rgba(0, 31, 84, 0.05)",
    "& .MuiSvgIcon-root": {
      transform: "scale(1.1)"
    }
  }
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: "auto",
  padding: theme.spacing(3),
  background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,248,255,0.95))",
  backdropFilter: "blur(8px)",
  borderRadius: "16px",
  margin: theme.spacing(0, 2, 2, 2),
  boxShadow: "0 8px 32px rgba(0,31,84,0.1)",
  border: "1px solid rgba(0,31,84,0.05)"
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
      style={{ height: "100%" }}
    >
      {value === index && (
        <Fade in={true} timeout={600}>
          <Box sx={{ py: 3, height: "100%" }}>{children}</Box>
        </Fade>
      )}
    </div>
  );
}

const AdminDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Changed from overflowX to overflow
        background: "linear-gradient(135deg, #f5f8ff, #ffffff)"
      }}
    >
      {/* Header with animated gradient title */}
      <Box sx={{ p: 3, textAlign: "center", flexShrink: 0 }}>
        <DashboardTitle variant={isSmallScreen ? "h4" : "h3"}>
          Admin Dashboard
        </DashboardTitle>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#4a5568",
            letterSpacing: "0.5px",
            fontWeight: 500
          }}
        >
          Manage platform content and users
        </Typography>
      </Box>

      {/* Premium Tabs with glass effect */}
      <Box
        sx={{
          mx: 2,
          mb: 0, // Changed from mb: 2 to remove bottom margin
          boxSizing: "border-box",
          maxWidth: "100%",
          borderRadius: "16px 16px 0 0", // Rounded top corners only
          overflow: "hidden",
          flexShrink: 0 // Prevent tabs from being squished
        }}
      >
        <StyledTabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="admin dashboard tabs"
          variant={isSmallScreen ? "scrollable" : "fullWidth"}
          scrollButtons={isSmallScreen ? "auto" : false}
          textColor="inherit"
        >
          <StyledTab
            icon={<PendingActionsIcon />}
            label="Pending Approvals"
            id="admin-tab-0"
            aria-controls="admin-tabpanel-0"
          />
          <StyledTab
            icon={<MenuBookIcon />}
            label="All Lessons"
            id="admin-tab-1"
            aria-controls="admin-tabpanel-1"
          />
          <StyledTab
            icon={<BarChartIcon />}
            label="Analytics"
            id="admin-tab-2"
            aria-controls="admin-tabpanel-2"
          />
          <StyledTab
            icon={<PeopleIcon />}
            label="User Management"
            id="admin-tab-3"
            aria-controls="admin-tabpanel-3"
          />
        </StyledTabs>
      </Box>

      {/* Content area with glass effect - This is the scrollable part */}
      <ContentContainer sx={{ 
        flex: 1, 
        overflowY: "auto",
        borderRadius: "0 0 16px 16px", // Rounded bottom corners only
        mt: 0 // Remove top margin to stick to tabs
      }}>
        <TabPanel value={tabIndex} index={0}>
          <PendingLessons />
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <AdminAllLessons />
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          <LessonAnalytics />
        </TabPanel>

        <TabPanel value={tabIndex} index={3}>
          <UserManagement />
        </TabPanel>
      </ContentContainer>
    </Box>
  );
};

export default AdminDashboard;
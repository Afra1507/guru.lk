import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  useTheme,
  Fade,
  useMediaQuery,
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
        <Fade in={true} timeout={400}>
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
        width: "100%", // changed from 100vw to 100%
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden", // keep overflow hidden on x axis
      }}
    >
      {/* Title without background, navy blue color */}
      <Box sx={{ p: 3 }}>
        <Typography
          variant={isSmallScreen ? "h4" : "h3"}
          sx={{
            fontWeight: 700,
            fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            letterSpacing: "0.05em",
            color: "#001f54",
            textAlign: "center",
          }}
        >
          Admin Dashboard
        </Typography>
      </Box>

      {/* Responsive Tabs with shadow and rounded edges */}
      <Box
        sx={{
          mx: 1,
          mb: 2,
          boxSizing: "border-box",
          maxWidth: "100%", // keep within viewport width
          bgcolor: "#fff",
          boxShadow: theme.shadows[3],
          borderRadius: 2,
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="admin dashboard tabs"
          variant={isSmallScreen ? "scrollable" : "fullWidth"}
          scrollButtons={isSmallScreen ? "auto" : false}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            minHeight: 48,
            "& .MuiTab-root": {
              minHeight: 48,
              fontWeight: 600,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 0.5,
              fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
              paddingX: 1,
              whiteSpace: "nowrap",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#001f54",
              fontWeight: "bold",
            },
          }}
        >
          <Tab
            icon={<PendingActionsIcon />}
            iconPosition="start"
            label="Pending"
            id="admin-tab-0"
            aria-controls="admin-tabpanel-0"
          />
          <Tab
            icon={<MenuBookIcon />}
            iconPosition="start"
            label="All Lessons"
            id="admin-tab-1"
            aria-controls="admin-tabpanel-1"
          />
          <Tab
            icon={<BarChartIcon />}
            iconPosition="start"
            label="Analytics"
            id="admin-tab-2"
            aria-controls="admin-tabpanel-2"
          />
          <Tab
            icon={<PeopleIcon />}
            iconPosition="start"
            label="Users"
            id="admin-tab-3"
            aria-controls="admin-tabpanel-3"
          />
        </Tabs>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
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
      </Box>
    </Box>
  );
};

export default AdminDashboard;

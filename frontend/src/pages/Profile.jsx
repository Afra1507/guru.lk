import React, { useEffect, useState } from "react";
import ProfileInfo from "../components/profile/ProfileInfo";
import Sidebar from "../components/layout/Sidebar";
import {
  Container,
  Grid,
  Typography,
  Box,
  Divider,
  useTheme,
  styled,
  keyframes,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { motion } from "framer-motion";

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(25, 118, 210, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
`;

// Color palette
const colors = {
  primary: "#1976d2",
  secondary: "#4fc3f7",
  accent: "#FFC107",
  darkBg: "#0a1929",
  lightText: "#f5f5f5",
  glassBorder: "rgba(255, 255, 255, 0.08)",
};

// Full-bleed background container


// Styled components
const ContentContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

const GlassPanel = styled("div")(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(16, 45, 112, 0.81), rgba(10, 25, 41, 0.4))",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: `1px solid ${colors.glassBorder}`,
  borderRadius: "20px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
  padding: theme.spacing(4),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
    zIndex: 1,
  },
}));

const ProfileHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${colors.glassBorder}`,
}));

const RoleBadge = styled("div")(({ theme, role }) => ({
  background:
    role === "ADMIN"
      ? "linear-gradient(135deg, #d32f2f, #b71c1c)"
      : "linear-gradient(135deg, #388e3c, #1b5e20)",
  color: "white",
  padding: theme.spacing(0.5, 1.5),
  borderRadius: "16px",
  fontSize: "0.7rem",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
  animation: `${pulseAnimation} 2s infinite`,
}));

const ProfileIcon = styled(AccountCircleIcon)(({ theme }) => ({
  fontSize: "2.8rem",
  color: colors.secondary,
  filter: "drop-shadow(0 0 6px rgba(79, 195, 247, 0.4))",
  animation: `${floatAnimation} 3s ease-in-out infinite`,
}));

const AdminIcon = styled(AdminPanelSettingsIcon)(({ theme }) => ({
  fontSize: "2.8rem",
  color: colors.accent,
  filter: "drop-shadow(0 0 6px rgba(255, 193, 7, 0.4))",
  animation: `${floatAnimation} 3s ease-in-out infinite`,
}));

const Profile = () => {
  const [user, setUser] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="subtitle1"
              color={colors.lightText}
              sx={{ textAlign: "center" }}
            >
              Loading your profile...
            </Typography>
          </motion.div>
        </Box>
    );
  }

  const role = user.role?.toUpperCase();

  return (
      <ContentContainer maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ maxWidth: 1400, mx: "auto" }}
          >
            {role !== "LEARNER" && (
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  position: "sticky",
                  top: theme.spacing(6),
                  height: "fit-content",
                }}
              >
                <GlassPanel>
                  <ProfileHeader>
                    {role === "ADMIN" ? <AdminIcon /> : <ProfileIcon />}
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: colors.lightText,
                          letterSpacing: "0.3px",
                          fontSize: "1.1rem",
                        }}
                      >
                        {role} Dashboard
                      </Typography>
                      <RoleBadge role={role}>{role.toLowerCase()}</RoleBadge>
                    </Box>
                  </ProfileHeader>
                  <Sidebar role={role} />
                </GlassPanel>
              </Grid>
            )}
            <Grid item xs={12} md={role !== "LEARNER" ? 8 : 12}>
              <GlassPanel>
                <ProfileHeader>
                  {role === "ADMIN" ? <AdminIcon /> : <ProfileIcon />}
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        letterSpacing: "0.03em",
                        color: colors.lightText,
                        lineHeight: 1.3,
                        fontSize: "1.5rem",
                      }}
                    >
                      {role === "ADMIN" ? "Admin Control Panel" : "My Profile"}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: colors.secondary,
                        fontWeight: 500,
                        fontSize: "0.9rem",
                      }}
                    >
                      {user.email}
                    </Typography>
                  </Box>
                </ProfileHeader>

                <ProfileInfo user={user} setUser={setUser} />
              </GlassPanel>
            </Grid>
          </Grid>
        </motion.div>
      </ContentContainer>
  );
};

export default Profile;

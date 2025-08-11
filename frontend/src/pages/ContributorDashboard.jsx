import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
  Fade,
  useTheme,
  useMediaQuery,
  Paper,
  Stack,
  keyframes,
  styled,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import SchoolIcon from "@mui/icons-material/School";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AnswerIcon from "@mui/icons-material/QuestionAnswerOutlined";
import contentService from "../services/contentService";
import * as communityService from "../services/communityService";
import ContentCard from "../components/content/ContentCard";
import QuestionCard from "../components/forum/QuestionCard";
import AnswerCard from "../components/forum/AnswerCard";
import { jwtDecode } from "jwt-decode";

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 31, 84, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(0, 31, 84, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 31, 84, 0); }
`;

// Styled components
const PremiumPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "12px",
  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  boxShadow: theme.shadows[4],
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
    "& .stat-icon": {
      animation: `${floatAnimation} 2s ease-in-out infinite`,
    },
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    height: "4px",
    borderRadius: "2px 2px 0 0",
    background: "linear-gradient(90deg, #001f54, #4fc3f7)",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  minHeight: "64px",
  "&.Mui-selected": {
    color: "#001f54",
    "& .MuiSvgIcon-root": {
      color: "#4fc3f7",
    },
  },
  "& .MuiSvgIcon-root": {
    transition: "all 0.3s ease",
    marginRight: theme.spacing(1),
  },
}));

const StatIcon = styled("div")(({ theme, color }) => ({
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${color}, ${theme.palette.getContrastText(
    color
  )})`,
  color: "white",
  boxShadow: theme.shadows[2],
  marginBottom: theme.spacing(1),
}));

const DashboardTitle = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(90deg, #001f54, #4fc3f7)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  textShadow: "0 2px 4px rgba(0,31,84,0.1)",
  letterSpacing: "0.5px",
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`contributor-tabpanel-${index}`}
      aria-labelledby={`contributor-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in timeout={600}>
          <Box sx={{ py: 3, minHeight: "300px" }}>{children}</Box>
        </Fade>
      )}
    </div>
  );
}

// UploadStats component with premium styling
const UploadStats = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const lessons = await contentService.getLessonsByUploader(userId);

        const totalUploads = lessons.length;
        const approvedUploads = lessons.filter((l) => l.isApproved).length;
        const pendingUploads = totalUploads - approvedUploads;
        const totalViews = lessons.reduce(
          (sum, l) => sum + (l.viewCount || 0),
          0
        );
        const totalDownloads = lessons.reduce(
          (sum, l) => sum + (l.downloadCount || 0),
          0
        );

        setStats({
          totalUploads,
          approvedUploads,
          pendingUploads,
          totalViews,
          totalDownloads,
        });
      } catch (err) {
        setError(err.message || "Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress sx={{ color: "#4fc3f7" }} />
      </Box>
    );
  if (error)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        {error}
      </Typography>
    );

  const statItems = [
    {
      label: "Total Uploads",
      value: stats.totalUploads,
      color: "#9e9e9e",
      icon: <CloudUploadIcon />,
    },
    {
      label: "Approved Uploads",
      value: stats.approvedUploads,
      color: "#4caf50",
      icon: <CheckCircleIcon />,
    },
    {
      label: "Pending Uploads",
      value: stats.pendingUploads,
      color: "#ff9800",
      icon: <HourglassEmptyIcon />,
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      color: "#2196f3",
      icon: <VisibilityIcon />,
    },
    {
      label: "Total Downloads",
      value: stats.totalDownloads,
      color: "#3f51b5",
      icon: <DownloadIcon />,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={3} justifyContent="center">
        {statItems.map(({ label, value, color, icon }, idx) => (
          <Grid key={idx} item xs={12} sm={6} md={4} lg={3}>
            <PremiumPaper elevation={6} sx={{ p: 3, height: "100%" }}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
              >
                <StatIcon color={color} className="stat-icon">
                  {React.cloneElement(icon, { sx: { fontSize: 24 } })}
                </StatIcon>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  color="text.secondary"
                  gutterBottom
                >
                  {label}
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: "#001f54" }}
                >
                  {value ?? 0}
                </Typography>
              </Box>
            </PremiumPaper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const ContributorDashboard = () => {
  const [myUploads, setMyUploads] = useState([]);
  const [myQuestions, setMyQuestions] = useState([]);
  const [myAnswers, setMyAnswers] = useState([]);

  const [loadingUploads, setLoadingUploads] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingAnswers, setLoadingAnswers] = useState(true);

  const [tabIndex, setTabIndex] = useState(0);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return undefined;
      const decoded = jwtDecode(token);
      return decoded?.id || decoded?.userId || decoded?.sub;
    } catch (e) {
      console.error("Failed to decode token", e);
      return undefined;
    }
  };

  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!userId) {
      setLoadingUploads(false);
      setLoadingQuestions(false);
      setLoadingAnswers(false);
      return;
    }

    // Fetch contributor uploads
    contentService
      .getLessonsByUploader(userId)
      .then((lessons) => setMyUploads(lessons))
      .catch((err) => console.error("Failed to load uploads", err))
      .finally(() => setLoadingUploads(false));

    // Fetch contributor questions
    communityService
      .getQuestionsByUserId(userId)
      .then((res) => setMyQuestions(res.data))
      .catch((err) => console.error("Failed to load questions", err))
      .finally(() => setLoadingQuestions(false));

    // Fetch contributor answers
    communityService
      .getAnswersByUserId(userId)
      .then((res) => setMyAnswers(res.data))
      .catch((err) => console.error("Failed to load answers", err))
      .finally(() => setLoadingAnswers(false));
  }, [userId]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
      <DashboardTitle
        variant={isSmallScreen ? "h4" : "h3"}
        fontWeight="bold"
        gutterBottom
        sx={{ textAlign: "center", mb: 4 }}
      >
        Contributor Dashboard
      </DashboardTitle>

      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 2,
          mb: 4,
          boxShadow: "0 4px 20px rgba(0,31,84,0.1)",
        }}
      >
        <StyledTabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="contributor dashboard tabs"
          variant={isSmallScreen ? "scrollable" : "fullWidth"}
          scrollButtons={isSmallScreen ? "auto" : false}
          textColor="inherit"
        >
          <StyledTab
            label="Upload Stats"
            icon={<CloudUploadIcon />}
            id="contributor-tab-0"
            aria-controls="contributor-tabpanel-0"
          />
          <StyledTab
            label="My Uploads"
            icon={<SchoolIcon />}
            id="contributor-tab-1"
            aria-controls="contributor-tabpanel-1"
          />
          <StyledTab
            label="My Questions"
            icon={<QuestionAnswerIcon />}
            id="contributor-tab-2"
            aria-controls="contributor-tabpanel-2"
          />
          <StyledTab
            label="My Answers"
            icon={<AnswerIcon />}
            id="contributor-tab-3"
            aria-controls="contributor-tabpanel-3"
          />
        </StyledTabs>
      </Box>

      {/* Upload Stats */}
      <TabPanel value={tabIndex} index={0}>
        <UploadStats userId={userId} />
      </TabPanel>

      {/* My Uploads */}
      <TabPanel value={tabIndex} index={1}>
        {loadingUploads ? (
          <Box textAlign="center" py={8}>
            <CircularProgress sx={{ color: "#4fc3f7" }} />
          </Box>
        ) : myUploads.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 4 }}
          >
            You have not uploaded any lessons yet.
          </Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {myUploads.map((lesson) => (
              <Grid
                item
                xs={12} // 1 card per row on extra small
                sm={6} // 2 cards per row on small
                md={3} // 3 cards per row on medium
                lg={4} // 4 cards per row on large+
                key={lesson.lessonId || lesson.id}
                display="flex"
                justifyContent="center"
              >
                <ContentCard lesson={lesson} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* My Questions */}
      <TabPanel value={tabIndex} index={2}>
        {loadingQuestions ? (
          <Box textAlign="center" py={8}>
            <CircularProgress sx={{ color: "#4fc3f7" }} />
          </Box>
        ) : myQuestions.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 4 }}
          >
            You have no questions yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {myQuestions.map((question) => (
              <Grid item xs={12} key={question.questionId}>
                <QuestionCard question={question} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* My Answers */}
      <TabPanel value={tabIndex} index={3}>
        {loadingAnswers ? (
          <Box textAlign="center" py={8}>
            <CircularProgress sx={{ color: "#4fc3f7" }} />
          </Box>
        ) : myAnswers.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 4 }}
          >
            You have not answered any questions yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {myAnswers.map((answer) => (
              <Grid item xs={12} key={answer.answerId}>
                <AnswerCard answer={answer} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>
    </Container>
  );
};

export default ContributorDashboard;

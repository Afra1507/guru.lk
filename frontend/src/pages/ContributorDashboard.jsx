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
import {jwtDecode} from "jwt-decode";

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

// UploadStats component adapted for contributor uploads
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
        <CircularProgress />
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
      color: "grey.100",
      icon: <CloudUploadIcon sx={{ fontSize: 30, color: "text.secondary" }} />,
    },
    {
      label: "Approved Uploads",
      value: stats.approvedUploads,
      color: "success.light",
      icon: <CheckCircleIcon sx={{ fontSize: 30, color: "success.dark" }} />,
    },
    {
      label: "Pending Uploads",
      value: stats.pendingUploads,
      color: "warning.light",
      icon: <HourglassEmptyIcon sx={{ fontSize: 30, color: "warning.dark" }} />,
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      color: "info.light",
      icon: <VisibilityIcon sx={{ fontSize: 30, color: "info.dark" }} />,
    },
    {
      label: "Total Downloads",
      value: stats.totalDownloads,
      color: "primary.light",
      icon: <DownloadIcon sx={{ fontSize: 30, color: "primary.dark" }} />,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={3} justifyContent="center" flexWrap="wrap">
        {statItems.map(({ label, value, color, icon }, idx) => (
          <Grid
            key={idx}
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{ display: "flex" }}
          >
            <Paper
              elevation={6}
              sx={{
                p: 3,
                bgcolor: color,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                width: "100%",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                transition:
                  "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
                cursor: "default",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "rgba(0, 0, 0, 0.25) 0px 8px 20px",
                  bgcolor: (theme) => theme.palette.grey[200],
                },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                mb={1}
                sx={{ justifyContent: "center", width: "100%" }}
              >
                {icon}
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  sx={{ flexGrow: 1 }}
                >
                  {label}
                </Typography>
              </Stack>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                {value ?? 0}
              </Typography>
            </Paper>
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
      <Typography
        variant={isSmallScreen ? "h4" : "h3"}
        fontWeight="bold"
        gutterBottom
        sx={{ textAlign: "center", color: "#001f54", mb: 4 }}
      >
        Contributor Dashboard
      </Typography>

      <Box
        sx={{
          bgcolor: "#fff",
          boxShadow: theme.shadows[3],
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="contributor dashboard tabs"
          variant={isSmallScreen ? "scrollable" : "fullWidth"}
          scrollButtons={isSmallScreen ? "auto" : false}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            minHeight: 56,
            "& .MuiTab-root": {
              minHeight: 56,
              fontWeight: 600,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
              fontSize: isSmallScreen ? "0.8rem" : "1rem",
              px: 2,
              whiteSpace: "nowrap",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#001f54",
              fontWeight: "bold",
            },
          }}
        >
          <Tab
            label="Upload Stats"
            icon={<CloudUploadIcon />}
            iconPosition="start"
            id="contributor-tab-0"
            aria-controls="contributor-tabpanel-0"
          />
          <Tab
            label="My Uploads"
            icon={<SchoolIcon />}
            iconPosition="start"
            id="contributor-tab-1"
            aria-controls="contributor-tabpanel-1"
          />
          <Tab
            label="My Questions"
            icon={<QuestionAnswerIcon />}
            iconPosition="start"
            id="contributor-tab-2"
            aria-controls="contributor-tabpanel-2"
          />
          <Tab
            label="My Answers"
            icon={<AnswerIcon />}
            iconPosition="start"
            id="contributor-tab-3"
            aria-controls="contributor-tabpanel-3"
          />
        </Tabs>
      </Box>

      {/* Upload Stats */}
      <TabPanel value={tabIndex} index={0}>
        <UploadStats userId={userId} />
      </TabPanel>

      {/* My Uploads */}
      <TabPanel value={tabIndex} index={1}>
        {loadingUploads ? (
          <Box textAlign="center" py={8}>
            <CircularProgress />
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
          <Grid container spacing={3}>
            {myUploads.map((lesson) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={lesson.lessonId || lesson.id}
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
            <CircularProgress />
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
            <CircularProgress />
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

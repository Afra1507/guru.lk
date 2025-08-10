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
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AnswerIcon from "@mui/icons-material/QuestionAnswerOutlined"; // icon for Answers tab
import ContentCard from "../components/content/ContentCard";
import contentService from "../services/contentService";
import {jwtDecode} from "jwt-decode";
import * as communityService from "../services/communityService";

// Import your forum components
import QuestionCard from "../components/forum/QuestionCard";
import AnswerCard from "../components/forum/AnswerCard";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`learner-tabpanel-${index}`}
      aria-labelledby={`learner-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const LearnerDashboard = () => {
  const [recentLessons, setRecentLessons] = useState([]);
  const [downloadedLessons, setDownloadedLessons] = useState([]);
  const [myQuestions, setMyQuestions] = useState([]);
  const [myAnswers, setMyAnswers] = useState([]);

  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingDownloads, setLoadingDownloads] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingAnswers, setLoadingAnswers] = useState(true);

  const [tabIndex, setTabIndex] = useState(0);

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

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setLoadingRecent(false);
      setLoadingDownloads(false);
      setLoadingQuestions(false);
      setLoadingAnswers(false);
      return;
    }

    // Fetch recent lessons
    contentService
      .getApprovedLessons()
      .then((lessons) => setRecentLessons(lessons))
      .catch((err) => console.error("Failed to load recent lessons", err))
      .finally(() => setLoadingRecent(false));

    // Fetch user downloads
    contentService
      .getUserDownloads(userId)
      .then((downloads) => {
        const lessonsFromDownloads = downloads.map((d) => d.lesson);
        const uniqueLessonsMap = new Map();
        lessonsFromDownloads.forEach((lesson) => {
          const id = lesson.lessonId || lesson.id;
          if (!uniqueLessonsMap.has(id)) uniqueLessonsMap.set(id, lesson);
        });
        setDownloadedLessons(Array.from(uniqueLessonsMap.values()));
      })
      .catch((err) => console.error("Failed to load downloads", err))
      .finally(() => setLoadingDownloads(false));

    // Fetch user questions
    communityService
      .getQuestionsByUserId(userId)
      .then((res) => setMyQuestions(res.data))
      .catch((err) => console.error("Failed to load user's questions", err))
      .finally(() => setLoadingQuestions(false));

    // Fetch user answers
    communityService
      .getAnswersByUserId(userId)
      .then((res) => setMyAnswers(res.data))
      .catch((err) => console.error("Failed to load user's answers", err))
      .finally(() => setLoadingAnswers(false));
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Learner Dashboard
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="learner dashboard tabs"
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab
          label="Recent Lessons"
          icon={<SchoolIcon />}
          iconPosition="start"
          id="learner-tab-0"
          aria-controls="learner-tabpanel-0"
        />
        <Tab
          label="My Downloads"
          icon={<DownloadDoneIcon />}
          iconPosition="start"
          id="learner-tab-1"
          aria-controls="learner-tabpanel-1"
        />
        <Tab
          label="My Questions"
          icon={<QuestionAnswerIcon />}
          iconPosition="start"
          id="learner-tab-2"
          aria-controls="learner-tabpanel-2"
        />
        <Tab
          label="My Answers"
          icon={<AnswerIcon />}
          iconPosition="start"
          id="learner-tab-3"
          aria-controls="learner-tabpanel-3"
        />
      </Tabs>

      {/* Recent Lessons */}
      <TabPanel value={tabIndex} index={0}>
        {loadingRecent ? (
          <Box textAlign="center" py={5}>
            <CircularProgress />
          </Box>
        ) : recentLessons.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No recent lessons found.
          </Typography>
        ) : (
          <Fade in timeout={600}>
            <Grid container spacing={3}>
              {recentLessons.map((lesson) => (
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
          </Fade>
        )}
      </TabPanel>

      {/* My Downloads */}
      <TabPanel value={tabIndex} index={1}>
        {loadingDownloads ? (
          <Box textAlign="center" py={5}>
            <CircularProgress />
          </Box>
        ) : downloadedLessons.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No downloads found.
          </Typography>
        ) : (
          <Fade in timeout={600}>
            <Grid container spacing={3}>
              {downloadedLessons.map((lesson) => (
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
          </Fade>
        )}
      </TabPanel>

      {/* My Questions */}
      <TabPanel value={tabIndex} index={2}>
        {loadingQuestions ? (
          <Box textAlign="center" py={5}>
            <CircularProgress />
          </Box>
        ) : myQuestions.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            You have no questions yet.
          </Typography>
        ) : (
          <Fade in timeout={600}>
            <Grid container spacing={3}>
              {myQuestions.map((question) => (
                <Grid item xs={12} key={question.questionId}>
                  <QuestionCard question={question} />
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}
      </TabPanel>

      {/* My Answers */}
      <TabPanel value={tabIndex} index={3}>
        {loadingAnswers ? (
          <Box textAlign="center" py={5}>
            <CircularProgress />
          </Box>
        ) : myAnswers.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            You have not answered any questions yet.
          </Typography>
        ) : (
          <Fade in timeout={600}>
            <Grid container spacing={3}>
              {myAnswers.map((answer) => (
                <Grid item xs={12} key={answer.answerId}>
                  <AnswerCard answer={answer} />
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}
      </TabPanel>
    </Container>
  );
};

export default LearnerDashboard;

import React, { useState } from "react";
import {
  Chip,
  Button,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import SubjectIcon from "@mui/icons-material/Subject";
import LanguageIcon from "@mui/icons-material/Language";
import ScienceIcon from "@mui/icons-material/Science";
import CalculateIcon from "@mui/icons-material/Calculate";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import PsychologyIcon from "@mui/icons-material/Psychology";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import SecurityIcon from "@mui/icons-material/Security";
import StorageIcon from "@mui/icons-material/Storage";
import WebIcon from "@mui/icons-material/Web";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import GavelIcon from "@mui/icons-material/Gavel";
import EcoIcon from "@mui/icons-material/Grass";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import BookIcon from "@mui/icons-material/Book";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PaletteIcon from "@mui/icons-material/Palette";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MarketingIcon from "@mui/icons-material/TrendingUp";
import SchoolIcon from "@mui/icons-material/School";
import ComputerIcon from "@mui/icons-material/Computer";

import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";
import contentService from "../../services/contentService";
import {jwtDecode} from "jwt-decode";
import { translate } from "../../utils/language";

import styles from "./ContentCard.module.css";

// Map subject to icon components with white color and size 48
const subjectIcons = {
  // Common subjects
  Mathematics: <CalculateIcon sx={{ fontSize: 48, color: "white" }} />,
  Science: <ScienceIcon sx={{ fontSize: 48, color: "white" }} />,
  Sinhala: <LanguageIcon sx={{ fontSize: 48, color: "white" }} />,
  Tamil: <LanguageIcon sx={{ fontSize: 48, color: "white" }} />,
  English: <LanguageIcon sx={{ fontSize: 48, color: "white" }} />,
  History: <HistoryEduIcon sx={{ fontSize: 48, color: "white" }} />,
  Geography: <SchoolIcon sx={{ fontSize: 48, color: "white" }} />,
  Civics: <AccountBalanceIcon sx={{ fontSize: 48, color: "white" }} />,
  Religion: <SchoolIcon sx={{ fontSize: 48, color: "white" }} />,
  "Health & Physical Education": <SportsSoccerIcon sx={{ fontSize: 48, color: "white" }} />,
  Art: <PaletteIcon sx={{ fontSize: 48, color: "white" }} />,
  Music: <MusicNoteIcon sx={{ fontSize: 48, color: "white" }} />,
  "Information & Communication Technology": <ComputerIcon sx={{ fontSize: 48, color: "white" }} />,
  Commerce: <BusinessCenterIcon sx={{ fontSize: 48, color: "white" }} />,
  Literature: <BookIcon sx={{ fontSize: 48, color: "white" }} />,

  // O-Level & A-Level specific
  "Combined Mathematics": <CalculateIcon sx={{ fontSize: 48, color: "white" }} />,
  Physics: <ScienceOutlinedIcon sx={{ fontSize: 48, color: "white" }} />,
  Chemistry: <ScienceOutlinedIcon sx={{ fontSize: 48, color: "white" }} />,
  Biology: <EcoIcon sx={{ fontSize: 48, color: "white" }} />,
  Accounting: <AccountBalanceIcon sx={{ fontSize: 48, color: "white" }} />,
  "Business Studies": <BusinessCenterIcon sx={{ fontSize: 48, color: "white" }} />,
  Economics: <MarketingIcon sx={{ fontSize: 48, color: "white" }} />,
  Agriculture: <EcoIcon sx={{ fontSize: 48, color: "white" }} />,
  "Engineering Technology": <CalculateIcon sx={{ fontSize: 48, color: "white" }} />,
  "Political Science": <GavelIcon sx={{ fontSize: 48, color: "white" }} />,
  Logic: <CalculateIcon sx={{ fontSize: 48, color: "white" }} />,

  // Campus Major Subjects
  "Computer Science": <ComputerIcon sx={{ fontSize: 48, color: "white" }} />,
  Law: <GavelIcon sx={{ fontSize: 48, color: "white" }} />,
  Medicine: <LocalHospitalIcon sx={{ fontSize: 48, color: "white" }} />,
  Engineering: <CalculateIcon sx={{ fontSize: 48, color: "white" }} />,
  Nursing: <LocalHospitalIcon sx={{ fontSize: 48, color: "white" }} />,
  Architecture: <ArchitectureIcon sx={{ fontSize: 48, color: "white" }} />,
  Management: <BusinessCenterIcon sx={{ fontSize: 48, color: "white" }} />,
  Psychology: <PsychologyIcon sx={{ fontSize: 48, color: "white" }} />,
  "Environmental Science": <EcoIcon sx={{ fontSize: 48, color: "white" }} />,
  Finance: <AccountBalanceIcon sx={{ fontSize: 48, color: "white" }} />,
  Marketing: <MarketingIcon sx={{ fontSize: 48, color: "white" }} />,
  Statistics: <DataUsageIcon sx={{ fontSize: 48, color: "white" }} />,
  "Information Technology": <StorageIcon sx={{ fontSize: 48, color: "white" }} />,
  Business: <BusinessCenterIcon sx={{ fontSize: 48, color: "white" }} />,
  "Data science": <DataUsageIcon sx={{ fontSize: 48, color: "white" }} />,
  "Artificial Intelligence": <ComputerIcon sx={{ fontSize: 48, color: "white" }} />,
  "Cyber Security": <SecurityIcon sx={{ fontSize: 48, color: "white" }} />,
  "Software Engineering": <ComputerIcon sx={{ fontSize: 48, color: "white" }} />,
  "Web Development": <WebIcon sx={{ fontSize: 48, color: "white" }} />,
  "Mobile App Development": <PhoneAndroidIcon sx={{ fontSize: 48, color: "white" }} />,
  "Applied Mathematics": <CalculateIcon sx={{ fontSize: 48, color: "white" }} />,
  "Bio Science": <EcoIcon sx={{ fontSize: 48, color: "white" }} />,

  // Aliases for backward compatibility
  Maths: <CalculateIcon sx={{ fontSize: 48, color: "white" }} />,
  "Web Development": <WebIcon sx={{ fontSize: 48, color: "white" }} />,
  "Mobile App Development": <PhoneAndroidIcon sx={{ fontSize: 48, color: "white" }} />,

  // Fallback
  Default: <SubjectIcon sx={{ fontSize: 48, color: "white" }} />,
};

const ContentCard = ({ lesson }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [isDownloading, setIsDownloading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const currentLanguage = localStorage.getItem("language") || "sinhala";

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return undefined;
      const decoded = jwtDecode(token);
      return decoded?.id || decoded?.userId || decoded?.sub;
    } catch (e) {
      return undefined;
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: translate("contentCard.pleaseLoginToDownload", currentLanguage),
        severity: "warning",
      });
      return;
    }

    const userId = getUserIdFromToken();
    const lessonId = lesson.lessonId;

    if (!userId) {
      setSnackbar({
        open: true,
        message: translate("contentCard.userIdNotFound", currentLanguage),
        severity: "error",
      });
      return;
    }

    try {
      setIsDownloading(true);

      const downloadResponse = await contentService.createDownload(
        userId,
        lessonId
      );

      if (!downloadResponse?.fileUrl) {
        setSnackbar({
          open: true,
          message: translate(
            "contentCard.downloadUrlNotFound",
            currentLanguage
          ),
          severity: "error",
        });
        return;
      }

      setSnackbar({
        open: true,
        message: translate("contentCard.downloadRegistered", currentLanguage),
        severity: "success",
      });

      window.open(downloadResponse.fileUrl, "_blank");
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.message ||
          translate("contentCard.downloadFailed", currentLanguage),
        severity: "error",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleView = () => {
    navigate(`/lessons/${lesson.lessonId}`);
  };

  // Select the icon for the subject or default if missing
  const SubjectIconComponent =
    subjectIcons[lesson.subject] || subjectIcons.Default;

  return (
    <>
      <div
        className={styles.card}
        onClick={handleView}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") handleView();
        }}
      >
        <div className={styles.content}>
          {/* Front */}
          <div className={styles.front}>
            {SubjectIconComponent}
            <div className={styles.title} title={lesson.title}>
              {lesson.title}
            </div>
          </div>

          {/* Back */}
          <div className={styles.back}>
            <div className={styles["back-content"]}>
              <div className={styles.description}>{lesson.description}</div>

              <Stack direction="row" spacing={1} className={styles.chips}>
                <Chip
                  icon={<SubjectIcon />}
                  label={lesson.subject}
                  color="info"
                  size="small"
                />
                <Chip
                  icon={<LanguageIcon />}
                  label={lesson.language}
                  color="secondary"
                  size="small"
                />
              </Stack>

              <Button
                variant="contained"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                disabled={isDownloading}
                onFocus={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {isDownloading
                  ? translate("contentCard.downloadProcessing", currentLanguage)
                  : translate("contentCard.download", currentLanguage)}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContentCard;
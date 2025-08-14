import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Link,
  Box,
  IconButton,
  Stack,
  Divider,
  useTheme,
  Paper,
} from "@mui/material";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import {
  HomeOutlined,
  MenuBookOutlined,
  ForumOutlined,
  SchoolOutlined,
  PersonOutline,
} from "@mui/icons-material";
import { translate, initLanguage } from "../../utils/language";

const Footer = () => {
  const theme = useTheme();
  const [language] = useState(initLanguage());

  const socialIcons = [
    { icon: FaFacebook, label: "Facebook", href: "https://web.facebook.com/profile.php?id=100090786972452", color: "#1877F2" },
    { icon: FaTwitter, label: "Twitter", href: "https://x.com/Banu0715", color: "#1DA1F2" },
    { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/afrabanu_0715?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", color: "#E4405F" },
    { icon: FaYoutube, label: "YouTube", href: "https://www.youtube.com/@apppuuu6", color: "#FF0000" },
    { icon: FaGithub, label: "Github", href: "https://github.com/Afra1507", color: "#181717" },
    { icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/afra-banu-zahir-hussain-a49691221/", color: "#0A66C2" },
  ];

  const quickLinks = [
    {
      label: translate("home", language),
      href: "/",
      icon: <HomeOutlined fontSize="small" />,
    },
    {
      label: translate("lessons", language),
      href: "/lessons",
      icon: <MenuBookOutlined fontSize="small" />,
    },
    {
      label: translate("forum", language),
      href: "/qna",
      icon: <ForumOutlined fontSize="small" />,
    },
    {
      label: translate("dashboardLabels.myDashboard", language),
      href: "/profile",
      icon: <PersonOutline fontSize="small" />,
    },
    {
      label: translate("footer.universityPortal", language),
      href: "https://lms.fas.sjp.ac.lk/",
      icon: <SchoolOutlined fontSize="small" />,
    },
  ];

  const contactInfo = [
    {
      icon: <MdLocationOn size={20} />,
      text: translate("footer.address", language),
    },
    {
      icon: <MdPhone size={20} />,
      text: "+94 112 803 803",
      href: "tel:+94112803803",
    },
    {
      icon: <MdEmail size={20} />,
      text: "info@guru.lk",
      href: "mailto:info@guru.lk",
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        backgroundImage: "linear-gradient(135deg, #031227 0%, #0a2240 100%)",
        color: "text.secondary",
        pt: 8,
        pb: 6,
        borderTop: `1px solid ${theme.palette.divider}`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #1976d2, #64b5f6)",
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* About Section */}
          <Grid item xs={12} md={5}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "common.white",
                mb: 3,
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "60px",
                  height: "3px",
                  background: theme.palette.primary.main,
                  borderRadius: 3,
                },
              }}
            >
              {translate("footer.aboutTitle", language)}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                lineHeight: 1.7,
                mb: 3,
              }}
            >
              {translate("footer.aboutDescription", language)}
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialIcons.map(({ icon: Icon, label, href, color }) => (
                <IconButton
                  key={label}
                  href={href}
                  aria-label={label}
                  sx={{
                    color: "common.white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: color,
                      transform: "translateY(-3px)",
                      boxShadow: `0 4px 12px ${color}80`,
                    },
                  }}
                  size="medium"
                >
                  <Icon size={18} />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: "transparent",
                p: 0,
                "& .MuiListItem-root": {
                  px: 0,
                },
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: "common.white",
                  mb: 3,
                  position: "relative",
                  display: "inline-block",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: 0,
                    width: "60px",
                    height: "3px",
                    background: theme.palette.primary.main,
                    borderRadius: 3,
                  },
                }}
              >
                {translate("footer.quickLinksTitle", language)}
              </Typography>
              <Stack spacing={1.5}>
                {quickLinks.map(({ label, href, icon }) => (
                  <Link
                    key={label}
                    href={href}
                    underline="none"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "rgba(255, 255, 255, 0.7)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: theme.palette.primary.light,
                        transform: "translateX(5px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        mr: 1.5,
                        display: "flex",
                        alignItems: "center",
                        color: "inherit",
                      }}
                    >
                      {icon}
                    </Box>
                    {label}
                  </Link>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "common.white",
                mb: 3,
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "60px",
                  height: "3px",
                  background: theme.palette.primary.main,
                  borderRadius: 3,
                },
              }}
            >
              {translate("footer.contactUsTitle", language)}
            </Typography>
            <Stack spacing={2}>
              {contactInfo.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      color: theme.palette.primary.light,
                      mr: 2,
                      mt: "2px",
                    }}
                  >
                    {item.icon}
                  </Box>
                  {item.href ? (
                    <Link
                      href={item.href}
                      underline="hover"
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        transition: "color 0.3s ease",
                        "&:hover": {
                          color: theme.palette.primary.light,
                        },
                      }}
                    >
                      {item.text}
                    </Link>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {item.text}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 6,
            bgcolor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.7)", mb: { xs: 2, sm: 0 } }}
          >
            &copy; {new Date().getFullYear()} GURU.Ik -{" "}
            {translate("footer.copyrightText", language)}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            {translate("footer.developedBy", language)}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
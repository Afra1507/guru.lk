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
} from "@mui/material";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";

import { translate, initLanguage } from "../../utils/language";

const Footer = () => {
  const theme = useTheme();
  const [language] = useState(initLanguage());

  const socialIcons = [
    { icon: FaFacebook, label: "Facebook", href: "#" },
    { icon: FaTwitter, label: "Twitter", href: "#" },
    { icon: FaInstagram, label: "Instagram", href: "#" },
    { icon: FaYoutube, label: "YouTube", href: "#" },
    { icon: FaGithub, label: "Github", href: "#" },
  ];

  const quickLinks = [
    {
      label: translate("home", language),
      href: "/",
      icon: <HomeOutlinedIcon fontSize="small" sx={{ mr: 0.7 }} />,
    },
    {
      label: translate("lessons", language),
      href: "/lessons",
      icon: <MenuBookOutlinedIcon fontSize="small" sx={{ mr: 0.7 }} />,
    },
    {
      label: translate("forum", language), // fixed key from qnaForum to forum (your translations use forum)
      href: "/qna",
      icon: <ForumOutlinedIcon fontSize="small" sx={{ mr: 0.7 }} />,
    },
    {
      label: "+94 112 803 803",
      href: "tel:+94112803803",
      icon: <PhoneIcon fontSize="small" sx={{ mr: 0.7 }} />,
    },
    {
      label: "info@guru.lk",
      href: "mailto:info@guru.lk",
      icon: <EmailIcon fontSize="small" sx={{ mr: 0.7 }} />,
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#031227ff",
        color: "#e0e6f2",
        pt: 8,
        pb: 4,
        px: { xs: 3, sm: 6, md: 10 },
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        userSelect: "none",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* About */}
          <Grid item xs={12} md={5}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="700"
              sx={{ letterSpacing: 1, color: "#fff" }}
            >
              {translate("footer.aboutTitle", language)}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#cbd5f7", lineHeight: 1.6, mb: 3 }}
            >
              {translate("footer.aboutDescription", language)}
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialIcons.map(({ icon: Icon, label, href }) => (
                <IconButton
                  key={label}
                  href={href}
                  aria-label={label}
                  sx={{
                    color: "#a3bffa",
                    bgcolor: "rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#0b2240",
                      bgcolor: "#a3bffa",
                      transform: "scale(1.1)",
                    },
                  }}
                  size="large"
                >
                  <Icon />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="700"
              sx={{ letterSpacing: 1, color: "#fff" }}
            >
              {translate("footer.quickLinksTitle", language)}
            </Typography>
            <Stack
              component="ul"
              spacing={1}
              sx={{ listStyle: "none", p: 0, m: 0 }}
            >
              {quickLinks.map(({ label, href, icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    underline="hover"
                    sx={{
                      color: "#9bb0f7",
                      fontWeight: 500,
                      transition: "color 0.25s ease",
                      display: "flex",
                      alignItems: "center",
                      "&:hover": { color: "#fff" },
                      cursor: "pointer",
                    }}
                  >
                    {icon}
                    {label}
                  </Link>
                </li>
              ))}
            </Stack>
          </Grid>

          {/* Contact Us */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="700"
              sx={{ letterSpacing: 1, color: "#fff" }}
            >
              {translate("footer.contactUsTitle", language)}
            </Typography>
            <Box
              component="address"
              sx={{
                fontStyle: "normal",
                color: "#cbd5f7",
                lineHeight: 1.7,
                fontWeight: 500,
              }}
            >
              <Typography>
                <strong>{translate("footer.universityName", language)}</strong>
              </Typography>
              <Typography>{translate("footer.faculty", language)}</Typography>
              <Typography>
                {translate("footer.department", language)}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>{translate("footer.phoneLabel", language)}:</strong> +94
                112 803 803
              </Typography>
              <Typography>
                <strong>{translate("footer.emailLabel", language)}:</strong>{" "}
                <Link
                  href="mailto:info@guru.lk"
                  sx={{
                    color: "#9bb0f7",
                    textDecoration: "underline",
                    "&:hover": { color: "#fff" },
                  }}
                >
                  info@guru.lk
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{ bgcolor: "#1a3a70", my: 4, borderWidth: 1 }}
          variant="fullWidth"
        />

        <Box textAlign="center" color="#819cff" userSelect="none">
          <Typography variant="body2" fontWeight={500}>
            &copy; {new Date().getFullYear()} GURU.Ik -{" "}
            {translate("footer.copyrightText", language)}
          </Typography>
          <Typography variant="caption" display="block" mt={0.5}>
            {translate("footer.developedBy", language)}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

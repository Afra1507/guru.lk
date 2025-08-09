import React from "react";
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

const Footer = () => {
  const theme = useTheme();

  const socialIcons = [
    { icon: FaFacebook, label: "Facebook", href: "#" },
    { icon: FaTwitter, label: "Twitter", href: "#" },
    { icon: FaInstagram, label: "Instagram", href: "#" },
    { icon: FaYoutube, label: "YouTube", href: "#" },
    { icon: FaGithub, label: "Github", href: "#" },
  ];

  // Quick Links with icons for all
  const quickLinks = [
    {
      label: "Home",
      href: "/",
      icon: <HomeOutlinedIcon fontSize="small" sx={{ mr: 0.7 }} />,
    },
    {
      label: "Lessons",
      href: "/lessons",
      icon: <MenuBookOutlinedIcon fontSize="small" sx={{ mr: 0.7 }} />,
    },
    {
      label: "Q&A Forum",
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
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="700"
              sx={{ letterSpacing: 1, color: "#fff" }}
            >
              About GURU.Ik
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#cbd5f7", lineHeight: 1.6, mb: 3 }}
            >
              A community knowledge sharing platform for inclusive education in
              Sri Lanka. Bridging the gap between learners and educators across
              the country.
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
          <Grid item xs={6} md={2}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="700"
              sx={{ letterSpacing: 1, color: "#fff" }}
            >
              Quick Links
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

          {/* Content Categories */}
          <Grid item xs={6} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="700"
              sx={{ letterSpacing: 1, color: "#fff" }}
            >
              Content Categories
            </Typography>
            <Stack
              component="ul"
              spacing={1}
              sx={{ listStyle: "none", p: 0, m: 0 }}
            >
              {[
                "Mathematics",
                "Science",
                "Languages",
                "History",
                "Technology",
              ].map((category) => (
                <li key={category}>
                  <Link
                    href="#"
                    underline="hover"
                    sx={{
                      color: "#9bb0f7",
                      fontWeight: 500,
                      transition: "color 0.25s ease",
                      "&:hover": { color: "#fff" },
                      cursor: "pointer",
                    }}
                  >
                    {category}
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
              Contact Us
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
                <strong>University of Sri Jayewardenepura</strong>
              </Typography>
              <Typography>Faculty of Applied Sciences</Typography>
              <Typography>Department of Computer Science</Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>P:</strong> +94 112 803 803
              </Typography>
              <Typography>
                <strong>E:</strong>{" "}
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
            &copy; {new Date().getFullYear()} GURU.Ik - All Rights Reserved
          </Typography>
          <Typography variant="caption" display="block" mt={0.5}>
            Developed by AS2022468
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

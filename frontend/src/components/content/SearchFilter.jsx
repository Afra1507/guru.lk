import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LanguageIcon from "@mui/icons-material/Language";
import SubjectIcon from "@mui/icons-material/LibraryBooks";
import GroupIcon from "@mui/icons-material/Groups";

const SearchFilter = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("all");
  const [subject, setSubject] = useState("all");
  const [ageGroup, setAgeGroup] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({
      searchTerm: searchTerm.trim(),
      language,
      subject,
      ageGroup,
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setLanguage("all");
    setSubject("all");
    setAgeGroup("all");
    onFilter({
      searchTerm: "",
      language: "all",
      subject: "all",
      ageGroup: "all",
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: 1000,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: 3,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Search Term */}
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: "#64b5f6" }}>
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 8,
                backgroundColor: "#f5f7fa",
                fontWeight: 600,
                color: "#1e293b",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d1d5db",
                  transition: "border-color 0.3s ease",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2563eb",
                  borderWidth: 2,
                },
              },
            }}
          />
        </Grid>

        {/* Language Select */}
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <InputLabel
              id="language-label"
              sx={{ color: "#2563eb", fontWeight: 600 }}
            >
              Language
            </InputLabel>
            <Select
              labelId="language-label"
              value={language}
              label="Language"
              onChange={(e) => setLanguage(e.target.value)}
              startAdornment={
                <InputAdornment position="start" sx={{ color: "#2563eb" }}>
                  <LanguageIcon />
                </InputAdornment>
              }
              sx={{
                borderRadius: 8,
                backgroundColor: "#f5f7fa",
                fontWeight: 600,
                color: "#1e293b",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d1d5db",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2563eb",
                  borderWidth: 2,
                },
              }}
            >
              <MenuItem value="all">All Languages</MenuItem>
              <MenuItem value="sinhala">Sinhala</MenuItem>
              <MenuItem value="tamil">Tamil</MenuItem>
              <MenuItem value="english">English</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Subject Input */}
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Subject"
            value={subject === "all" ? "" : subject}
            onChange={(e) =>
              setSubject(e.target.value.trim() === "" ? "all" : e.target.value)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: "#2563eb" }}>
                  <SubjectIcon />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 8,
                backgroundColor: "#f5f7fa",
                fontWeight: 600,
                color: "#1e293b",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d1d5db",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2563eb",
                  borderWidth: 2,
                },
              },
            }}
          />
        </Grid>

        {/* Age Group Select */}
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <InputLabel
              id="agegroup-label"
              sx={{ color: "#2563eb", fontWeight: 600 }}
            >
              Age Group
            </InputLabel>
            <Select
              labelId="agegroup-label"
              value={ageGroup}
              label="Age Group"
              onChange={(e) => setAgeGroup(e.target.value)}
              startAdornment={
                <InputAdornment position="start" sx={{ color: "#2563eb" }}>
                  <GroupIcon />
                </InputAdornment>
              }
              sx={{
                borderRadius: 8,
                backgroundColor: "#f5f7fa",
                fontWeight: 600,
                color: "#1e293b",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d1d5db",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2563eb",
                  borderWidth: 2,
                },
              }}
            >
              <MenuItem value="all">All Ages</MenuItem>
              <MenuItem value="primary">
                Primary
              </MenuItem>
              <MenuItem value="junior_secondary">
                Secondary
              </MenuItem>
              <MenuItem value="senior_secondary">
                GCE O-Level
              </MenuItem>
              <MenuItem value="collegiate">
                GCE A-Level
              </MenuItem>
              <MenuItem value="postgrad">Grad & Postgrad</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Buttons */}
        <Grid item xs={6} md={1.5} sx={{ display: "flex", gap: 1 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 8,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "0 4px 15px rgba(37, 99, 235, 0.4)",
              background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
              transition: "all 0.3s ease",
              flex: 1,
              "&:hover": {
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                boxShadow: "0 6px 20px rgba(37, 99, 235, 0.6)",
                transform: "scale(1.05)",
              },
            }}
            startIcon={<SearchIcon />}
          >
            Filter
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={handleReset}
            sx={{
              borderRadius: 8,
              textTransform: "none",
              fontWeight: 700,
              borderColor: "#2563eb",
              color: "#2563eb",
              flex: 1,
              "&:hover": {
                backgroundColor: "rgba(37, 99, 235, 0.1)",
                borderColor: "#3b82f6",
                color: "#3b82f6",
                transform: "scale(1.05)",
              },
            }}
            startIcon={<RestartAltIcon />}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchFilter;

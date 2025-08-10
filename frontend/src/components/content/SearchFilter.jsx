// src/components/content/SearchFilter.jsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

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
        p: 2,
        bgcolor: "#f5f7fa",
        borderRadius: 2,
        boxShadow: 1,
        fontFamily: "'Roboto', sans-serif",
        maxWidth: 900,
        margin: "auto",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Search Text */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <Tooltip title="Search">
                  <IconButton type="submit" edge="end" color="primary">
                    <SearchIcon />
                  </IconButton>
                </Tooltip>
              ),
            }}
          />
        </Grid>

        {/* Language Select */}
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <InputLabel id="language-label">Language</InputLabel>
            <Select
              labelId="language-label"
              value={language}
              label="Language"
              onChange={(e) => setLanguage(e.target.value)}
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
            label="Subject"
            value={subject === "all" ? "" : subject}
            onChange={(e) =>
              setSubject(e.target.value.trim() === "" ? "all" : e.target.value)
            }
          />
        </Grid>

        {/* Age Group Select */}
        <Grid item xs={6} md={3}>
          <FormControl fullWidth>
            <InputLabel id="agegroup-label">Age Group</InputLabel>
            <Select
              labelId="agegroup-label"
              value={ageGroup}
              label="Age Group"
              onChange={(e) => setAgeGroup(e.target.value)}
            >
              <MenuItem value="all">All Ages</MenuItem>
              <MenuItem value="5-10">5-10</MenuItem>
              <MenuItem value="11-14">11-14</MenuItem>
              <MenuItem value="15-17">15-17</MenuItem>
              <MenuItem value="18+">18+</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Buttons */}
        <Grid item xs={6} md={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ fontWeight: "600" }}
            startIcon={<SearchIcon />}
          >
            Filter
          </Button>
        </Grid>

        <Grid item xs={6} md={3}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ fontWeight: "600" }}
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
          >
            Reset Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchFilter;

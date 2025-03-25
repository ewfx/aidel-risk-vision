import React from "react";
import Button from "@mui/material/Button";
import FileUpload from "../FileUpload";
import { Grid, Box } from "@mui/material";
import RiskAnalysisDashboard from "../Dashboard/RiskAnalysisDashboard";
import { Typography } from "@mui/material";

const Home = () => {
    return (
        <div>
            <Grid container direction="row" style={{ height: "100vh" }}>
                <Grid item xs={12} style={{ padding: "16px" }}>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{
                            fontWeight: 600,
                            color: "#008B8B", // Dark Teal for a sophisticated look
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            fontFamily: "'Inter', sans-serif",
                            textShadow: "0px 2px 4px rgba(0, 139, 139, 0.3)" // Subtle shadow in dark teal
                        }}
                    >
                        Risk Vision AI
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FileUpload />
                </Grid>
                <Grid item xs={12} style={{ height: "50%" }}>
                    <RiskAnalysisDashboard />
                </Grid>
            </Grid>
        </div>
    )
};

export default Home;

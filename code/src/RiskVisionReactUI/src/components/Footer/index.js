import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                position: "fixed",
                bottom: 0,
                width: "100%",
                backgroundColor: "#00897B",
                color: "white",
                textAlign: "center",
                py: 2,
            }}
        >
            <Typography variant="body2">
                © {new Date().getFullYear()} Wells Fargo. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;

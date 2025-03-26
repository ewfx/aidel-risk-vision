import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Header = () => {
    return (
        <AppBar position="static" sx={{ bgcolor: "#00897B" }}>
            <Toolbar>
                <Typography variant="h6" align="center" component="div" sx={{ flexGrow: 1, color: "#F8FAFC", fontWeight: "bold",
                     letterSpacing: "0.5px",justifyContent:'center' }}>
                    RISK VISION AI
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
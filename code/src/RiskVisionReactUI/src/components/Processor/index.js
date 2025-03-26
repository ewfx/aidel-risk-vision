import React from "react";
import { Stepper, Step, StepLabel, Typography, Box, Card, CardContent, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material/styles";

const steps = [
    "Upload File",
    "Extract Data",
    "Preprocess Data",
    "Validate Data",
    "Train Model",
    "Evaluate Model",
    "Generate Report",
    "Complete"
];

const CustomStepIcon = styled(CheckCircleIcon)({
    color: "#16a34a" // Teal green color for completed icon
});

export default function StepperComponent() {
    return (
        <Box sx={{ pb: 10 }}>
            <Card sx={{ width: "80%", margin: "auto", mt: 5, p: 4, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Transaction Process Steps
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Stepper activeStep={steps.length} alternativeLabel sx={{ mb: 3 }}>
                        {steps.map((label, index) => (
                            <Step key={index} completed>
                                <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <Box textAlign="center" sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                        <Typography variant="body1" color="textSecondary">
                            The entire processing workflow has been completed successfully.
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

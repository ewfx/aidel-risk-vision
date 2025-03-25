import { CardContent, Typography, Box, Stack, Chip } from "@mui/material";

export default function RiskMetrics({ transactions }) {
    const highRiskCount = transactions.filter((t) => t.risk === "High").length;

    return (
       <>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Key Risk Metrics
            </Typography>

            <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1">Total Transactions:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                        {transactions.length}
                    </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1">High Risk:</Typography>
                    <Chip
                        label={highRiskCount}
                        color={highRiskCount > 0 ? "error" : "default"}
                        variant="outlined"
                        sx={{ fontWeight: "bold" }}
                    />
                </Box>
            </Stack>
        </>
    );
}

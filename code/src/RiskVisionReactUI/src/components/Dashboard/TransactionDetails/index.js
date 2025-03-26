import React, { useState } from "react";
import {
    Grid, Typography, Paper, Chip, Box, Divider, Button, Modal, Backdrop, Fade
} from "@mui/material";

const MAX_LENGTH = 70;

const TransactionDetails = ({ transaction }) => {
    const [open, setOpen] = useState(false);

    if (!transaction) return null;

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const isTruncated = transaction.Reason.length > MAX_LENGTH;
    const truncatedText = isTruncated ? transaction.Reason.substring(0, MAX_LENGTH) + "..." : transaction.Reason;

    return (
        <Box>
            <Grid container spacing={2}>
                {/* Extracted Entities */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold">Extracted Entities:</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {transaction["Extracted Entity"].map((entity, index) => (
                            <Chip key={index} label={entity} color="primary" variant="outlined" />
                        ))}
                    </Box>
                </Grid>

                {/* Entity Type */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold">Entity Type:</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {transaction["Entity Type"].map((type, index) => (
                            <Chip key={index} label={type} color="secondary" variant="outlined" />
                        ))}
                    </Box>
                </Grid>

                {/* Supporting Evidence */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold">Supporting Evidence:</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {transaction["Supporting Evidence"].map((evidence, index) => (
                            <Chip key={index} label={evidence} color="success" variant="outlined" />
                        ))}
                    </Box>
                </Grid>

                {/* Reason */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold">Reason:</Typography>
                    <Typography>
                        {truncatedText}
                        {isTruncated && (
                            <Button onClick={handleOpen} variant="outlined" size="small" sx={{ ml: 1 }}>
                                View More
                            </Button>
                        )}
                    </Typography>
                </Grid>

                {/* Steps */}
                {/* <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold">Steps:</Typography>
                    <Box>
                        {transaction.steps.map((step, index) => {
                            if (typeof step === "string") {
                                return (
                                    <Typography key={index} sx={{ mb: 1 }}>• {step}</Typography>
                                );
                            }

                            if (typeof step === "object" && step !== null) {
                                return Object.entries(step).map(([entity, data]) => (
                                    <Box key={entity + index} sx={{ mb: 2, ml: 2 }}>
                                        <Typography fontWeight="bold" sx={{ mb: 1 }}>{entity}</Typography>
                                        {Object.entries(data).map(([label, value]) => (
                                            <Typography key={label} sx={{ ml: 2, mb: 0.5 }}>
                                                - <strong>{label}</strong>: {value}
                                            </Typography>
                                        ))}
                                    </Box>
                                ));
                            }

                            return null;
                        })}
                    </Box>
                </Grid> */}
            </Grid>

            {/* Modal */}
            <Modal open={open} onClose={handleClose} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
                <Fade in={open}>
                    <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", p: 3, maxWidth: 500 }}>
                        <Typography variant="h6" fontWeight="bold">Complete Reason Details</Typography>
                        <Typography>{transaction.Reason}</Typography>
                        <Box sx={{ textAlign: "right", mt: 2 }}>
                            <Button onClick={handleClose} variant="outlined" size="small">Close</Button>
                        </Box>
                    </Paper>
                </Fade>
            </Modal>
        </Box>
    );
};

export default TransactionDetails;

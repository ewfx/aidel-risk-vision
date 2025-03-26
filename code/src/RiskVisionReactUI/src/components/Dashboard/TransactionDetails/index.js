import React, { useState } from "react";
import { Grid, Typography, Paper, Chip, Box, Divider, Button, Modal, Backdrop, Fade } from "@mui/material";

const transaction = {
    "Transaction ID": "TXN-2023-5A9B",
    "Extracted Entity": ["Oceanic Holdings LLC", "Bright Future Nonprofit Inc", "Ali Al-Mansoori"],
    "Entity Type": ["Shell Company", "NGO", "PEP"],
    "Supporting Evidence": ["Panama Papers Database", "Sanctions List"],
    "Reason": "Transaction involves payment from Swiss-based Global Horizons to Cayman Islands nonprofit, approved by PEP-linked Ali Al-Mansoori"
};

const MAX_LENGTH = 70; // Max character limit before truncating

const TransactionDetails = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const isTruncated = transaction.Reason.length > MAX_LENGTH;
    const truncatedText = isTruncated ? transaction.Reason.substring(0, MAX_LENGTH) + "..." : transaction.Reason;

    return (
        <div>
           
            <Grid container spacing={2}>
                {/* Divider before Transaction ID & Extracted Entity */}
                <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Transaction ID */}
                <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Transaction ID:
                    </Typography>
                    <Typography>{transaction["Transaction ID"]}</Typography>
                </Grid>

                {/* Extracted Entities */}
                <Grid item xs={12} md={8}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Extracted Entities:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {transaction["Extracted Entity"].map((entity, index) => (
                            <Chip key={index} label={entity} color="primary" variant="outlined" />
                        ))}
                    </Box>
                </Grid>

                {/* Divider before Entity Type & Supporting Evidence */}
                <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Entity Types */}
                <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Entity Type:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {transaction["Entity Type"].map((type, index) => (
                            <Chip key={index} label={type} color="secondary" variant="outlined" />
                        ))}
                    </Box>
                </Grid>

                {/* Supporting Evidence */}
                <Grid item xs={12} md={8}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Supporting Evidence:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {transaction["Supporting Evidence"].map((evidence, index) => (
                            <Chip key={index} label={evidence} color="success" variant="outlined" />
                        ))}
                    </Box>
                </Grid>

                {/* Divider before Reason */}
                <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Reason */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Reason:
                    </Typography>
                    <Typography>
                        {truncatedText}{" "}
                        {isTruncated && (
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={handleOpen}
                                sx={{ color: "#008080", borderColor: "#008080", "&:hover": { backgroundColor: "#008080", color: "#fff" } }}
                            >
                                View More
                            </Button>
                        )}
                    </Typography>
                </Grid>
            </Grid>

            {/* Modal for displaying full reason */}
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={open}>
                    <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", p: 3, maxWidth: 500 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Complete Reason Details
                        </Typography>
                        <Typography>{transaction.Reason}</Typography>
                        <Box sx={{ textAlign: "right", mt: 2 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={handleClose}
                                sx={{ color: "#008080", borderColor: "#008080", "&:hover": { backgroundColor: "#008080", color: "#fff" } }}
                            >
                                Close
                            </Button>
                        </Box>
                    </Paper>
                </Fade>
            </Modal>
        </div>
    );
};

export default TransactionDetails;

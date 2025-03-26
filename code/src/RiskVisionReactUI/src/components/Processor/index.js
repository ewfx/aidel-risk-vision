import React, { useState, useRef, useEffect } from "react";
import {
    Stepper,
    Step,
    StepLabel,
    Typography,
    Box,
    Card,
    CardContent,
    Divider,
    Tooltip,
    IconButton,
    Collapse,
    CircularProgress,
    Button
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { styled } from "@mui/material/styles";

const AnimatedBox = styled(Box)(({ theme }) => ({
    transition: 'all 0.3s ease-in-out',
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    marginLeft: theme.spacing(4),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    boxShadow: theme.shadows[2],
}));

const statusIcons = [CheckCircleIcon, HourglassEmptyIcon, CancelIcon];
const statusColors = ["#16a34a", "#facc15", "#ef4444"];
const statusLabels = ["Completed", "In Progress", "Failed"];

export default function StepperComponent({ steps = [] }) {
    const [expandedSteps, setExpandedSteps] = useState([]);
    const [loadingStep, setLoadingStep] = useState(null);
    const [retryingStep, setRetryingStep] = useState(null);
    const [timestamps, setTimestamps] = useState(() => steps.map(() => Date.now() - Math.floor(Math.random() * 1000)));
    const stepRefs = useRef([]);

    const handleToggle = (index) => {
        if (expandedSteps.includes(index)) {
            setExpandedSteps(prev => prev.filter(i => i !== index));
        } else {
            setLoadingStep(index);
            setTimeout(() => {
                setExpandedSteps(prev => [...prev, index]);
                setLoadingStep(null);
            }, 500);
        }
    };

    const handleRetry = (index) => {
        setRetryingStep(index);
        setTimeout(() => {
            setTimestamps(prev => {
                const newTimestamps = [...prev];
                newTimestamps[index] = Date.now();
                return newTimestamps;
            });
            setRetryingStep(null);
        }, 1500);
    };

    useEffect(() => {
        if (loadingStep !== null && stepRefs.current[loadingStep]) {
            stepRefs.current[loadingStep].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [loadingStep]);

    const handleCollapseAll = () => {
        setExpandedSteps([]);
    };

    const handleExpandAll = () => {
        const objectIndexes = steps.map((s, i) => (typeof s === 'object' ? i : null)).filter(i => i !== null);
        setExpandedSteps(objectIndexes);
    };

    return (
        <Box sx={{ pb: 10 }}>
            <Card sx={{ width: "80%", margin: "auto", mt: 5, p: 4, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5" fontWeight="bold">
                            Transaction Process Steps
                        </Typography>
                        <Box>
                            <Button variant="outlined" onClick={() => {
                                if (expandedSteps.length === steps.filter(s => typeof s === 'object').length) {
                                    handleCollapseAll();
                                } else {
                                    handleExpandAll();
                                }
                            }} size="small">
                                {expandedSteps.length === steps.filter(s => typeof s === 'object').length ? 'Collapse All' : 'Expand All'}
                            </Button>
                        </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', overflowX: 'auto', gap: 2, pb: 3 }}>
                        {steps.map((step, index) => {
                            const isObjectStep = typeof step === 'object';
                            const label = isObjectStep ? Object.keys(step).join(", ") : step;
                            const isExpanded = expandedSteps.includes(index);

                            const now = Date.now();
                            let durationSec = Math.floor((now - timestamps[index]) / 1000);
                            durationSec = 8;
                            const duration = `${durationSec}s`;

                            let statusIndex = retryingStep === index ? 1 : index === steps.length - 1 ? 1 : index < steps.length - 1 ? 0 : 2;
                            statusIndex = 0;
                            const StatusIcon = statusIcons[statusIndex];
                            const statusColor = statusColors[statusIndex];
                            const statusText = statusLabels[statusIndex];

                            return (
                                <Step key={index} completed={statusIndex === 0} active={statusIndex === 1}>
                                    <StepLabel
                                        StepIconComponent={() => <StatusIcon style={{ color: statusColor }} />}
                                        optional={
                                            <Box display="flex" alignItems="center">
                                                <Tooltip title={statusText}><Typography variant="caption" sx={{ mr: 1 }}>{duration}</Typography></Tooltip>
                                                {statusIndex === 2 && (
                                                    <Tooltip title="Retry Step">
                                                        <IconButton onClick={() => handleRetry(index)} size="small" color="error" sx={{ mr: 1 }} disabled={retryingStep === index}>
                                                            {retryingStep === index ? <CircularProgress size={18} /> : <ReplayIcon fontSize="small" />}
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {isObjectStep && (
                                                    <Tooltip title="View Details">
                                                        <IconButton size="small" onClick={() => handleToggle(index)}>
                                                            {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        }
                                    >
                                        <Box ref={el => stepRefs.current[index] = el}>{label}</Box>
                                    </StepLabel>

                                    {isObjectStep && (
                                        <Collapse in={isExpanded} timeout={300} unmountOnExit>
                                            <AnimatedBox sx={{ borderColor: isExpanded ? statusColor : 'divider' }}>
                                                {loadingStep === index ? (
                                                    <Box textAlign="center"><CircularProgress size={24} /></Box>
                                                ) : (
                                                    Object.entries(step).map(([entity, details]) => (
                                                        <Box key={entity} sx={{ mb: 1 }}>
                                                            <Typography fontWeight="bold">{entity}</Typography>
                                                            {Object.entries(details).map(([k, v]) => (
                                                                <Typography key={k} variant="body2" sx={{ ml: 2 }}>
                                                                    - <strong>{k}</strong>: {v}
                                                                </Typography>
                                                            ))}
                                                        </Box>
                                                    ))
                                                )}
                                            </AnimatedBox>
                                        </Collapse>
                                    )}
                                </Step>
                            );
                        })}
                    </Box>

                    <Box textAlign="center" sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                        <Typography variant="body1" color="textSecondary">
                            The entire processing workflow has been completed successfully.
                        </Typography>
                    </Box>
                {expandedSteps.length > 0 && (
                        <Box mt={4}>
                            <Typography variant="h6" gutterBottom>Step Details</Typography>
                            {expandedSteps.map(index => (
                                <AnimatedBox key={index} sx={{ borderColor: statusColors[0] }}>
                                    {Object.entries(steps[index]).map(([entity, details]) => (
                                        <Box key={entity} sx={{ mb: 1 }}>
                                            <Typography fontWeight="bold">{entity}</Typography>
                                            {Object.entries(details).map(([k, v]) => (
                                                <Typography key={k} variant="body2" sx={{ ml: 2 }}>
                                                    - <strong>{k}</strong>: {v}
                                                </Typography>
                                            ))}
                                        </Box>
                                    ))}
                                </AnimatedBox>
                            ))}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

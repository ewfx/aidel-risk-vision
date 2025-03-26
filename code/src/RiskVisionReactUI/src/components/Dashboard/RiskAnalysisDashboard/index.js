import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid, Box } from "@mui/material";
import RiskMeterChart from "../RiskMeter";
import LinearRiskMeterChart from '../LinearRiskMeterChart'
import TransactionDetails from "../TransactionDetails";


const transaction = {
    "Transaction ID": "TXN-2023-5A9B",
    "Extracted Entity": ["Oceanic Holdings LLC", "Bright Future Nonprofit Inc", "Ali Al-Mansoori"],
    "Entity Type": ["Shell Company", "NGO", "PEP"],
    "Supporting Evidence": ["Panama Papers Database", "Sanctions List"],
    "Reason": "Transaction involves payment from Swiss-based Global Horizons to Cayman Islands nonprofit, approved by PEP-linked Ali Al-Mansoori"
};

const RiskAnalysisDashboard = () => {
    return (
        <>
        <div>
                <Grid container direction="row" spacing={2} className="p-4">

                    <Grid item xs={3} >
                        <Card style={{ marginLeft: '5px', height: '30rem' }}>
                            <CardContent>
                                <h2 className="text-xl font-semibold">Risk Score</h2>
                                <RiskMeterChart riskScore={78} />
                            </CardContent>
                        </Card>
                    </Grid>


                    <Grid item xs={4}>
                        <Card style={{ marginLeft: '5px', height: '30rem' }} >
                            <CardContent>
                                <h2 className="text-xl font-semibold">Risk Confidence</h2>
                                <LinearRiskMeterChart confidenceScore={60} />
                            </CardContent>
                        </Card>
                    </Grid>


                    <Grid item xs={5}>
                    <Card style={{ marginLeft: '5px', height: '30rem' }} >
                        <CardContent>
                        <h2 className="text-xl font-semibold">Risk Transaction</h2>
                                <TransactionDetails/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
      
        </>
    );
};

export default RiskAnalysisDashboard;

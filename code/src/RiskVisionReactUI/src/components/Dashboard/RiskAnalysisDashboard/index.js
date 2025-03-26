import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid, Typography } from "@mui/material";
import RiskMeterChart from "../RiskMeter";
import LinearRiskMeterChart from '../LinearRiskMeterChart';
import TransactionDetails from "../TransactionDetails";
import Processor from "../../Processor";

const transaction = {
    "Transaction ID": "TXN-2023-5A9B",
    "Extracted Entity": ["Oceanic Holdings LLC", "Bright Future Nonprofit Inc", "Ali Al-Mansoori"],
    "Entity Type": ["Shell Company", "NGO", "PEP"],
    "Supporting Evidence": ["Panama Papers Database", "Sanctions List"],
    "Reason": "Transaction involves payment from Swiss-based Global Horizons to Cayman Islands nonprofit, approved by PEP-linked Ali Al-Mansoori"
};

const cardStyle = {
    marginLeft: '5px',
    height: '30rem',
    border: '1px solid gray',
    boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px'
};

const RiskAnalysisDashboard = ({transactionDataResponse}) => {
    // const [transactionData, setTransactionData] = useState(null);

    // useEffect(() => {
    //     fetch("/Mock-Response.json")
    //         .then(res => res.json())
    //         .then(setTransactionData)
    //         .catch(console.error);
    // }, []);

    const isEmpty = !transactionDataResponse || Object.keys(transactionDataResponse).length === 0;

    if (isEmpty) {
      return <Typography>Your result appears here once you have uploaded transaction data.</Typography>;
    }
    return (
        <div>
            <Grid container direction="row" spacing={2} className="p-4">
                <Grid item xs={3}>
                    <Card style={cardStyle}>
                        <CardContent>
                            <h2 className="text-xl font-semibold">Risk Score</h2>
                            <RiskMeterChart riskScore={transactionDataResponse["Risk Score"] * 100} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={4}>
                    <Card style={cardStyle}>
                        <CardContent>
                            <h2 className="text-xl font-semibold">Risk Confidence</h2>
                            <LinearRiskMeterChart confidenceScore={transactionDataResponse["Confidence Score"] * 100} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={5}>
                    <Card style={cardStyle}>
                        <CardContent sx={{ overflowY: 'auto', maxHeight: '28rem' }}>
                            <h2 className="text-xl font-semibold">
                                Risk Transaction
                                <Typography component="span" variant="subtitle2" sx={{ ml: 1, color: 'gray' }}>
                                    ({transactionDataResponse["Transaction ID"]})
                                </Typography>
                            </h2>
                            <TransactionDetails transaction={transactionDataResponse} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Processor steps={transactionDataResponse.steps} />
        </div>
    );
};

export default RiskAnalysisDashboard;
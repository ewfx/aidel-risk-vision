import React from "react";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Grid, Box } from "@mui/material";
import RiskMetrics from "../RiskMetrics";
import FraudDetectionTable from "../FraudDetectionTable";

const transactions = [
    { id: 1, date: "2025-03-25", amount: 5000, sender: "User A", receiver: "User B", risk: "High" },
    { id: 2, date: "2025-03-24", amount: 200, sender: "User C", receiver: "User D", risk: "Low" },
];

const riskData = [
    { name: "Mar 20", risk: 20 },
    { name: "Mar 21", risk: 30 },
    { name: "Mar 22", risk: 45 },
];

const chartOptions = {
    chart: {
        type: "line",
    },
    title: {
        text: "Risk Trends",
    },
    xAxis: {
        categories: riskData.map((data) => data.name),
    },
    yAxis: {
        title: {
            text: "Risk Level",
        },
    },
    series: [
        {
            name: "Risk",
            data: riskData.map((data) => data.risk),
            color: "#ff7300",
        },
    ],
};

const RiskAnalysisDashboard = () => {
    return (
        <>
        <Grid container direction="row" spacing={2} className="p-4">
            {/* Risk Metrics */}
            <Grid item xs={3} >
                <Card style={{marginLeft:'5px', height:'30rem'}}>
                    <CardContent>
                        <h2 className="text-xl font-semibold">Risk Metrics</h2>
                        <RiskMetrics transactions={transactions} />
                     </CardContent>
                </Card>
            </Grid>

            {/* Risk Trend Chart */}
            <Grid item xs={4}>
                <Card style={{ marginLeft: '5px', height: '30rem' }} >
                    <CardContent>
                        <h2 className="text-xl font-semibold">Risk Trends</h2>
                        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                    </CardContent>
                </Card>
            </Grid>

                <Grid item xs={5}>
                    <Card style={{ marginLeft: '5px', height: '30rem' }} >
                        <CardContent>
                        <h2 className="text-xl font-semibold">Risk Transaction</h2>
                      
                        <FraudDetectionTable />
                        </CardContent>
                    </Card>
                </Grid>
        </Grid>
        </>
    );
};

export default RiskAnalysisDashboard;

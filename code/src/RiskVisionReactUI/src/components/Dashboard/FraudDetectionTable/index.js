import React, { useState } from "react";
import { Card, CardContent } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

const dummyData = [
    {
        id: "TXN12345",
        amount: "$5000",
        status: "Fraudulent",
        riskScore: 85,
        reason: "Unusual transaction amount",
        action: "Block",
    },
    {
        id: "TXN67890",
        amount: "$150",
        status: "Legitimate",
        riskScore: 20,
        reason: "Normal transaction",
        action: "Proceed",
    },
    {
        id: "TXN54321",
        amount: "$2500",
        status: "Suspicious",
        riskScore: 65,
        reason: "Unusual location",
        action: "Review",
    },
];

const FraudDetectionTable = () => {
    const [transactions, setTransactions] = useState(dummyData);

    const reportFalsePositive = (id) => {
        alert(`Transaction ${id} reported as false positive.`);
    };

    return (
       
            
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Transaction ID</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Risk Score</TableCell>
                                <TableCell>Reason</TableCell>
                                <TableCell>Action</TableCell>
                                <TableCell>Report</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((txn) => (
                                <TableRow key={txn.id}>
                                    <TableCell>{txn.id}</TableCell>
                                    <TableCell>{txn.amount}</TableCell>
                                    <TableCell style={{ color: txn.status === "Fraudulent" ? "red" : txn.status === "Suspicious" ? "orange" : "green" }}>
                                        {txn.status}
                                    </TableCell>
                                    <TableCell>{txn.riskScore}</TableCell>
                                    <TableCell>{txn.reason}</TableCell>
                                    <TableCell>
                                        <Button variant={txn.action === "Block" ? "contained" : "outlined"} color={txn.action === "Block" ? "error" : "primary"}>
                                            {txn.action}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        {txn.status === "Fraudulent" && (
                                            <Button variant="outlined" color="secondary" onClick={() => reportFalsePositive(txn.id)}>
                                                Report False Positive
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
         
    );
};

export default FraudDetectionTable;
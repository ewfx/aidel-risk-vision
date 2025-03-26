import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './RiskTransactionCard.css'; // Custom styles for your card

const RiskTransactionCard = ({ transaction }) => {
    if (!transaction) {
        return <div>No transaction data available</div>;
    }

    const {
        "Transaction ID": transactionId,
        "Extracted Entity": entities,
        "Entity Type": entityTypes,
        "Risk Score": riskScore,
        "Supporting Evidence": evidence,
        "Confidence Score": confidenceScore,
        "Reason": reason,
    } = transaction;

    return (
        <div className="risk-card">
            <h2>{transactionId}</h2>

            <div className="entities">
                {entities.map((entity, index) => (
                    <div key={index} className="entity">
                        <strong>{entity}</strong> - <em>{entityTypes[index]}</em>
                    </div>
                ))}
            </div>

            <div className="scores">
                <div className="score-item">
                    <h4>Confidence</h4>
                    <CircularProgressbar
                        value={confidenceScore * 100}
                        text={`${(confidenceScore * 100).toFixed(0)}%`}
                        styles={buildStyles({ pathColor: 'green', textColor: 'black' })}
                    />
                </div>
            </div>

            <div className="evidence">
                <h4>Supporting Evidence</h4>
                <ul>
                    {evidence.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            <div className="reason">
                <h4>Reason</h4>
                <p>{reason}</p>
            </div>
        </div>
    );
};

export default RiskTransactionCard;

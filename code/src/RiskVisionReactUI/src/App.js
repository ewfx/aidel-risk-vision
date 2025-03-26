import React, { use, useState } from 'react';
import UploadForm from './components/UploadForm';
import Header from './components/Header'
import Footer from './components/Footer';
import RiskAnalysisDashboard from './components/Dashboard/RiskAnalysisDashboard'
import Processor from './components/Processor';
import './App.css';

export default function App() {
  const [transactionDataResponse, setTransactionDataResponse] = useState({});

  const handleTransactionDataUpdate = (txData) => {
    setTransactionDataResponse(txData);
    console.log("In App", txData);
  }
  return (
   <>
      <Header />
      <UploadForm handleTransactionDataUpdate={handleTransactionDataUpdate}/>
      <div style={{marginTop:'15px'}}>
        <RiskAnalysisDashboard transactionDataResponse={transactionDataResponse}/>
      </div>
      <Footer/>
      </>
  );
}
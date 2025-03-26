import React from 'react';
import UploadForm from './components/UploadForm';
import Header from './components/Header'
import Footer from './components/Footer';
import RiskAnalysisDashboard from './components/Dashboard/RiskAnalysisDashboard'
import Processor from './components/Processor';
import './App.css';

export default function App() {
  return (
   <>
      <Header />
      <UploadForm />
      <div style={{marginTop:'15px'}}>
        <RiskAnalysisDashboard />
      </div>
      <Footer/>
      </>
  );
}
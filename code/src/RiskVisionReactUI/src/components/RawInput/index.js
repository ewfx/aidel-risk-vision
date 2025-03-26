import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import './RawInput.css';
import axios from 'axios';

const RawInput = ({handleTransactionDataUpdate}) => {
  const [rawText, setRawText] = useState('');
  const [error, setError] = useState('');

  const handleBeautify = () => {
    try {
      const parsed = JSON.parse(rawText);
      const beautified = JSON.stringify(parsed, null, 2);
      setRawText(beautified);
      setError('');
    } catch (err) {
      setError('Invalid JSON. Please fix the syntax.');
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("textInput", rawText);

    try {
        // setUploading(true);
        // await axios.post("http://127.0.0.1:5000/jsonortext", formData, {
        //     headers: { "Content-Type": "multipart/form-data" },
        // }).then((res) => {
        //   handleTransactionDataUpdate(res);
        //   alert("Processing successful!");
        // });
        
        fetch("/Mock-Response.json")
            .then(res => res.json())
            .then((r) => handleTransactionDataUpdate(r))
            .catch(console.error);
    } catch (error) {
        alert("Error processing input");
        console.error("Processing error:", error);
    } finally {
        setRawText("");
    }
};

  return (
    <div className="input-container">
      <TextField
        className="raw-input"
        placeholder="Paste your raw JSON..."
        multiline
        rows={8}
        fullWidth
        variant="outlined"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        error={!!error}
        helperText={error}
        InputProps={{
          style: { backgroundColor: 'white' }, // Set background color to white
        }}
      />
      <div className="button-container">
        <Button variant="outlined" className="beautify-button" onClick={handleBeautify}>
          Beautify
        </Button>
        <Button variant="contained" className="send-button" onClick={handleUpload}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default RawInput;

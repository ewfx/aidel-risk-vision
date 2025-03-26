import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import './RawInput.css';

const RawInput = () => {
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
        <Button variant="contained" className="send-button">
          Send
        </Button>
      </div>
    </div>
  );
};

export default RawInput;

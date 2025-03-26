import React, { useState } from 'react';
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
      <div>
        <textarea
          className="raw-input"
          placeholder="Paste your raw JSON..."
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />
        <button className="beautify-button" onClick={handleBeautify}>Beautify</button>
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  };
  

export default RawInput;
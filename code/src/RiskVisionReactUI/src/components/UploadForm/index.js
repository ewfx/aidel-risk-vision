import React, { useState } from 'react';
import FileInput from '../FileInput';
import RawInput from '../RawInput';
import './UploadForm.css';

const UploadForm = () => {
  const [mode, setMode] = useState('none');

  const handleSend = () => {
    console.log('Sending request to dummy API...');
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({ message: 'Sending data...' }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => alert('Sent: ' + JSON.stringify(data)))
      .catch((err) => alert('Error: ' + err.message));
  };

  return (
    <div className="upload-form">
      <div className="radio-group">
        {['Upload or Free Text', 'json'].map((m) => (
          <label
            key={m}
            className={`radio-option ${mode === m ? 'active' : ''}`}
          >
            <input
              type="radio"
              value={m}
              checked={mode === m}
              onChange={() => setMode(m)}
              className="hidden"
            />
            <span className="label-text">{m}</span>
          </label>
        ))}
      </div>

      <div className="input-section">
        {mode === 'Upload or Free Text' && <FileInput binary={false} />}
        {mode === 'json' && <RawInput />}
      </div>

     
    </div>
  );
};

export default UploadForm;
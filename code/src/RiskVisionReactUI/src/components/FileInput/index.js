import React, { useState, useEffect, useRef } from 'react';
import { scanFile } from '../../services/VirusScan/VirusScanService';
import './FileInput.css';

const FileInput = ({ binary = false }) => {
    const fileRefs = useRef({});
    const [entries, setEntries] = useState(() => {
      const stored = localStorage.getItem('uploadEntries');
      return stored ? JSON.parse(stored) : [{ type: 'file', value: null }];
    });
  
    const [scanResults, setScanResults] = useState([]);
    const [fileContents, setFileContents] = useState([]);
    const [loading, setLoading] = useState(false);
    const shouldParseAfterScan = true;
  
    useEffect(() => {
      const cleanEntries = entries.map(({ type, value }) => ({ type, value: type === 'text' ? value : null }));
      localStorage.setItem('uploadEntries', JSON.stringify(cleanEntries));
    }, [entries]);
  
    const handleEntryChange = (index, key, val) => {
      const updated = [...entries];
      updated[index][key] = val;
      setEntries(updated);
    };
  
    const addEntry = () => {
      setEntries([...entries, { type: 'text', value: '' }]);
    };
  
    const moveEntry = (fromIdx, toIdx) => {
      if (toIdx < 0 || toIdx >= entries.length) return;
      const updated = [...entries];
      const [moved] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, moved);
      setEntries(updated);
    };
  
    const handleFileInput = async (e, index) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;
  
      for (const file of files) {
        const newIndex = entries.length;
        setEntries((prev) => [...prev, { type: 'file', value: file.name }]);
        fileRefs.current[newIndex] = file;
        setLoading(true);
  
        try {
          const scan = await scanFile(file);
          setScanResults((prev) => [...prev, { name: file.name, scan }]);
  
          if (shouldParseAfterScan) {
            const reader = new FileReader();
            reader.onload = () => {
              setFileContents((prev) => [...prev, { name: file.name, content: reader.result }]);
            };
            reader.readAsText(file);
          }
        } catch (err) {
          console.error('Scan failed', err);
        }
  
        setLoading(false);
      }
    };
  
    const deleteEntry = (idx) => {
      const updated = [...entries];
      updated.splice(idx, 1);
      setEntries(updated.length ? updated : [{ type: 'file', value: null }]);
      setScanResults((prev) => prev.filter((_, i) => i !== idx));
      setFileContents((prev) => prev.filter((_, i) => i !== idx));
    };
  
    const handleSubmit = async () => {
      let hasError = false;
      entries.forEach((entry, i) => {
        if (entry.type === 'text' && !entry.value?.trim()) {
            alert(`Text row ${i + 1} cannot be empty`);
          hasError = true;
        }
        if (entry.type === 'file' && !fileRefs.current[i]) {
            alert(`File row ${i + 1} has no file selected`);
          hasError = true;
        }
      });
      if (hasError) return;
  
      const formData = new FormData();
      entries.forEach((entry, i) => {
        if (entry.type === 'text') {
          formData.append(`text_${i}`, entry.value);
        } else if (entry.type === 'file' && fileRefs.current[i]) {
          formData.append(`file_${i}`, fileRefs.current[i]);
        }
      });
  
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        alert('Submitted successfully');
      } catch (err) {
        console.error(err);
        alert('Submission failed');
      }
    };
  
    return (
      <div className="file-input">
        <table className="file-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr key={idx} className="draggable-row">
                <td className="file-key-cell">
                  <select
                    value={entry.type}
                    onChange={(e) => handleEntryChange(idx, 'type', e.target.value)}
                  >
                    <option value="file">File</option>
                    <option value="text">Text</option>
                  </select>
                </td>
                <td className="file-input-cell">
                  {entry.type === 'file' ? (
                    <div
                      className="file-upload-wrapper"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) handleFileInput({ target: { files: [file] } }, idx);
                      }}
                    >
                      <label className="file-upload-label">
                        Choose File
                        <input
                          className="styled-file-input"
                          type="file"
                          multiple
                          accept={binary ? '*/*' : '.json,.csv,.txt'}
                          onChange={(e) => handleFileInput(e, idx)}
                        />
                      </label>
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="text-input"
                      value={entry.value}
                      onChange={(e) => handleEntryChange(idx, 'value', e.target.value)}
                      placeholder="Enter text data here"
                    />
                  )}
                </td>
                <td className="file-action-cell">
                  <div className="action-buttons">
                    {/* <button
                      className="move-row-button"
                      onClick={() => moveEntry(idx, idx - 1)}
                      disabled={idx === 0}
                    >⬆</button>
                    <button
                      className="move-row-button"
                      onClick={() => moveEntry(idx, idx + 1)}
                      disabled={idx === entries.length - 1}
                    >⬇</button> */}
                    <button
                      className="delete-row-button"
                      onClick={() => deleteEntry(idx)}
                    >🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        <div className="row-controls" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {/* <button className="add-row-button" onClick={addEntry}>+ Add Row</button> */}
          <button style={{alignItems:'end'}}className="send-button" onClick={handleSubmit}>Submit</button>
        </div>
  
        {loading && <p className="loading-text">Scanning for viruses...</p>}
  
        {scanResults.map((res, idx) => (
          res && res.scan && (
            <div key={idx} className="scan-block">
              <h4>{res.name}</h4>
              <pre className="scan-result">{JSON.stringify(res.scan, null, 2)}</pre>
            </div>
          )
        ))}
  
        {fileContents.map((file, idx) => (
          file && file.content && (
            <div key={idx}>
              <h3 className="file-heading">{file.name} Content:</h3>
              <pre className="file-content">{file.content}</pre>
            </div>
          )
        ))}
      </div>
    );
  };
  
export default FileInput;
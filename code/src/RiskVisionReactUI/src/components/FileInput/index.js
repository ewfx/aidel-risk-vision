import React, { useState, useRef, useEffect } from "react";
import { scanFile } from "../../services/VirusScan/VirusScanService";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Delete, UploadFile } from "@mui/icons-material";

const FileInput = ({ binary = false }) => {
  const fileRefs = useRef(null);
  const [entry, setEntry] = useState(() => {
    const stored = localStorage.getItem("uploadEntry");
    return stored ? JSON.parse(stored) : { type: "file", value: null };
  });

  const [scanResult, setScanResult] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const shouldParseAfterScan = true;

  useEffect(() => {
    localStorage.setItem("uploadEntry", JSON.stringify(entry));
  }, [entry]);

  const handleEntryChange = (key, val) => {
    setEntry({ type: val, value: "" });
    setScanResult(null);
    setFileContent(null);
  };

  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setEntry({ type: "file", value: file.name });
    fileRefs.current = file;
    setLoading(true);

    try {
      const scan = await scanFile(file);
      setScanResult({ name: file.name, scan });

      if (shouldParseAfterScan) {
        const reader = new FileReader();
        reader.onload = () => {
          setFileContent({ name: file.name, content: reader.result });
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error("Scan failed", err);
    }

    setLoading(false);
  };

  const deleteEntry = () => {
    setEntry({ type: "file", value: null });
    setScanResult(null);
    setFileContent(null);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    if (entry.type === "text" && !entry.value?.trim()) {
      alert("Text input cannot be empty");
      return;
    }
    if (entry.type === "file" && !fileRefs.current) {
      alert("No file selected");
      return;
    }

    if (entry.type === "text") {
      formData.append("text", entry.value);
    } else if (entry.type === "file" && fileRefs.current) {
      formData.append("file", fileRefs.current);
    }

    try {
      await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: formData,
      });
      alert("Submitted successfully");
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
  };

  return (
    <Box p={3}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Select value={entry.type} onChange={(e) => handleEntryChange("type", e.target.value)} fullWidth>
                  <MenuItem value="file">File</MenuItem>
                  <MenuItem value="text">Text</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                {entry.type === "file" ? (
                  <Box
                    border={1}
                    borderRadius={2}
                    p={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      borderColor: 'grey.400',
                      cursor: 'pointer',
                      borderStyle: 'dashed', // Added dotted border
                    }}
                  >
                    <Button variant="contained" component="label" startIcon={<UploadFile />} sx={{ backgroundColor: "teal", color: "white" }}>
                      Choose File
                      <input type="file" hidden accept={binary ? "*/*" : ".json,.csv,.txt"} onChange={handleFileInput} />
                    </Button>
                  </Box>
                ) : (
                  <TextField fullWidth value={entry.value} onChange={(e) => setEntry({ type: "text", value: e.target.value })} placeholder="Enter text data here" />
                )}
              </TableCell>
              <TableCell>
                <IconButton onClick={deleteEntry} color="error">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" sx={{ backgroundColor: "teal", color: "white" }} onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
      {loading && <CircularProgress sx={{ mt: 2 }} />}
    </Box>
  );
};

export default FileInput;
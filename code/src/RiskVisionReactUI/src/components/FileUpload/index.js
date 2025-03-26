import React, { useState } from "react";
import { Box, Button, Typography, List, ListItem, ListItemText, TextField, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const FileUpload = ({handleTransactionDataUpdate}) => {
    const [files, setFiles] = useState([]);
    const [textInput, setTextInput] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (event) => {
        setFiles([...files, ...event.target.files]);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setFiles([...files, ...event.dataTransfer.files]);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleUpload = async () => {
        if (files.length === 0 && !textInput.trim()) {
            alert("Please upload a file or enter text for processing.");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => formData.append("file", file));
        formData.append("textInput", textInput);

        try {
            setUploading(true);
            const response = await axios.post("http://127.0.0.1:5000/jsonortext", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            handleTransactionDataUpdate(response);

            alert("Processing successful!");
            console.log(response.data);
        } catch (error) {
            alert("Error processing input");
            console.error("Processing error:", error);
        } finally {
            setUploading(false);
            setFiles([]);
            setTextInput("");
        }
    };

    return (
        <Box sx={{
            p: 3,
            border: "2px dashed #007BFF",
            textAlign: "center",
            borderRadius: 3,
            bgcolor: "#f9f9f9",
            boxShadow: 3,
            maxWidth: 600,
            margin: "auto",
            mt: 5,
        }}>
            <CloudUploadIcon sx={{ fontSize: 60, color: "#007BFF", mb: 1 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
                Drag & Drop files here or
            </Typography>
            <Button variant="contained" component="label" sx={{ mb: 2, bgcolor: "#007BFF" }}>
                Browse Files
                <input type="file" hidden multiple onChange={handleFileChange} />
            </Button>
            <List sx={{ maxHeight: 150, overflow: "auto", bgcolor: "white", borderRadius: 2, p: 1 }}>
                {files.map((file, index) => (
                    <ListItem key={index} divider>
                        <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
                    </ListItem>
                ))}
            </List>
            <TextField
                label="Enter raw text for processing"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                sx={{ mt: 2, bgcolor: "white", borderRadius: 1 }}
            />
            <Button
                variant="contained"
                color="success"
                onClick={handleUpload}
                disabled={uploading}
                sx={{ mt: 2 }}
            >
                {uploading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Process Data"}
            </Button>
        </Box>
    );
};

export default FileUpload;

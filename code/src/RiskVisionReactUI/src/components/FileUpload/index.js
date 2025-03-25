import React, { useState } from "react";
import { Box, Button, Typography, List, ListItem, ListItemText } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const FileUpload = () => {
    const [files, setFiles] = useState([]);
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
        if (files.length === 0) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => formData.append("file", file));

        try {
            setUploading(true);
            const response = await axios.post("http://127.0.0.1:5000/upload/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("File uploaded successfully!");
            console.log(response.data);
        } catch (error) {
            alert("Error uploading file");
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
            setFiles([]); // Clear files after upload
        }
    };

    return (
        <Box sx={{ p: 2, border: "2px dashed #ccc", textAlign: "center", borderRadius: 2 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}>
            <CloudUploadIcon sx={{ fontSize: 50, color: "#666" }} />
            <Typography variant="h6">Drag & Drop files here or</Typography>
            <Button variant="contained" component="label">
                Browse Files
                <input type="file" hidden multiple onChange={handleFileChange} />
            </Button>
            <List>
                {files.map((file, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={file.name} secondary={(file.size / 1024).toFixed(2) + " KB"} />
                    </ListItem>
                ))}
            </List>
            {files.length > 0 && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={uploading}
                    sx={{ mt: 2 }}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </Button>
            )}
        </Box>
    );
};

export default FileUpload;

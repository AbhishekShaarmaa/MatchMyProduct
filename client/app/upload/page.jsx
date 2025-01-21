"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [matchedProducts, setMatchedProducts] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadStatus("");
    setMatchedProducts([]);
  };
  console.log(selectedFile);

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post(
        "http://localhost:4000/api/image/search",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setUploadStatus("Upload successful!");
        setMatchedProducts(response.data.matchedObjects);
      } else {
        setUploadStatus("Failed to upload. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Upload Image</h1>

      {/* File Input */}
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="px-6 py-2 bg-white text-indigo-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition"
      >
        Upload Image
      </button>

      {/* Upload Status */}
      {uploadStatus && (
        <p className="mt-4 text-white text-lg font-medium">{uploadStatus}</p>
      )}

      {/* Display Matched Products */}
      {matchedProducts.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchedProducts.map((product, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <Image
                src={product.publicUrl}
                alt={product.fileDes}
                width={300}
                height={300}
                className="rounded"
              />
              <p className="mt-2 text-gray-800 font-medium text-center">
                {product.fileDes || "No description available"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle } from "lucide-react";

interface FileUploadProps {}

interface ApiResponse {
  extracted_text: string;
  summary: string;
  risks_and_score: string;
  pros_cons: string;
}

const FileUpload: React.FC<FileUploadProps> = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFileToApi = async (file: File) => {
    setLoading(true);
    setError(null);
    setApiResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
const response = await fetch("http://127.0.0.1:8000/upload", {
  method: "POST",
  body: formData,
});


      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data: ApiResponse = await response.json();
      setApiResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        setUploadedFile(file.name);
        uploadFileToApi(file);
      }
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFile(file.name);
      uploadFileToApi(file);
    }
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Document</h2>

      {uploadedFile && !loading && apiResult ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 text-center"
        >
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <p className="text-emerald-700 font-medium">
            Document uploaded and processed successfully!
          </p>
          <p className="text-emerald-600 text-sm mt-1 mb-3">{uploadedFile}</p>

          <div className="text-left max-w-xl mx-auto">
            <h3 className="font-semibold mb-1">Summary:</h3>
            <p className="mb-3 whitespace-pre-wrap">{apiResult.summary}</p>

            <h3 className="font-semibold mb-1">Risks and Risk Score:</h3>
            <p className="mb-3 whitespace-pre-wrap">{apiResult.risks_and_score}</p>

            <h3 className="font-semibold mb-1">Pros and Cons:</h3>
            <p className="mb-3 whitespace-pre-wrap">{apiResult.pros_cons}</p>
          </div>
        </motion.div>
      ) : loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Processing document...</p>
        </div>
      ) : (
        <motion.div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            isDragOver ? "border-indigo-400 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Drop your document here or click to browse</p>
            <p className="text-sm text-gray-500">Supports PDF and DOCX files up to 10MB</p>
          </label>
        </motion.div>
      )}

      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default FileUpload;

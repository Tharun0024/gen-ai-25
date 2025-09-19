import React, { useCallback, useState, ChangeEvent, DragEvent } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle, File as FileIcon, Loader2 } from "lucide-react";
import { useDocumentAnalysis } from "./DocumentAnalysisContext";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { isLoading, analysis } = useDocumentAnalysis();

  const handleFile = (file: File) => {
    setUploadedFile(file);
    onFileUpload(file);
  };

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    []
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Document</h2>

      {analysis && uploadedFile ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 text-center"
        >
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <p className="text-emerald-700 font-medium">Analysis Complete</p>
          <p className="text-emerald-600 text-sm mt-1">{uploadedFile.name}</p>
        </motion.div>
      ) : isLoading && uploadedFile ? (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mr-3" />
            <p className="text-gray-600">Analyzing {uploadedFile.name}...</p>
          </div>
        </div>
      ) : uploadedFile ? (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <div className="flex items-center justify-center">
            <FileIcon className="w-6 h-6 text-gray-500 mr-3" />
            <p className="text-gray-600">{uploadedFile.name}</p>
          </div>
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

    </div>
  );
};

export default FileUpload;

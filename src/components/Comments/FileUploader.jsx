import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaFile, FaImage, FaTimes } from 'react-icons/fa';
import { supabase } from '../../config/supabase';

const FileUploader = ({ onFileUpload }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5242880, // 5MB
    maxFiles: 3
  });

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Debe iniciar sesión para subir archivos');
      }
      
      const uploadedFiles = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { data, error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data: publicUrl } = supabase.storage
          .from('attachments')
          .getPublicUrl(filePath);
        
        uploadedFiles.push({
          name: file.name,
          url: publicUrl.publicUrl,
          type: file.type,
          size: file.size
        });
      }
      
      onFileUpload(uploadedFiles);
      setFiles([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <FaImage className="text-green-500" />;
    }
    return <FaFile className="text-blue-500" />;
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <FaUpload className="mx-auto text-2xl text-gray-400 mb-2" />
        <p className="text-gray-600">
          {isDragActive
            ? 'Suelte los archivos aquí...'
            : 'Arrastre y suelte archivos aquí, o haga clic para seleccionar archivos'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Máximo 3 archivos (JPG, PNG, PDF, DOC, DOCX) de hasta 5MB cada uno
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Archivos seleccionados:</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
              >
                <div className="flex items-center">
                  {getFileIcon(file)}
                  <span className="ml-2">{file.name}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={uploadFiles}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Subiendo...' : 'Subir archivos'}
          </button>
        </div>
      )}
      
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default FileUploader;

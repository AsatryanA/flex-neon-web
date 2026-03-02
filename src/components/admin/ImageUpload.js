import React, { useState } from 'react';
import { uploadImage } from '../../api/adminService';
import './ImageUpload.css';

function ImageUpload({ onImageUploaded, folder = 'portfolio' }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setPreview(URL.createObjectURL(file));

    // Upload immediately
    try {
      setUploading(true);
      const response = await uploadImage(file, folder);
      const { imageUrl, publicId } = response.data;
      onImageUploaded(imageUrl, publicId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <label className="upload-label">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="upload-input"
        />
        <div className="upload-area">
          {preview ? (
            <img src={preview} alt="Preview" className="upload-preview" />
          ) : (
            <div className="upload-placeholder">
              <span className="upload-icon">📷</span>
              <span className="upload-text">
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </span>
            </div>
          )}
        </div>
      </label>
      {error && <div className="upload-error">{error}</div>}
    </div>
  );
}

export default ImageUpload;

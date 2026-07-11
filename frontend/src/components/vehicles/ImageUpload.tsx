import { ChangeEvent, useRef, useState } from 'react';
import { uploadApi } from '../../api/upload.api';
import { getVehicleImageUrl } from '../../utils/vehicle';
import { Button } from '../ui/Button';

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string) => void;
}

export const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(value || '');

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const imageUrl = await uploadApi.uploadImage(file);
      onChange(imageUrl);
      setPreview(imageUrl);
    } catch {
      setError('Failed to upload image. Please try again.');
      setPreview(value || '');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
    setPreview('');
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="image-upload">
      <label className="form-label">Vehicle Image</label>

      <div className="image-upload-area">
        {preview ? (
          <div className="image-upload-preview">
            <img
              src={getVehicleImageUrl(preview)}
              alt="Vehicle preview"
              className="image-upload-img"
            />
            <div className="image-upload-overlay">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Change Image'}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={handleRemove}
                disabled={uploading}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="image-upload-dropzone"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            <span className="image-upload-icon">📷</span>
            <span className="image-upload-text">
              {uploading ? 'Uploading image...' : 'Click to upload vehicle image'}
            </span>
            <span className="image-upload-hint">JPG, PNG, WebP up to 5MB</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="image-upload-input"
        aria-label="Upload vehicle image"
      />

      {error && <p className="image-upload-error">{error}</p>}
    </div>
  );
};

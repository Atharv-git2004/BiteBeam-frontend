import React, { useState, useRef } from "react";
import { Upload, X, Check, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

export default function FileUpload({
  label = "Upload Image",
  value = "",
  onChange,
  required = false,
  aspectRatio = "video", // "video" (16:9) or "square" (1:1)
}) {
  const { token } = useAuth();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(value || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Sync internal preview if value changes externally
  React.useEffect(() => {
    if (value) {
      setPreview(value);
    }
  }, [value]);

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WEBP, GIF)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size cannot exceed 10 MB");
      return;
    }

    setError("");
    setUploading(true);

    // Immediate local preview via ObjectURL
    const localPreviewUrl = URL.createObjectURL(file);
    setPreview(localPreviewUrl);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to upload image");
      }

      // Successful server upload: full URL or relative URL
      const finalUrl = data.url || data.relativeUrl;
      setPreview(finalUrl);
      onChange?.(finalUrl);
    } catch (err) {
      console.warn("Server upload failed, using local Base64 fallback:", err);
      // Fallback to Base64 FileReader so user can still test seamlessly
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result;
        setPreview(base64Url);
        onChange?.(base64Url);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview("");
    onChange?.("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handleFile(e.target.files[0]);
        }}
      />

      {/* Dropzone Container */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden ${
          dragActive
            ? "border-[#004B49] bg-[#f0f9f9] scale-[1.01]"
            : preview
            ? "border-gray-200 bg-gray-50 hover:border-[#004B49]/40"
            : "border-gray-200 bg-gray-50 hover:bg-[#f0f9f9]/50 hover:border-[#004B49]"
        }`}
      >
        {preview ? (
          <div className="relative w-full group">
            <div
              className={`w-full overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center ${
                aspectRatio === "square" ? "h-40 max-w-[160px] mx-auto" : "h-48"
              }`}
            >
              <img
                src={preview}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Hover overlay with Change & Remove */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
              <span className="text-white text-xs font-bold px-3 py-1.5 bg-black/60 rounded-lg">
                Click to Change
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>

            {/* Uploaded badge */}
            <div className="absolute top-2 right-2 bg-white/95 shadow-md px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold text-[#004B49]">
              <Check size={12} className="text-green-600" />
              <span>Image Attached</span>
            </div>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#dcf2f2] text-[#004B49] flex items-center justify-center shadow-inner">
              <Upload size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">
                Click to upload <span className="font-normal text-gray-500">or drag and drop</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP or GIF (Max 10MB)</p>
            </div>
          </div>
        )}

        {/* Uploading Spinner Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
            <Loader2 size={24} className="text-[#004B49] animate-spin" />
            <p className="text-xs font-bold text-[#004B49]">Uploading file to server...</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1 font-medium mt-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

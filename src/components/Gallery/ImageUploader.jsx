import React, { useState } from "react";

function ImageUploader({ onImageUpload }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (selectedImage) {
      onImageUpload(selectedImage);
      setSelectedImage(null);
    }
  };

  return (
    <div className="image-uploader">
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {selectedImage && (
        <div className="selected-image">
          <img src={selectedImage} alt="Selected" />
          <button onClick={handleUpload}>Upload</button>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;

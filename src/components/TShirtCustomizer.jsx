/* eslint-disable no-unused-vars */
import  { useRef, useState } from "react";
import image from '../assets/image.png'

const TShirtCustomizer = () => {
  const [logo, setLogo] = useState(null); // Uploaded logo
  const [position, setPosition] = useState({ x: 150, y: 200 }); // Position of the logo
  const [scale, setScale] = useState(1); // Logo scale
  const [isDragging, setIsDragging] = useState(false); // Drag state
  const canvasRef = useRef(null); // Canvas to render the final image
  const tShirtDimensions = { width: 400, height: 500 }; // T-shirt dimensions (for canvas)

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (isDragging) {
      const rect = e.target.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Constrain logo movement within T-shirt boundaries
      setPosition((prev) => ({
        x: Math.max(0, Math.min(tShirtDimensions.width - 50, mouseX - 25)), // Adjust for logo width
        y: Math.max(0, Math.min(tShirtDimensions.height - 50, mouseY - 25)), // Adjust for logo height
      }));
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle resizing
  const handleResize = (e) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
  };

  // Generate and download final image
  const generateFinalImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const tShirtImage = new Image();
    const logoImage = new Image();
  
    tShirtImage.src = image;
  
    tShirtImage.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(tShirtImage, 0, 0, canvas.width, canvas.height);
  
      if (logo) {
        logoImage.src = logo;
        logoImage.crossOrigin = "anonymous";  // This line enables CORS
        
        logoImage.onload = () => {
          const logoWidth = logoImage.width * scale;
          const logoHeight = logoImage.height * scale;
          ctx.drawImage(logoImage, position.x, position.y, logoWidth, logoHeight);
  
          // Download the final image
          const link = document.createElement("a");
          link.download = "custom-tshirt.png";
          link.href = canvas.toDataURL();
          link.click();
        };
      }
    };
  };
  

  return (
    <div className="p-6">
      {/* Upload Section */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Upload Logo:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="block w-full max-w-sm border border-gray-300 rounded p-2"
        />
      </div>

      {/* T-Shirt Preview */}
      <div
        className="relative border border-gray-300"
        style={{
          width: `${tShirtDimensions.width}px`,
          height: `${tShirtDimensions.height}px`,
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <img
          src={image}
          alt="T-Shirt"
          className="w-full h-full"
        />
        {logo && (
          <img
            src={logo}
            alt="Logo"
            style={{
              position: "absolute",
              left: `${position.x}px`,
              top: `${position.y}px`,
              transform: `scale(${scale})`,
              cursor: "move",
              width: "50px", // Set initial size for clarity
              height: "50px",
            }}
            onMouseDown={handleMouseDown}
          />
        )}
      </div>

      {/* Controls */}
      {logo && (
        <div className="mt-4">
          <label className="block text-gray-700 mb-2">Resize Logo:</label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={scale}
            onChange={handleResize}
            className="w-full max-w-sm"
          />
        </div>
      )}

      {/* Generate Button */}
      <div className="mt-4">
        <button
          onClick={generateFinalImage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate Final Image
        </button>
      </div>

      {/* Hidden Canvas */}
      <canvas
        ref={canvasRef}
        width={tShirtDimensions.width}
        height={tShirtDimensions.height}
        className="hidden"
      ></canvas>
    </div>
  );
};

export default TShirtCustomizer;

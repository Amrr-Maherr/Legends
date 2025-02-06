// Loader.jsx
import React from "react";
import "../../Style/Loader/Loader.css"; // قم بإنشاء ملف Loader.css بجوار هذا الملف

function Loader() {
  return (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );
}

export default Loader;

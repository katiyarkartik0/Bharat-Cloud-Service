import { useEffect, useState } from "react";
import "./Loader.css";

export const Loader = () => {
  return (
    <div className="loader-background">
      <div className="loader-container">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
      </div>
    </div>
  );
};

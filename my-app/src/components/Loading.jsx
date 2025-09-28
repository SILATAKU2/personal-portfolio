// src/components/Loading.jsx
import React from "react";
import Lottie from "lottie-react";
import shurikenLoading from "../assets/animations/Shuriken loading.json";

const Loading = () => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#000", // black background
    }}>
      <div style={{ width: 150, height: 150 }}> {/* smaller size */}
        <Lottie animationData={shurikenLoading} loop={true} />
      </div>
    </div>
  );
};

export default Loading;

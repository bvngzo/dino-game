import React, { useState, useEffect } from "react";
import DinoGame from "./Game/index";

const App: React.FC = () => {
  const [isMobileWidth, setMobileWidth] = useState(0);
  const [isMobileHeight, setMobileHeight] = useState(0);

  useEffect(() => {
    setMobileWidth(window.innerWidth);
    setMobileHeight(window.innerHeight);
  }, []);

  return (
    <div
      className="App"
      style={{
        // 기기 최적화 사이즈
        width: `${isMobileWidth}px`,
        height: `${isMobileHeight}px`,
      }}
    >
      <h1>Dino Game</h1>
      <DinoGame />
    </div>
  );
};

export default App;

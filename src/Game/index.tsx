import React, { useEffect, useRef, useState } from "react";
import { getRandomInt } from "../Tool";
import "./Game.css";

interface Obstacle {
  id: number;
  position: number;
}

const DinoGame = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [position, setPosition] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([
    { id: 1, position: 1000 },
    { id: 2, position: 1500 },
    { id: 3, position: 2000 },
    { id: 4, position: 2500 },
  ]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const timeInt = 20;

  const jump = (e: React.TouchEvent) => {
    //console.log(e);
    if (e && !isJumping && !isGameOver) {
      setIsJumping(true);
      let jumpHeight = 0;
      const jumpInterval = setInterval(() => {
        if (jumpHeight > 100) {
          // 제한 높이
          clearInterval(jumpInterval);
          const fallInterval = setInterval(() => {
            if (jumpHeight <= 0) {
              clearInterval(fallInterval);
              setIsJumping(false);
            } else {
              jumpHeight -= 5;
              setPosition(jumpHeight);
            }
          }, timeInt);
        } else {
          jumpHeight += 5;
          setPosition(jumpHeight);
        }
      }, timeInt);
    }
  };

  const detectCollision = () => {
    const dinoBottom = position;
    const dinoTop = position + 20;
    const dinoLeft = 50;
    const dinoRight = 70;

    for (const obstacle of obstacles) {
      const obstacleBottom = 0;
      const obstacleTop = 20;
      const obstacleLeft = obstacle.position;
      const obstacleRight = obstacle.position + 20;

      if (
        dinoRight >= obstacleLeft &&
        dinoLeft <= obstacleRight &&
        dinoTop >= obstacleBottom &&
        dinoBottom <= obstacleTop
      ) {
        setIsGameOver(true);
        break;
      }
    }
  };

  // 장애물 세팅
  useEffect(() => {
    if (!isGameOver) {
      const obstacleInterval = setInterval(() => {
        setObstacles((prevObstacles) =>
          prevObstacles.map((obstacle) => ({
            ...obstacle,
            position:
              obstacle.position < -50
                ? 1000 + 400 * getRandomInt(0, 4)
                : obstacle.position - 10,
          }))
        );
      }, timeInt);
      return () => clearInterval(obstacleInterval);
    }
  }, [isGameOver]);

  // 충돌감지
  useEffect(() => {
    if (!isGameOver) {
      const collisionInterval = setInterval(() => {
        detectCollision();
      }, timeInt - 5);
      return () => clearInterval(collisionInterval);
    }
  }, [position, obstacles, isGameOver]);

  //리셋
  const resetGame = () => {
    setIsGameOver(false);
    setPosition(0);
    setObstacles([
      { id: 1, position: 1000 },
      { id: 2, position: 1500 },
      { id: 3, position: 2000 },
      { id: 4, position: 2500 },
    ]);
    setIsJumping(false);
    setScore(0);
  };

  //점수 계산
  useEffect(() => {
    if (!isGameOver) {
      const scoreInterval = setInterval(() => {
        setScore((prevScore) => prevScore + 1);
      }, 100);
      return () => clearInterval(scoreInterval);
    }
  }, [isGameOver]);

  return (
    <div className="game-container" onTouchStart={jump}>
      {isGameOver && (
        <div className="reset-container">
          <div>Game Over</div>
          <button className="reset-btn" onClick={resetGame}>
            Restart
          </button>
        </div>
      )}
      <div className="score-box">Score: {score}</div>
      <div
        className="runner"
        style={{
          transform: `translateY(-${position}px)`,
        }}
      />

      {obstacles.map((obstacle) => (
        <div
          className="obstacle"
          key={obstacle.id}
          style={{
            left: `${obstacle.position}px`,
          }}
        />
      ))}
    </div>
  );
};

export default DinoGame;

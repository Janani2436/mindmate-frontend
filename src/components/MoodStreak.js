// MindMate frontend - MoodStreak.js
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CelebrationIcon from "@mui/icons-material/Celebration";
import "./MoodStreak.css";

const MoodStreak = () => {
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    axios.get("/api/mood/streak").then(res => {
      setStreak(res.data.streak);
      setMaxStreak(res.data.maxStreak);
    });
  }, []);

  return (
    <div className="streak-box">
      {streak > 1 && (
        <div
          className={`streak-badge${streak >= 5 ? " elite" : ""}`}
          title={
            streak >= 5
              ? "Incredible! You're on a major mood streak! 🎉"
              : "Keep going to hit a legendary streak!"
          }
        >
          <EmojiEventsIcon style={{ color: "#ffb300", fontSize: 32, marginRight: 6 }} />
          <span>
            You're on a <strong>{streak}-day</strong> mood streak!
          </span>
          {streak >= 5 && (
            <CelebrationIcon color="primary" style={{ marginLeft: 10, fontSize: 28 }} />
          )}
        </div>
      )}

      <div className="streak-longest">
        <span>
          <b>Longest streak:</b> <span style={{ color: "#388e3c" }}>{maxStreak}</span> days
        </span>
      </div>
    </div>
  );
};

export default MoodStreak;

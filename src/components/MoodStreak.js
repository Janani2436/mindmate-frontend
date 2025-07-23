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
        <div className="streak-badge">
          <EmojiEventsIcon style={{ color: "#ff9800" }} />
          <span>
            You're on a <strong>{streak}-day</strong> mood streak!
          </span>
          {streak >= 5 && <CelebrationIcon color="primary" style={{ marginLeft: 8 }} />}
        </div>
      )}
      <div style={{ fontSize: "0.9em", color: "#666", marginTop: 2 }}>
        Longest streak: <b>{maxStreak}</b> days
      </div>
    </div>
  );
};

export default MoodStreak;

// client/src/components/MoodGraph.js
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from '../utils/axiosInstance';

const moodColor = {
  happy: 'green',
  sad: 'blue',
  angry: 'red',
  anxious: 'orange',
  neutral: 'gray',
  excited: 'purple',
  // add more moods/colors as needed
};

const moodScore = {
  happy: 5,
  excited: 4,
  neutral: 3,
  anxious: 2,
  sad: 1,
  angry: 1,
};

const moodLabel = (m) =>
  m.charAt(0).toUpperCase() + m.slice(1);

export default function MoodGraph() {
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    axios.get('/api/mood')
      .then(res => setMoods(res.data))
      .catch(() => setMoods([]));
  }, []);

  // Handle empty data
  if (!moods || moods.length === 0)
    return <p style={{ textAlign: 'center', margin: 30 }}>No mood entries available for chart.</p>;

  // Sort by date (oldest to newest)
  const sortedMoods = [...moods].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <div style={{ margin: "40px auto", maxWidth: 650, background: "#f7fcfc", borderRadius: 14, padding: 20 }}>
      <h3 style={{ textAlign: "center", marginBottom: 18 }}>📈 Mood Trends</h3>
      <Plot
        data={[
          {
            x: sortedMoods.map(m => new Date(m.createdAt).toLocaleDateString()),
            y: sortedMoods.map(m => moodScore[m.mood] || 3),
            text: sortedMoods.map(m => `${moodLabel(m.mood)}${m.note ? ` - ${m.note}` : ""}`),
            marker: {
              color: sortedMoods.map(m => moodColor[m.mood] || 'gray'),
              size: 13,
            },
            mode: "lines+markers+text",
            type: "scatter",
            line: { shape: "spline", color: "#02b6b9" },
            hovertemplate: "<b>%{text}</b><br>Date: %{x}<br>Score: %{y}<extra></extra>",
          }
        ]}
        layout={{
          autosize: true,
          yaxis: {
            title: "Mood Level",
            tickvals: [1, 2, 3, 4, 5],
            ticktext: ["Low", "Anxious/Angry", "Neutral", "Excited", "Happy"],
            range: [0.5, 5.5],
          },
          xaxis: { title: "Date", tickangle: -30 },
          margin: { t: 28, r: 12, l: 36, b: 56 },
          plot_bgcolor: "#f7fcfc",
          paper_bgcolor: "#f7fcfc",
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{width: "100%", height: 335}}
      />
      <div style={{ textAlign: "center", marginTop: 18, color: "#789" }}>
        <span style={{ color: 'green', margin: "0 6px" }}>● Happy</span>
        <span style={{ color: 'purple', margin: "0 6px" }}>● Excited</span>
        <span style={{ color: 'blue', margin: "0 6px" }}>● Sad</span>
        <span style={{ color: 'orange', margin: "0 6px" }}>● Anxious</span>
        <span style={{ color: 'red', margin: "0 6px" }}>● Angry</span>
        <span style={{ color: 'gray', margin: "0 6px" }}>● Neutral</span>
      </div>
    </div>
  );
}

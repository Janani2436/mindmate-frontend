// MindMate frontend - MoodGraph.js
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from '../utils/axiosInstance';
import './MoodGraph.css';

const moodColor = {
  happy: '#2ecc71',      // green
  excited: '#9b59b6',    // purple
  sad: '#3498db',        // blue
  anxious: '#e67e22',    // orange
  angry: '#e74c3c',      // red
  neutral: '#7f8c8d',    // gray
};

const moodScore = {
  happy: 5,
  excited: 4,
  neutral: 3,
  anxious: 2,
  sad: 1,
  angry: 1,
};

const moodLabel = (m) => m.charAt(0).toUpperCase() + m.slice(1);

export default function MoodGraph() {
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    axios
      .get('/api/mood')
      .then((res) => setMoods(res.data))
      .catch(() => setMoods([]));
  }, []);

  if (!moods || moods.length === 0) {
    return <p className="mood-graph-empty">📭 No mood entries available for chart.</p>;
  }

  // sorting of moods by date
  const sortedMoods = [...moods].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="mood-graph">
      <h3>📈 Mood Trends Over Time</h3>
      <Plot
        data={[
          {
            x: sortedMoods.map((m) => new Date(m.createdAt).toLocaleDateString()),
            y: sortedMoods.map((m) => moodScore[m.mood] || 3),
            text: sortedMoods.map((m) => `${moodLabel(m.mood)}${m.note ? ` - ${m.note}` : ''}`),
            marker: {
              color: sortedMoods.map((m) => moodColor[m.mood] || 'gray'),
              size: 13,
            },
            mode: 'lines+markers+text',
            type: 'scatter',
            line: { shape: 'spline', color: '#02b6b9' },
            hovertemplate: "<b>%{text}</b><br>Date: %{x}<br>Score: %{y}<extra></extra>",
          },
        ]}
        layout={{
          autosize: true,
          yaxis: {
            title: 'Mood Level',
            tickvals: [1, 2, 3, 4, 5],
            ticktext: ['Low', 'Anxious/Angry', 'Neutral', 'Excited', 'Happy'],
            range: [0.5, 5.5],
          },
          xaxis: {
            title: 'Date',
            tickangle: -30,
          },
          margin: { t: 28, r: 12, l: 36, b: 56 },
          plot_bgcolor: '#f9fefe',
          paper_bgcolor: '#f9fefe',
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%', height: 350 }}
      />

      <div className="mood-legend">
        {Object.entries(moodColor).map(([key, color]) => (
          <span key={key}>
            <span className="dot" style={{ backgroundColor: color }}></span> {moodLabel(key)}
          </span>
        ))}
      </div>
    </div>
  );
}
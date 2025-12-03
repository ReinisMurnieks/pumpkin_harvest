import React from 'react';

export default function HistoryPanel({ history, selectedTimestamp, onSelect }) {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="history-panel">
      <h3>History</h3>
      <div className="history-list">
        {history.map((entry, index) => {
          const { date, time } = formatDate(entry.timestamp);
          const isSelected = entry.timestamp === selectedTimestamp;
          const isCurrent = index === 0 && !selectedTimestamp;
          
          return (
            <button
              key={entry.timestamp}
              className={`history-item ${isSelected || isCurrent ? 'active' : ''}`}
              onClick={() => onSelect(index === 0 ? null : entry.timestamp)}
            >
              <span className="history-date">{date}</span>
              <span className="history-time">{time}</span>
              {index === 0 && <span className="current-badge">Latest</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

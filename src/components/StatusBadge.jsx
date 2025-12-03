import React from 'react';

const statusClasses = {
  connected: 'status-connected',
  disconnected: 'status-disconnected'
};

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${statusClasses[status] || 'status-idle'}`}>
      {status}
    </span>
  );
}

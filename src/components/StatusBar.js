import React from 'react';

const StatusBar = ({ connectionStatus, connectedUsers }) => {
  return (
    <div className="status-bar">
      <span className="connection-indicator">
        Status: {connectionStatus === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
      </span>
      <span className="users-online">
        Users Online: {connectedUsers}
      </span>
    </div>
  );
};

export default StatusBar;

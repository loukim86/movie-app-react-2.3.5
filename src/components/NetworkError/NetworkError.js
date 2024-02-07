import React, { useState, useEffect } from 'react';
import './NetworkError.css';

const NetworkError = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  return (
    <React.Fragment>
      {isOnline ? (
        children
      ) : (
        <div>
          <h1 className="network-error">There is no network connection.</h1>
          <h1 className="network-error">Please check your internet connenction and try again.</h1>
        </div>
      )}
    </React.Fragment>
  );
};

export default NetworkError;

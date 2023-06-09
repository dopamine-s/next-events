import { useState, useEffect } from 'react';
import NotificationContext from './notification-context';

function NotificationContextProvider(props) {
  const [activeNotification, setActiveNotification] = useState();
  const [successfullyAdded, setSuccessfullyAdded] = useState(false);

  function showNotificationHandler(notificationData) {
    setActiveNotification(notificationData);
  }

  function hideNotificationHandler() {
    setActiveNotification(null);
  }

  useEffect(() => {
    if (activeNotification && activeNotification.status === 'success') {
      setSuccessfullyAdded(true);
      const timer = setTimeout(() => {
        setActiveNotification(null);
      }, 3000);
      return () => {
        clearTimeout(timer);
        setSuccessfullyAdded(false);
      };
    } else if (activeNotification && activeNotification.status === 'error') {
      const timer = setTimeout(() => {
        setActiveNotification(null);
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [activeNotification]);

  const context = {
    notification: activeNotification,
    successfullyAdded: successfullyAdded,
    showNotification: showNotificationHandler,
    hideNotification: hideNotificationHandler,
  };

  return (
    <NotificationContext.Provider value={context}>
      {props.children}
    </NotificationContext.Provider>
  );
}

export default NotificationContextProvider;

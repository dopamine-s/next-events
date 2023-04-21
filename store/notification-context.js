import { createContext } from 'react';

const NotificationContext = createContext({
  successfullyAdded: false,
  notification: null, // {title, message, status}
  showNotification: function (notificationData) {},
  hideNotification: function () {},
  clearSuccessfullyAdded: function () {},
});

export default NotificationContext;

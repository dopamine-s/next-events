import { createContext } from 'react';

const NotificationContext = createContext({
  notificaion: null, // {title, message, status}
  showNotification: function (notificationData) {},
  hideNotification: function () {},
});

export default NotificationContext;

import Head from 'next/head';

import Layout from '../components/layout/layout';
import '../styles/globals.css';
import Notification from '../components/ui/notification';
import NotificationContextProvider from '../store/NotificationProvider';

function MyApp({ Component, pageProps }) {
  return (
    <NotificationContextProvider>
      <Layout>
        <Head>
          <title>NextJS Events</title>
          <meta name="description" content="NextJS Events" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Component {...pageProps} />
        <Notification title="Test" message="This is a test." status="pending" />
      </Layout>
    </NotificationContextProvider>
  );
}

export default MyApp;

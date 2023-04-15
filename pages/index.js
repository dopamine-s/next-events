import Head from 'next/head';

import EventList from '../components/events/event-list';
import NewsletterRegistration from '../components/input/newsletter-registration';
import ErrorAlert from '../components/ui/error-alert';
import { getFeaturedEvents } from '../helpers/api-utils';

function HomePage(props) {
  const events = props.featuredEvents;

  if (events.length === 0) {
    return (
      <ErrorAlert>
        <p>Error fetching featured events!</p>
      </ErrorAlert>
    );
  }

  return (
    <div>
      <Head>
        <title>NextJS Events</title>
        <meta
          name="description"
          content="Find a lot of great events to improve yourself"
        />
      </Head>
      <NewsletterRegistration />
      <EventList events={events} />;
    </div>
  );
}

export async function getStaticProps() {
  const featuredEvents = await getFeaturedEvents();
  return {
    props: {
      featuredEvents,
    },
    revalidate: 1800,
  };
}

export default HomePage;

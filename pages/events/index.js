import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { getAllEvents } from '../../helpers/api-utils';
import EventList from '../../components/events/event-list';
import EventsSearch from '../../components/events/events-search';
import ErrorAlert from '../../components/ui/error-alert';

function AllEventsPage(props) {
  const events = props.events;
  const router = useRouter();

  function findEventsHandler(year, month) {
    const fullPath = `/events/${year}/${month}`;
    router.push(fullPath);
  }

  if (!events || !events.length) {
    return (
      <ErrorAlert>
        <p>Error fetching events!</p>
      </ErrorAlert>
    );
  }

  return (
    <Fragment>
      <Head>
        <title>All my events</title>
      </Head>
      <Head>
        <title>All Events</title>
        <meta
          name="description"
          content="Find a lot of great events to improve yourself"
        />
      </Head>
      <EventsSearch onSearch={findEventsHandler} />
      {events && <EventList events={events} />}
    </Fragment>
  );
}

export async function getStaticProps() {
  try {
    const events = await getAllEvents();

    return {
      props: {
        events,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        events: [],
      },
      revalidate: 60,
    };
  }
}

export default AllEventsPage;

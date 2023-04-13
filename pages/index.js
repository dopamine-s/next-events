import EventList from '../components/events/event-list';
import { getFeaturedEvents } from '../helpers/api-utils';
import ErrorAlert from '../components/ui/error-alert';

function HomePage(props) {
  const events = props.featuredEvents;

  if (events.length === 0) {
    return (
      <ErrorAlert>
        <p>Error fetching featured events!</p>
      </ErrorAlert>
    );
  }

  return <EventList events={events} />;
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

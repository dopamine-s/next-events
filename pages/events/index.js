import { getAllEvents } from '../../dummy-data';
import EventList from '../../components/events/event-list';

function AllEventsPage() {
  const events = getAllEvents();
  return (
    <div>
      <EventList events={events} />
    </div>
  );
}

export default AllEventsPage;

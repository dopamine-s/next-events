import EventItem from './event-item';
import classes from './event-list.module.css';

function EventList({ events }) {
  return (
    <ul className={classes.list}>
      {events.map((event) => (
        <EventItem key={event.id} item={event} />
      ))}
    </ul>
  );
}

export default EventList;

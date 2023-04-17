import EventItem from './event-item';
import classes from './event-list.module.css';

function EventList({ events }) {
  return (
    <ul className={classes.list}>
      {events.map((event) => (
        <EventItem
          key={event.id}
          id={event.id}
          image={event.image}
          title={event.title}
          date={event.date}
          location={event.location}
        />
      ))}
    </ul>
  );
}

export default EventList;

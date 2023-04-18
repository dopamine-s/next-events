export const BASE_EVENTS_URL =
  'https://nextjs-d1ee1-default-rtdb.europe-west1.firebasedatabase.app/events.json';

export async function getAllEvents() {
  const response = await fetch(BASE_EVENTS_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  const data = await response.json();

  const events = [];

  for (const key in data) {
    events.push({
      id: key,
      ...data[key],
    });
  }

  return events;
}

export async function getFeaturedEvents() {
  try {
    const allEvents = await getAllEvents();
    return allEvents.filter((event) => event.isFeatured);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getEventById(id) {
  try {
    const allEvents = await getAllEvents();
    return allEvents.find((event) => event.id === id);
  } catch (error) {
    throw new Error('Failed to fetch event by id.');
  }
}

export async function getFilteredEvents(dateFilter) {
  try {
    const { year, month } = dateFilter;

    const allEvents = await getAllEvents();

    let filteredEvents = allEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === year && eventDate.getMonth() === month - 1
      );
    });

    return filteredEvents;
  } catch (error) {
    throw new Error('Failed to fetch filtered events.');
  }
}

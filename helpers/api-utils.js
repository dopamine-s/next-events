const baseUrl = process.env.NEXT_PUBLIC_EVENTS_URL;

export async function getAllEvents() {
  const response = await fetch(baseUrl);

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

import { eventService, CardsList } from "@entities/event";

import * as Styles from "./styles";

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const mapMockImages = (event) => ({
  id: event.id,
  image: "/images/events.jpg",
  title: event.name,
  venue: event.location,
  link: `/events/${event.id}`,
  metadata: [
    {
      name: "time",
      value: new Date(event.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    },
    {
      name: "date",
      value: new Date(event.event_date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
    },
    {
      accent: true,
      name: "location",
      value: event.location?.split(',')[0] || 'Unknown'
    }
  ]
});

export default async function Home() {
  const recommendedEvents = await eventService.getRecommendedEvents();
  const artEvents = await eventService.getArtEvents();
  const musicEvents = await eventService.getMusicEvents();
  const sportEvents = await eventService.getSportEvents();

  // Преобразуем данные в нужный формат
  const recommendedEventsWithImages = recommendedEvents.map(mapMockImages);
  const artEventsWithImages = artEvents.map(mapMockImages);
  const musicEventsWithImages = musicEvents.map(mapMockImages);
  const sportEventsWithImages = sportEvents.map(mapMockImages)

  return (
    <main>
      <Styles.Section>
        <CardsList title={'Recommended for you'} events={recommendedEventsWithImages} />
      </Styles.Section>

      {artEventsWithImages.length > 0 && (
        <Styles.Section>
          <CardsList title={'Art events'} events={artEventsWithImages} />
        </Styles.Section>
      )}

      {musicEventsWithImages.length > 0 && (
        <Styles.Section>
          <CardsList title={'Music events'} events={musicEventsWithImages} />
        </Styles.Section>
      )}

      {sportEventsWithImages.length > 0 && (
        <Styles.Section>
          <CardsList title={'Sport events'} events={sportEventsWithImages} />
        </Styles.Section>
      )}
    </main>
  );
}

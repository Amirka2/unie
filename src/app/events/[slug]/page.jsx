import { eventService, FullInfo } from "@entities/event";
import { userService } from "@entities/user";
import { ticketService } from "@entities/ticket";

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
  ],
  description: event.description
});

const SellerInfo = async ({ id }) => {
  const data = await userService.getUserById({ id });

  return (
    <span>
      name: {data.name}
      email: {data.email}
    </span>
  )
}

export default async function Event({
  params,
}) {
  const slug = (await params).slug;
  const event = await eventService.getEventById(Number(slug));
  const tickets = await ticketService.getEventTickets(Number(slug));

  return (
    <div>
      <FullInfo event={mapMockImages(event)} />
      <div>
        tickets
      </div>
      <ul>
        {tickets?.map(t => (
          <div key={t.id}>
            <span>{t.id}</span>&nbsp;
            <span>{t.user_id}</span>&nbsp;
            <SellerInfo id={t.user_id} />
          </div>
        ))}
      </ul>
    </div>
  );
}

import React from 'react';

// import { CreateTicketPage} from '@features/ticket/create';

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function page() {
  return (
    <>
      Create Ticket
      {/* <CreateTicketPage /> */}
    </>
  );
};

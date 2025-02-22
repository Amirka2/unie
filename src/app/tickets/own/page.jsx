import React from 'react';

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function OwnTicketsPage() {
  return (
    <div>
      Own Tickets
    </div>
  );
};

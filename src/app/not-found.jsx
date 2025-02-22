export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-4">Страница не найдена</h2>
      <p className="text-gray-600 mb-4">Извините, запрашиваемая страница не существует.</p>
      <a
        href="/"
        className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
      >
        Вернуться на главную
      </a>
    </div>
  );
}

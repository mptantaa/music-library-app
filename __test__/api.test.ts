import { fetchSearchResults } from '@/entities/music/api';

test('fetchSearchResults возвращает треки для заданного запроса', async () => {
  const query = 'Eminem'; // Запрос для поиска
  const results = await fetchSearchResults(query); // Выполняем поиск
  expect(results.length).toBeGreaterThan(0); // Проверяем, что есть хотя бы один результат
  expect(results[0]).toHaveProperty('title'); // У каждого результата должен быть заголовок
  expect(results[0]).toHaveProperty('artist'); // У каждого результата должен быть исполнитель
});

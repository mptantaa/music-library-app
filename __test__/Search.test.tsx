import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Search from '../app/(tabs)/search';
import { fetchSearchResults, getFavorites, addFavorite, removeFavorite } from '@/entities/music/api';

jest.mock('@/entities/music/api', () => ({
  fetchSearchResults: jest.fn(),
  getFavorites: jest.fn(),
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
}));

describe('Search Component', () => {
  it('Отображение состояния "Ничего не найдено", если нет результатов поиска', async () => {
    (fetchSearchResults as jest.Mock).mockResolvedValueOnce([]);

    const { getByPlaceholderText, findByText } = render(<Search />);

    const searchInput = getByPlaceholderText('Введите название песни или исполнителя');
    fireEvent.changeText(searchInput, 'unknown track');

    const emptyMessage = await findByText('Ничего не найдено');
    expect(emptyMessage).toBeTruthy();
  });

  it('Отображение результатов поиска', async () => {
    const mockTracks = [
      {
        id: 1109731,
        title: 'Lose Yourself',
        artist: { id: 13, name: 'Eminem', picture_small: '' },
        album: { id: 119606, title: '8 Mile', cover_small: '' },
        duration: 326,
      },
    ];
    (fetchSearchResults as jest.Mock).mockResolvedValueOnce(mockTracks);

    const { getByPlaceholderText, findByText } = render(<Search />);

    const searchInput = getByPlaceholderText('Введите название песни или исполнителя');
    fireEvent.changeText(searchInput, 'Lose Yourself');

    const trackTitle = await findByText('Lose Yourself');
    expect(trackTitle).toBeTruthy();
  });
});

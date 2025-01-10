import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import TrackDetails from '../app/track/[id]';
import {
  fetchTrackById,
  getFavorites,
  addFavorite,
  removeFavorite,
} from '@/entities/music/api';

// Мокаем функции API
jest.mock('@/entities/music/api', () => ({
  fetchTrackById: jest.fn(),
  getFavorites: jest.fn(),
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn().mockReturnValue({ id: '1' }),
  useRouter: jest.fn(),
}));

describe('TrackDetails', () => {
  const mockTrack = {
    id: 1,
    title: 'Lose Yourself',
    artist: { id: 13, name: 'Eminem', picture: '' },
    album: {
      id: 119606,
      title: '8 Mile',
      cover_xl: '',
      release_date: '2002-10-22',
    },
    duration: 326,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getFavorites as jest.Mock).mockResolvedValue([]);
  });

  it('должен корректно отображать данные трека', async () => {
    (fetchTrackById as jest.Mock).mockResolvedValueOnce(mockTrack);
    (getFavorites as jest.Mock).mockResolvedValueOnce([1]); // Трек в избранном

    const { getByText } = render(
      <NavigationContainer>
        <TrackDetails />
      </NavigationContainer>
    );

    await waitFor(() => expect(getByText('Lose Yourself')).toBeTruthy());
    expect(getByText('Eminem')).toBeTruthy();
    expect(getByText('8 Mile')).toBeTruthy();
    expect(getByText('5:26')).toBeTruthy();
  });

  it('должен позволять добавлять и удалять из избранного', async () => {
    (fetchTrackById as jest.Mock).mockResolvedValueOnce(mockTrack);
    (getFavorites as jest.Mock).mockResolvedValueOnce([]); // Трек не в избранном
    (addFavorite as jest.Mock).mockResolvedValueOnce(undefined);
    (removeFavorite as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByText } = render(
      <NavigationContainer>
        <TrackDetails />
      </NavigationContainer>
    );

    // Добавить в избранное
    const favoriteButton = await waitFor(() => getByText('Добавить в избранное'));
    fireEvent.press(favoriteButton);

    await waitFor(() =>
      expect(getByText('Убрать из избранного')).toBeTruthy()
    );

    // Удалить из избранного
    const unfavoriteButton = getByText('Убрать из избранного');
    fireEvent.press(unfavoriteButton);

    await waitFor(() =>
      expect(getByText('Добавить в избранное')).toBeTruthy()
    );
  });
});

import axios from 'axios';
import { Artist, Track } from '../model/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEEZER_API = "http://192.168.1.7:5000/api";

/**
 * Получить популярных артистов.
 * @returns Promise<Artist[]>
 */
export const fetchTopArtists = async (): Promise<Artist[]> => {
  try {
    const response = await axios.get<{ data: Artist[] }>(`${DEEZER_API}/chart/0/artists`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Ошибка при загрузке популярных артистов:', error);
    return [];
  }
};

/**
 * Получить популярные треки.
 * @returns Promise<Track[]>
 */
export const fetchTopTracks = async (): Promise<Track[]> => {
  try {
    const response = await axios.get<{ data: Track[] }>(`${DEEZER_API}/chart/0/tracks`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Ошибка при загрузке популярных треков:', error);
    return [];
  }
};

/**
 * Получить информацию о треке по ID.
 * @param id - ID трека
 * @returns Promise<Track | null>
 */
export const fetchTrackById = async (id: number): Promise<Track | null> => {
  try {
    const response = await axios.get<Track>(`${DEEZER_API}/track/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при загрузке трека с ID ${id}:`, error);
    return null;
  }
};

/**
 * Получить информацию об артисте по ID.
 * @param id - ID артиста
 * @returns Promise<Artist | null>
 */
export const fetchArtistById = async (id: number): Promise<Artist | null> => {
  try {
    const response = await axios.get<Artist>(`${DEEZER_API}/artist/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при загрузке артиста с ID ${id}:`, error);
    return null;
  }
};

/**
 * Получить информацию об топ треках артиста по ID.
 * @param id - ID артиста
 * @returns Promise<Track[]>
 */
export const fetchArtistTopTracks = async (artistId: number): Promise<Track[]> => {
    try {
        const response = await axios.get<{ data: Track[] }>(`${DEEZER_API}/artist/${artistId}/top`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        });
        return response.data.data;
    } catch (error) {
        console.error(`Ошибка при загрузке топ треков артиста с ID ${artistId}:`, error);
        return [];
    }
};


/**
 * Получить результаты поиска треков по запросу.
 * @param query - Поисковый запрос
 * @param order - Порядок сортировки результатов (по умолчанию RANKING)
 * @returns Promise<Track[]>
 */
export const fetchSearchResults = async (query: string, order: string = 'RANKING'): Promise<Track[]> => {
  try {
      const response = await axios.get<{ data: Track[] }>(`${DEEZER_API}/search/track`, {
          params: {
              q: query,
              order: order,
          },
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
      });
      return response.data.data;
  } catch (error) {
      console.error(`Ошибка при выполнении поиска по запросу "${query}":`, error);
      return [];
  }
};



// Получить избранные треки
export const getFavorites = async (): Promise<number[]> => {
  const storedFavorites = await AsyncStorage.getItem('favorites');
  return storedFavorites ? JSON.parse(storedFavorites) : [];
};

// Добавить трек в избранное
export const addFavorite = async (trackId: number): Promise<void> => {
  const favorites = await getFavorites();
  if (!favorites.includes(trackId)) {
    const updatedFavorites = [...favorites, trackId];
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  }
};

// Удалить трек из избранного
export const removeFavorite = async (trackId: number): Promise<void> => {
  const favorites = await getFavorites();
  const updatedFavorites = favorites.filter((id) => id !== trackId);
  await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
};

// Проверить, является ли трек избранным
export const isFavorite = async (trackId: number): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.includes(trackId);
};

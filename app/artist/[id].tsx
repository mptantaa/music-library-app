import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { fetchArtistById, fetchArtistTopTracks, getFavorites, addFavorite, removeFavorite } from '@/entities/music/api';
import { Artist, Track } from '@/entities/music/model/types';
import TrackListItem from '@/entities/music/ui/TrackListItem';

export default function ArtistDetails() {
  const { id } = useLocalSearchParams(); // Получаем ID артиста из маршрута
  const router = useRouter();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Обновление избранных треков из AsyncStorage
  const fetchFavorites = async () => {
    const storedFavorites = await getFavorites();
    setFavorites(storedFavorites);
  };

  // Добавление/удаление трека из избранных
  const toggleFavorite = async (trackId: number) => {
    if (favorites.includes(trackId)) {
      await removeFavorite(trackId);
    } else {
      await addFavorite(trackId);
    }
    fetchFavorites();
  };

  // Загрузка данных артиста
  const fetchArtistDetails = async () => {
    try {
      setLoading(true);
      if (id) {
        const artistData = await fetchArtistById(Number(id));
        setArtist(artistData);

        const topTracksData = await fetchArtistTopTracks(Number(id));
        setTopTracks(topTracksData || []);
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных артиста:', error);
    } finally {
      setLoading(false);
    }
  };

  // Фокусировка экрана: обновление избранных
  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  useEffect(() => {
    fetchArtistDetails();
    fetchFavorites();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!artist) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Не удалось загрузить данные артиста.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Информация об артисте */}
      <View style={styles.header}>
        <Image source={{ uri: artist.picture_xl }} style={styles.artistImage} />
        <Text style={styles.artistName}>{artist.name}</Text>
      </View>

      {/* Список треков */}
      <View style={styles.tracksContainer}>
        <Text style={styles.sectionTitle}>ТОП 5 треков</Text>
        <FlatList
          data={topTracks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TrackListItem
              track={item}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onPress={() => router.push(`/track/${item.id}`)}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
  },
  artistImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  artistName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  tracksContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'left',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

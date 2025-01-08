import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getFavorites, fetchTrackById, removeFavorite } from '@/entities/music/api';
import { Track } from '@/entities/music/model/types';
import TrackListItem from '@/entities/music/ui/TrackListItem';

export default function Favorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchFavorites = async () => {
    setLoading(true);
    const storedFavorites = await getFavorites();
    setFavorites(storedFavorites);

    const tracks = await Promise.all(
      storedFavorites.map(async (id) => {
        const track = await fetchTrackById(id);
        return track;
      })
    );

    setFavoriteTracks(tracks.filter((track) => track !== null) as Track[]);
    setLoading(false);
  };

  const removeFromFavorites = async (trackId: number) => {
    await removeFavorite(trackId);
    fetchFavorites();
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (favoriteTracks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>У вас пока нет избранных треков.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Избранная музыка</Text>
      <FlatList
        data={favoriteTracks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TrackListItem
            track={item}
            isFavorite={true}
            onToggleFavorite={() => removeFromFavorites(item.id)}
            onPress={() => router.push(`/track/${item.id}`)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});

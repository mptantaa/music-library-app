import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import { fetchSearchResults, getFavorites, addFavorite, removeFavorite } from '@/entities/music/api';
import TrackListItem from '@/entities/music/ui/TrackListItem';
import { Track } from '@/entities/music/model/types';
import { useRouter, useFocusEffect } from 'expo-router';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchStarted, setSearchStarted] = useState<boolean>(false);
  const router = useRouter();

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchStarted(false);
      return;
    }

    setLoading(true);
    setSearchStarted(true);
    const results = await fetchSearchResults(query.trim());
    setSearchResults(results);
    setLoading(false);
  };

  const fetchFavorites = async () => {
    const storedFavorites = await getFavorites();
    setFavorites(storedFavorites);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const toggleFavorite = async (trackId: number) => {
    if (favorites.includes(trackId)) {
      await removeFavorite(trackId);
    } else {
      await addFavorite(trackId);
    }
    fetchFavorites();
  };

  const getBackgroundColor = () => {
    if (searchStarted && searchResults.length > 0) {
      return '#121212';
    }
    return '#25292e';
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Введите название песни или исполнителя"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={[styles.resultsContainer, { backgroundColor: getBackgroundColor() }]}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFD700" />
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TrackListItem
                track={item}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={() => toggleFavorite(item.id)}
                onPress={() => router.push(`/track/${item.id}`)}
              />
            )}
            ListEmptyComponent={
              searchStarted &&
              !loading &&
              searchResults.length === 0 ? (
                <Text style={styles.emptyText}>Ничего не найдено</Text>
              ) : null
            }
            contentContainerStyle={
              searchResults.length === 0
                ? styles.emptyContainer
                : undefined
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    padding: 20,
  },
  searchInput: {
    backgroundColor: '#1f1f1f',
    padding: 10,
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  resultsContainer: {
    flex: 1,
    borderRadius: 8,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Track } from '@/entities/music/model/types';
import { Button } from '@/shared/components/Button';
import { fetchTrackById, getFavorites, addFavorite, removeFavorite } from '@/entities/music/api';

export default function TrackDetails() {
  const { id } = useLocalSearchParams();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  const fetchTrackDetails = async () => {
    if (!id) return;
    setLoading(true);
    const trackData = await fetchTrackById(Number(id));
    setTrack(trackData);
    if (trackData) {
      await checkFavoriteStatus(trackData.id);
    }
    setLoading(false);
  };

  const checkFavoriteStatus = async (trackId: number) => {
    const favorites = await getFavorites();
    setIsFavorite(favorites.includes(trackId));
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      await removeFavorite(track?.id!);
    } else {
      await addFavorite(track?.id!);
    }
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    fetchTrackDetails();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      if (track) {
        checkFavoriteStatus(track.id);
      }
    }, [track])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!track) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Не удалось загрузить трек.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: track.album.cover_xl }} style={styles.coverImage} />
      <View style={styles.detailsContainer}>
        <Text style={styles.trackTitle}>{track.title}</Text>
        <Text style={styles.artistName}>{track.artist.name}</Text>
        <Text style={styles.albumName}>{track.album.title}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Дата релиза</Text>
            <Text style={styles.infoValue}>
              {track.album.release_date || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Длительность</Text>
            <Text style={styles.infoValue}>
              {Math.floor(track.duration / 60)}:
              {(track.duration % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
            onPress={toggleFavorite}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

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
  coverImage: {
    width: width,
    height: width,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  detailsContainer: {
    padding: 20,
  },
  trackTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
  },
  artistName: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  albumName: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  infoBox: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    padding: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

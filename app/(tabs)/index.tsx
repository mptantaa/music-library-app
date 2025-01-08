import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import ArtistCard from '@/entities/music/ui/ArtistCard';
import TrackCard from '@/entities/music/ui/TrackCard';
import { fetchTopArtists, fetchTopTracks } from '@/entities/music/api';
import { Artist } from '@/entities/music/model/types';
import { Track } from '@/entities/music/model/types';

export default function Library() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [chartTracks, setChartTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArtistsAndCharts = async () => {
    try {
      setLoading(true);

      const [artistsData, tracksData] = await Promise.all([
        fetchTopArtists(),
        fetchTopTracks(),
      ]);

      setArtists(artistsData);
      setChartTracks(tracksData);
    } catch (error) {
      console.error('Ошибка при запросе данных:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistsAndCharts();
  }, []);

  const renderArtistsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Популярные артисты</Text>
      <FlatList
        horizontal
        data={artists}
        renderItem={({ item }) => <ArtistCard artist={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  const renderTracksSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Популярные треки</Text>
      <FlatList
        data={chartTracks}
        numColumns={3}
        renderItem={({ item }) => <TrackCard track={item} />}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.trackRow}
      />
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={[{ key: 'artists' }, { key: 'tracks' }]}
      renderItem={({ item }) =>
        item.key === 'artists' ? renderArtistsSection() : renderTracksSection()
      }
      keyExtractor={(item) => item.key}
      ListHeaderComponent={
        loading ? <ActivityIndicator size="large" color="#ffd33d" /> : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  section: {
    marginBottom: 20,
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
  trackRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});

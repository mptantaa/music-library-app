import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Track } from '@/entities/music/model/types';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 3;

interface TrackCardProps {
  track: Track;
}

const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/track/${track.id}`)}
    >
      <Image source={{ uri: track.album.cover_medium }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {track.artist.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginRight: 10,
    backgroundColor: '#25292e',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: CARD_WIDTH,
  },
  info: {
    padding: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 10,
    color: '#aaa',
  },
});

export default TrackCard;

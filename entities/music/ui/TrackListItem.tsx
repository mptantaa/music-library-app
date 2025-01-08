import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Track } from '@/entities/music/model/types';

interface TrackListItemProps {
  track: Track;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
}

const TrackListItem: React.FC<TrackListItemProps> = ({
  track,
  isFavorite,
  onToggleFavorite,
  onPress,
}) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <Image source={{ uri: track.album.cover_small }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.title}>{track.title}</Text>
          <Text style={styles.artist}>{track.artist.name}</Text>
        </View>
        <TouchableOpacity onPress={onToggleFavorite}>
          <Text style={styles.favorite}>{isFavorite ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    color: '#aaa',
    fontSize: 14,
  },
  favorite: {
    color: '#FFD700',
    fontSize: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    width: '100%',
  },
});

export default TrackListItem;

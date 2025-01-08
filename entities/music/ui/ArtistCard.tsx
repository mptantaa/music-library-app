import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Artist } from '@/entities/music/model/types';
import { useRouter } from 'expo-router';

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/artist/${artist.id}`)}>
      <Image source={{ uri: artist.picture_medium }} style={styles.image} />
      <Text style={styles.text} numberOfLines={1}>
        {artist.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginRight: 15,
    width: 100,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ArtistCard;

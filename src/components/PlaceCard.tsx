import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyPlace } from '../types';
import { colors } from '../theme/colors';

interface PlaceCardProps {
  place: StudyPlace;
  onPress: () => void;
  onToggleFavorite: () => void;
  compact?: boolean;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  onPress,
  onToggleFavorite,
  compact = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.compactCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{place.name}</Text>
            {place.visited && (
              <View style={styles.visitedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={colors.accentGold} />
                <Text style={styles.visitedText}>Visited</Text>
              </View>
            )}
          </View>
          <Text style={styles.location}>
            {place.building} • {place.floor}
          </Text>
        </View>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          style={styles.heartButton}
        >
          <Text style={styles.heartIcon}>
            {place.isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tagsContainer}>
        {place.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>
            ⭐ {place.rating.toFixed(1)} ({place.ratingCount})
          </Text>
        </View>
        <View style={styles.badgesContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{place.noiseLevel}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{place.crowdLevel}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  compactCard: {
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryMaroon,
    marginRight: 8,
  },
  visitedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  visitedText: {
    fontSize: 10,
    color: colors.textGrey,
    marginLeft: 2,
    fontWeight: '500',
  },
  location: {
    fontSize: 12,
    color: colors.textGrey,
  },
  heartButton: {
    padding: 4,
  },
  heartIcon: {
    fontSize: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  tagText: {
    fontSize: 11,
    color: colors.textGrey,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    color: colors.textGrey,
    fontWeight: '500',
  },
  badgesContainer: {
    flexDirection: 'row',
  },
  badge: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    color: colors.textGrey,
  },
});


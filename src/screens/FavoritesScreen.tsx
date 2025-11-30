import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStudyPlaces } from '../context/StudyPlacesContext';
import { PlaceCard } from '../components/PlaceCard';
import { colors } from '../theme/colors';
import { RootTabParamList, FavoritesStackParamList } from '../navigation/RootNavigator';

type FavoritesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'FavoritesTab'>,
  NativeStackNavigationProp<FavoritesStackParamList>
>;

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { places, toggleFavorite, toggleNotifyWhenQuiet, notifyWhenQuiet } = useStudyPlaces();

  const favoritePlaces = places.filter((p) => p.isFavorite);

  const renderFavoriteItem = ({ item }: { item: typeof places[0] }) => {
    const isNotifyEnabled = Boolean(notifyWhenQuiet[item.id]);

    return (
      <View style={styles.favoriteItem}>
        <PlaceCard
          place={item}
          onPress={() => navigation.navigate('PlaceDetails', { placeId: item.id })}
          onToggleFavorite={() => toggleFavorite(item.id)}
        />
        <View style={styles.notifyRow}>
          <Text style={styles.notifyLabel}>Notify me when quiet</Text>
          <Switch
            value={isNotifyEnabled}
            onValueChange={() => toggleNotifyWhenQuiet(item.id)}
            thumbColor={isNotifyEnabled ? colors.accentGold : '#f4f3f4'}
            trackColor={{ false: colors.border, true: colors.primaryMaroon }}
          />
        </View>
      </View>
    );
  };

  if (favoritePlaces.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Favourites</Text>
          <Text style={styles.subtitle}>
            Your saved study spots. Toggle notifications for quiet times.
          </Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Start exploring and add places to your favorites!
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Text style={styles.emptyButtonText}>Browse Study Spots</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Favourites</Text>
        <Text style={styles.subtitle}>
          Your saved study spots. Toggle notifications for quiet times.
        </Text>
      </View>

      <FlatList
        data={favoritePlaces}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryMaroon,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textGrey,
  },
  listContent: {
    paddingBottom: 16,
  },
  favoriteItem: {
    marginBottom: 8,
  },
  notifyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: -8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  notifyLabel: {
    fontSize: 14,
    color: colors.textGrey,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textGrey,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textGrey,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    borderWidth: 1,
    borderColor: colors.primaryMaroon,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: colors.primaryMaroon,
    fontSize: 14,
    fontWeight: '600',
  },
});


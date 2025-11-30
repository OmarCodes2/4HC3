import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStudyPlaces } from '../context/StudyPlacesContext';
import { PlaceCard } from '../components/PlaceCard';
import { FilterChips } from '../components/FilterChips';
import { colors } from '../theme/colors';
import { StudyPlace, NoiseLevel, CrowdLevel } from '../types';

type RootStackParamList = {
  Home: undefined;
  PlaceDetails: { placeId: string };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { places, preferences, toggleFavorite } = useStudyPlaces();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoise, setSelectedNoise] = useState<string | null>(null);
  const [selectedCrowd, setSelectedCrowd] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const noiseChips = [
    { label: 'All', value: 'all' },
    { label: 'Quiet', value: 'Quiet' },
    { label: 'Moderate', value: 'Moderate' },
    { label: 'Loud', value: 'Loud' },
  ];

  const crowdChips = [
    { label: 'Any', value: 'any' },
    { label: 'Empty', value: 'Empty' },
    { label: 'Some', value: 'Some' },
    { label: 'Busy', value: 'Busy' },
  ];

  const tagChips = [
    { label: 'Outlets', value: 'Outlets' },
    { label: 'Group friendly', value: 'Group friendly' },
    { label: 'Near food', value: 'Food nearby' },
  ];

  // Filter places based on search and filters
  const filteredPlaces = useMemo(() => {
    let filtered = places;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.building.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Noise filter
    if (selectedNoise && selectedNoise !== 'all') {
      filtered = filtered.filter((p) => p.noiseLevel === selectedNoise);
    }

    // Crowd filter
    if (selectedCrowd && selectedCrowd !== 'any') {
      filtered = filtered.filter((p) => p.crowdLevel === selectedCrowd);
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter((p) => p.tags.includes(selectedTag));
    }

    return filtered;
  }, [places, searchQuery, selectedNoise, selectedCrowd, selectedTag]);

  // Get recommended places based on preferences
  const recommendedPlaces = useMemo(() => {
    if (!preferences.preferredNoise && !preferences.needsOutlets && !preferences.prefersNearFood) {
      return [];
    }

    return places
      .filter((place) => {
        if (preferences.preferredNoise && place.noiseLevel !== preferences.preferredNoise) {
          return false;
        }
        if (preferences.needsOutlets && !place.tags.includes('Outlets')) {
          return false;
        }
        if (preferences.prefersNearFood && !place.tags.includes('Food nearby')) {
          return false;
        }
        return true;
      })
      .slice(0, 3);
  }, [places, preferences]);

  const renderPlaceCard = ({ item }: { item: StudyPlace }) => (
    <PlaceCard
      place={item}
      onPress={() => navigation.navigate('PlaceDetails', { placeId: item.id })}
      onToggleFavorite={() => toggleFavorite(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Study Spots</Text>
        <Text style={styles.subtitle}>Browse & discover study spaces on campus</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search places..."
          placeholderTextColor="#999999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={styles.filterToggle}
          onPress={() => setFiltersExpanded(!filtersExpanded)}
        >
          <Text style={styles.filterToggleText}>Filters</Text>
          <Ionicons
            name={filtersExpanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.textGrey}
          />
        </TouchableOpacity>

        {filtersExpanded ? (
          <>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Noise:</Text>
              <FilterChips
                chips={noiseChips}
                selectedValue={selectedNoise}
                onSelect={setSelectedNoise}
              />
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Crowd:</Text>
              <FilterChips
                chips={crowdChips}
                selectedValue={selectedCrowd}
                onSelect={setSelectedCrowd}
              />
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Tags:</Text>
              <FilterChips
                chips={tagChips}
                selectedValue={selectedTag}
                onSelect={setSelectedTag}
              />
            </View>
          </>
        ) : (
          <View style={styles.activeFiltersContainer}>
            {selectedNoise && selectedNoise !== 'all' && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>Noise: {selectedNoise}</Text>
                <TouchableOpacity onPress={() => setSelectedNoise(null)}>
                  <Ionicons name="close-circle" size={16} color={colors.textGrey} />
                </TouchableOpacity>
              </View>
            )}
            {selectedCrowd && selectedCrowd !== 'any' && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>Crowd: {selectedCrowd}</Text>
                <TouchableOpacity onPress={() => setSelectedCrowd(null)}>
                  <Ionicons name="close-circle" size={16} color={colors.textGrey} />
                </TouchableOpacity>
              </View>
            )}
            {selectedTag && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>{selectedTag}</Text>
                <TouchableOpacity onPress={() => setSelectedTag(null)}>
                  <Ionicons name="close-circle" size={16} color={colors.textGrey} />
                </TouchableOpacity>
              </View>
            )}
            {!selectedNoise && !selectedCrowd && !selectedTag && (
              <Text style={styles.noFiltersText}>No filters applied</Text>
            )}
          </View>
        )}
      </View>

      <FlatList
        data={filteredPlaces}
        renderItem={renderPlaceCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          recommendedPlaces.length > 0 ? (
            <View style={styles.recommendedSection}>
              <Text style={styles.recommendedTitle}>Recommended for you</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recommendedPlaces.map((place) => (
                  <View key={place.id} style={styles.recommendedCard}>
                    <PlaceCard
                      place={place}
                      onPress={() => navigation.navigate('PlaceDetails', { placeId: place.id })}
                      onToggleFavorite={() => toggleFavorite(place.id)}
                      compact
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : null
        }
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textGrey,
  },
  filtersContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    paddingVertical: 8,
  },
  filterToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textGrey,
  },
  filterSection: {
    marginBottom: 8,
    marginTop: 4,
  },
  filterLabel: {
    fontSize: 12,
    color: colors.textGrey,
    marginLeft: 16,
    marginBottom: 4,
    fontWeight: '500',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryMaroon,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 4,
  },
  activeFilterText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginRight: 4,
    fontWeight: '500',
  },
  noFiltersText: {
    fontSize: 12,
    color: colors.textGrey,
    fontStyle: 'italic',
    paddingVertical: 4,
  },
  listContent: {
    paddingBottom: 16,
  },
  recommendedSection: {
    marginVertical: 16,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryMaroon,
    marginLeft: 16,
    marginBottom: 8,
  },
  recommendedCard: {
    width: 280,
  },
});


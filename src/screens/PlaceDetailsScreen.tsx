import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useStudyPlaces } from '../context/StudyPlacesContext';
import { colors } from '../theme/colors';

type RootStackParamList = {
  PlaceDetails: { placeId: string };
};

type PlaceDetailsRouteProp = RouteProp<RootStackParamList, 'PlaceDetails'>;

export const PlaceDetailsScreen: React.FC = () => {
  const route = useRoute<PlaceDetailsRouteProp>();
  const { placeId } = route.params;
  const {
    places,
    toggleFavorite,
    markVisited,
    addRatingAndReview,
    updateReview,
    toggleNotifyWhenQuiet,
    notifyWhenQuiet,
    reviews,
  } = useStudyPlaces();

  const place = places.find((p) => p.id === placeId);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);

  if (!place) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text>Place not found</Text>
      </SafeAreaView>
    );
  }

  const placeReviews = reviews.filter((r) => r.placeId === placeId);
  const userReview = placeReviews.length > 0 ? placeReviews[placeReviews.length - 1] : null;
  const isNotifyEnabled = Boolean(notifyWhenQuiet[placeId]);

  const handleSubmitReview = () => {
    if (selectedRating === 0) {
      Alert.alert('Please select a rating');
      return;
    }
    if (isEditingReview && userReview) {
      updateReview(userReview.id, placeId, selectedRating, reviewText);
    } else {
      addRatingAndReview(placeId, selectedRating, reviewText);
    }
    setSelectedRating(0);
    setReviewText('');
    setIsEditingReview(false);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  const handleEditReview = () => {
    if (userReview) {
      setSelectedRating(userReview.rating);
      setReviewText(userReview.text);
      setIsEditingReview(true);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity
            key={rating}
            onPress={() => setSelectedRating(rating)}
            style={styles.starButton}
          >
            <Text style={[
              styles.star,
              selectedRating >= rating && styles.starSelected
            ]}>
              ⭐
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.location}>
          {place.building} • {place.floor}
        </Text>
      </View>

      <View style={styles.tagsContainer}>
        {place.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.infoRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Noise: {place.noiseLevel}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Crowd: {place.crowdLevel}</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleFavorite(placeId)}
        >
          <Text style={styles.heartIcon}>
            {place.isFavorite ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.actionText}>
            {place.isFavorite ? 'Favorited' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            place.visited ? styles.secondaryButton : styles.primaryButton,
          ]}
          onPress={() => markVisited(placeId)}
        >
          {place.visited ? (
            <>
              <Ionicons name="checkmark-circle" size={16} color={colors.primaryMaroon} />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Mark as not visited
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
              <Text style={styles.buttonText}>Mark as visited</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{place.description}</Text>

      {place.isFavorite && (
        <View style={styles.notifySection}>
          <Text style={styles.notifyLabel}>Notify me when this spot is quiet</Text>
          <Switch
            value={isNotifyEnabled}
            onValueChange={() => toggleNotifyWhenQuiet(placeId)}
            thumbColor={isNotifyEnabled ? colors.accentGold : '#f4f3f4'}
            trackColor={{ false: colors.border, true: colors.primaryMaroon }}
          />
        </View>
      )}

      <View style={styles.reviewsSection}>
        <Text style={styles.sectionTitle}>Reviews & rating</Text>
        <View style={styles.ratingDisplay}>
          <Text style={styles.ratingNumber}>
            ⭐ {place.rating.toFixed(1)}
          </Text>
          <Text style={styles.ratingCount}>({place.ratingCount} reviews)</Text>
        </View>

        {placeReviews.length > 0 && (
          <View style={styles.reviewsList}>
            {placeReviews.slice(0, 3).map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewRating}>⭐ {review.rating}</Text>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.addReviewSection}>
          {userReview && !isEditingReview ? (
            <>
              <Text style={styles.addReviewTitle}>Your review</Text>
              <View style={styles.userReviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewRating}>⭐ {userReview.rating}</Text>
                </View>
                <Text style={styles.reviewText}>{userReview.text}</Text>
              </View>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleEditReview}
              >
                <Ionicons name="create-outline" size={16} color={colors.primaryMaroon} />
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Edit review
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.addReviewTitle}>
                {isEditingReview ? 'Edit your review' : 'Add your review'}
              </Text>
              {renderStars()}
              <TextInput
                style={styles.reviewInput}
                placeholder="Write your review..."
                placeholderTextColor="#999999"
                multiline
                numberOfLines={4}
                value={reviewText}
                onChangeText={setReviewText}
              />
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleSubmitReview}
              >
                <Text style={styles.buttonText}>
                  {isEditingReview ? 'Update review' : 'Submit review'}
                </Text>
              </TouchableOpacity>
              {isEditingReview && (
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setIsEditingReview(false);
                    setSelectedRating(0);
                    setReviewText('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
              {showConfirmation && (
                <Text style={styles.confirmationText}>
                  {isEditingReview ? 'Review updated!' : 'Review submitted!'}
                </Text>
              )}
            </>
          )}
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primaryMaroon,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: colors.textGrey,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: colors.textGrey,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  badge: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 13,
    color: colors.textGrey,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heartButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: 24,
    marginRight: 4,
  },
  actionText: {
    fontSize: 12,
    color: colors.textGrey,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primaryMaroon,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primaryMaroon,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  secondaryButtonText: {
    color: colors.primaryMaroon,
  },
  cancelButtonText: {
    color: colors.textGrey,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: colors.textGrey,
    lineHeight: 20,
    marginBottom: 24,
  },
  notifySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 24,
  },
  notifyLabel: {
    fontSize: 14,
    color: colors.textGrey,
    flex: 1,
  },
  reviewsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primaryMaroon,
    marginBottom: 12,
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textGrey,
    marginRight: 8,
  },
  ratingCount: {
    fontSize: 14,
    color: colors.textGrey,
  },
  reviewsList: {
    marginBottom: 24,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewHeader: {
    marginBottom: 4,
  },
  reviewRating: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textGrey,
  },
  reviewText: {
    fontSize: 13,
    color: colors.textGrey,
    lineHeight: 18,
  },
  userReviewCard: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.primaryMaroon,
  },
  addReviewSection: {
    marginTop: 8,
  },
  addReviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textGrey,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  starButton: {
    padding: 4,
    marginRight: 8,
  },
  star: {
    fontSize: 28,
    opacity: 0.3,
  },
  starSelected: {
    opacity: 1,
  },
  reviewInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.textGrey,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  confirmationText: {
    fontSize: 12,
    color: colors.textGrey,
    textAlign: 'center',
    marginTop: 8,
  },
});


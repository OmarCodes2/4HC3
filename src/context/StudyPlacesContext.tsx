import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { StudyPlace, UserPreferences, NoiseLevel, Review } from '../types';
import { initialPlaces } from '../data/places';

interface StudyPlacesContextType {
  places: StudyPlace[];
  favorites: Set<string>;
  visited: Set<string>;
  preferences: UserPreferences;
  notifyWhenQuiet: Record<string, boolean>;
  reviews: Review[];
  toggleFavorite: (id: string) => void;
  markVisited: (id: string) => void;
  addRatingAndReview: (id: string, rating: number, text: string) => void;
  updateReview: (reviewId: string, placeId: string, rating: number, text: string) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  toggleNotifyWhenQuiet: (id: string) => void;
}

const StudyPlacesContext = createContext<StudyPlacesContextType | undefined>(undefined);

export const StudyPlacesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [places, setPlaces] = useState<StudyPlace[]>(initialPlaces);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredNoise: null,
    needsOutlets: false,
    prefersNearFood: false,
  });
  const [notifyWhenQuiet, setNotifyWhenQuiet] = useState<Record<string, boolean>>({});
  const [reviews, setReviews] = useState<Review[]>([]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const markVisited = useCallback((id: string) => {
    setVisited(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const addRatingAndReview = useCallback((id: string, rating: number, text: string) => {
    const newReview: Review = {
      id: Date.now().toString(),
      placeId: id,
      rating,
      text,
      timestamp: Date.now(),
    };
    setReviews(prev => [...prev, newReview]);

    setPlaces(prev => prev.map(place => {
      if (place.id === id) {
        const newCount = place.ratingCount + 1;
        const newRating = ((place.rating * place.ratingCount) + rating) / newCount;
        return {
          ...place,
          rating: Math.round(newRating * 10) / 10,
          ratingCount: newCount,
        };
      }
      return place;
    }));
  }, []);

  const updateReview = useCallback((reviewId: string, placeId: string, rating: number, text: string) => {
    setReviews(prev => {
      const updatedReviews = prev.map(review => {
        if (review.id === reviewId) {
          return {
            ...review,
            rating,
            text,
            timestamp: Date.now(),
          };
        }
        return review;
      });
      
      // Recalculate average rating for the place using updated reviews
      const placeReviews = updatedReviews.filter(r => r.placeId === placeId);
      const totalRating = placeReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = placeReviews.length > 0 ? totalRating / placeReviews.length : 0;
      
      setPlaces(prevPlaces => prevPlaces.map(place => {
        if (place.id === placeId) {
          return {
            ...place,
            rating: Math.round(avgRating * 10) / 10,
          };
        }
        return place;
      }));
      
      return updatedReviews;
    });
  }, []);

  const updatePreferences = useCallback((prefs: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
  }, []);

  const toggleNotifyWhenQuiet = useCallback((id: string) => {
    setNotifyWhenQuiet(prev => ({
      ...prev,
      [id]: !(prev[id] || false),
    }));
  }, []);

  // Derive isFavorite and visited flags for places
  const placesWithFlags = places.map(place => ({
    ...place,
    isFavorite: favorites.has(place.id),
    visited: visited.has(place.id),
  }));

  const value: StudyPlacesContextType = {
    places: placesWithFlags,
    favorites,
    visited,
    preferences,
    notifyWhenQuiet,
    reviews,
    toggleFavorite,
    markVisited,
    addRatingAndReview,
    updateReview,
    updatePreferences,
    toggleNotifyWhenQuiet,
  };

  return (
    <StudyPlacesContext.Provider value={value}>
      {children}
    </StudyPlacesContext.Provider>
  );
};

export const useStudyPlaces = (): StudyPlacesContextType => {
  const context = useContext(StudyPlacesContext);
  if (!context) {
    throw new Error('useStudyPlaces must be used within StudyPlacesProvider');
  }
  return context;
};


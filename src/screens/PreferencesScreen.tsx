import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudyPlaces } from '../context/StudyPlacesContext';
import { colors } from '../theme/colors';
import { NoiseLevel } from '../types';

export const PreferencesScreen: React.FC = () => {
  const { preferences, updatePreferences } = useStudyPlaces();
  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const noiseOptions: { label: string; value: NoiseLevel | null }[] = [
    { label: 'Any', value: null },
    { label: 'Quiet', value: 'Quiet' },
    { label: 'Moderate', value: 'Moderate' },
    { label: 'Loud', value: 'Loud' },
  ];

  const handleSave = () => {
    updatePreferences(localPrefs);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Study preferences</Text>
        <Text style={styles.subtitle}>
          These preferences power the "Recommended for you" section on the home screen.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferred noise level</Text>
        <View style={styles.noiseOptions}>
          {noiseOptions.map((option) => {
            const isSelected = localPrefs.preferredNoise === option.value;
            return (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.noiseButton,
                  isSelected ? styles.noiseButtonSelected : styles.noiseButtonUnselected,
                ]}
                onPress={() =>
                  setLocalPrefs({ ...localPrefs, preferredNoise: option.value })
                }
              >
                <Text
                  style={[
                    styles.noiseButtonText,
                    isSelected
                      ? styles.noiseButtonTextSelected
                      : styles.noiseButtonTextUnselected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.switchRow}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.switchLabel}>Needs outlets</Text>
            <Text style={styles.switchDescription}>
              Show places with power outlets
            </Text>
          </View>
          <Switch
            value={localPrefs.needsOutlets}
            onValueChange={(value) =>
              setLocalPrefs({ ...localPrefs, needsOutlets: value })
            }
            thumbColor={localPrefs.needsOutlets ? colors.accentGold : '#f4f3f4'}
            trackColor={{ false: colors.border, true: colors.primaryMaroon }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.switchRow}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.switchLabel}>Prefers near food</Text>
            <Text style={styles.switchDescription}>
              Show places with food nearby
            </Text>
          </View>
          <Switch
            value={localPrefs.prefersNearFood}
            onValueChange={(value) =>
              setLocalPrefs({ ...localPrefs, prefersNearFood: value })
            }
            thumbColor={localPrefs.prefersNearFood ? colors.accentGold : '#f4f3f4'}
            trackColor={{ false: colors.border, true: colors.primaryMaroon }}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, styles.primaryButton]}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>Save preferences</Text>
      </TouchableOpacity>

      {showConfirmation && (
        <Text style={styles.confirmationText}>Preferences saved!</Text>
      )}
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
    marginBottom: 24,
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
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textGrey,
    marginBottom: 12,
  },
  noiseOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  noiseButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  noiseButtonSelected: {
    backgroundColor: colors.primaryMaroon,
  },
  noiseButtonUnselected: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noiseButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  noiseButtonTextSelected: {
    color: '#FFFFFF',
  },
  noiseButtonTextUnselected: {
    color: colors.textGrey,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textGrey,
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 12,
    color: colors.textGrey,
    opacity: 0.7,
  },
  saveButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: colors.primaryMaroon,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmationText: {
    fontSize: 12,
    color: colors.textGrey,
    textAlign: 'center',
    marginTop: 12,
  },
});


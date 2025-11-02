import { NEWS_SOURCES } from '@/types/news';
import { Image } from 'expo-image';
import { useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface NewsSourceSelectorProps {
  selectedSources: Set<string>;
  onToggleSource: (sourceId: string) => void;
  onExclusiveSelect: (sourceId: string) => void;
}

export function NewsSourceSelector({ selectedSources, onToggleSource, onExclusiveSelect }: NewsSourceSelectorProps) {
  const lastTapRef = useRef<{ id: string; time: number } | null>(null);
  const DOUBLE_TAP_DELAY = 300;

  const handlePress = (sourceId: string) => {
    const now = Date.now();
    const lastTap = lastTapRef.current;

    if (lastTap && lastTap.id === sourceId && now - lastTap.time < DOUBLE_TAP_DELAY) {
      // Double tap detected
      onExclusiveSelect(sourceId);
      lastTapRef.current = null;
    } else {
      // Single tap
      onToggleSource(sourceId);
      lastTapRef.current = { id: sourceId, time: now };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.gridContent}>
        {NEWS_SOURCES.map(source => (
          <TouchableOpacity
            key={source.id}
            onPress={() => handlePress(source.id)}
            style={[
              styles.sourceButton,
              selectedSources.has(source.id) && styles.sourceButtonSelected,
            ]}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: source.logoUrl }}
              style={styles.sourceLogo}
              contentFit="contain"
            />
            {selectedSources.has(source.id) && (
              <View style={styles.selectedIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 51, 51, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  gridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  sourceButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
  },
  sourceButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#252525',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  sourceLogo: {
    width: 34,
    height: 34,
  },
  selectedIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
});

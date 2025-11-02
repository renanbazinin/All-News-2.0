import { ThemedText } from '@/components/themed-text';
import { DisplayMode } from '@/types/news';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface NewsControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  displayMode: DisplayMode;
  onDisplayModeChange: (mode: DisplayMode) => void;
  fontSize: number;
  onFontSizeChange: (delta: number) => void;
  onRefresh: () => void;
  loading: boolean;
  lastUpdate: Date | null;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
}

export function NewsControls({
  searchQuery,
  onSearchChange,
  displayMode,
  onDisplayModeChange,
  fontSize,
  onFontSizeChange,
  onRefresh,
  loading,
  lastUpdate,
  autoRefresh,
  onToggleAutoRefresh,
}: NewsControlsProps) {
  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search news..."
        placeholderTextColor="#b8b8b8"
        value={searchQuery}
        onChangeText={onSearchChange}
      />

      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[styles.modeButton, displayMode === 'list' && styles.modeButtonActive]}
          onPress={() => onDisplayModeChange('list')}
        >
          <ThemedText style={[styles.modeButtonText, displayMode === 'list' && styles.modeButtonTextActive]}>
            List
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, displayMode === 'card' && styles.modeButtonActive]}
          onPress={() => onDisplayModeChange('card')}
        >
          <ThemedText style={[styles.modeButtonText, displayMode === 'card' && styles.modeButtonTextActive]}>
            Cards
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fontButton}
          onPress={() => onFontSizeChange(1)}
        >
          <ThemedText style={styles.fontButtonText}>A+</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fontButton}
          onPress={() => onFontSizeChange(-1)}
        >
          <ThemedText style={styles.fontButtonText}>A-</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.refreshContainer}>
        <TouchableOpacity
          style={[styles.refreshButton, loading && styles.refreshButtonLoading]}
          onPress={onRefresh}
          disabled={loading}
        >
          <ThemedText style={styles.refreshButtonText}>
            {loading ? '↻ Refreshing...' : '↻ Refresh'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.autoRefreshButton, autoRefresh && styles.autoRefreshButtonActive]}
          onPress={onToggleAutoRefresh}
        >
          <ThemedText style={[styles.autoRefreshText, autoRefresh && styles.autoRefreshTextActive]}>
            ⏱ Auto
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.lastUpdateText} numberOfLines={1}>
          {lastUpdate ? formatTime(lastUpdate) : '--:--:--'}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  searchInput: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 24,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#b8b8b8',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  fontButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FF9500',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  refreshContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    gap: 8,
  },
  refreshButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  refreshButtonLoading: {
    opacity: 0.6,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  autoRefreshButton: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#555',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
  },
  autoRefreshButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  autoRefreshText: {
    color: '#b8b8b8',
    fontSize: 13,
    fontWeight: '600',
  },
  autoRefreshTextActive: {
    color: '#fff',
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#b8b8b8',
    flex: 1,
    textAlign: 'right',
  },
});

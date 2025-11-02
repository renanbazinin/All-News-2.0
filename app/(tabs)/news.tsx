import { NewsControls } from '@/components/news/news-controls';
import { NewsList } from '@/components/news/news-list';
import { NewsSourceSelector } from '@/components/news/news-source-selector';
import { ThemedView } from '@/components/themed-view';
import { useNews } from '@/hooks/use-news';
import { DisplayMode } from '@/types/news';
import { useCallback, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NewsScreen() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('list');
  const [fontSize, setFontSize] = useState(16);
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  // Measure dynamic heights so list content is never hidden behind overlays
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [controlsHeightStatic, setControlsHeightStatic] = useState(0);

  const {
    selectedSources,
    loading,
    lastUpdate,
    searchQuery,
    error,
    autoRefresh,
    setSearchQuery,
    toggleSource,
    selectExclusiveSource,
    toggleAutoRefresh,
    refreshNews,
    getFilteredNews,
  } = useNews();

  const handleFontSizeChange = (delta: number) => {
    setFontSize(prev => {
      const newSize = prev + delta;
      // Clamp between 12 and 24
      return Math.max(12, Math.min(24, newSize));
    });
  };

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  }, [scrollY]);

  // Smooth interpolations for navbar scaling
  // 0-150px scroll range
  const navbarScale = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0.7], // Shrink to 70%
    extrapolate: 'clamp',
  });

  const navbarBgOpacity = scrollY.interpolate({
    inputRange: [0, 50, 150],
    outputRange: [1, 0.7, 0.3], // Background becomes more transparent
    extrapolate: 'clamp',
  });

  const controlsOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.5, 0], // Fade out controls
    extrapolate: 'clamp',
  });

  const controlsHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0], // Collapse height
    extrapolate: 'clamp',
  });

  const filteredNews = getFilteredNews();

  const navbarBackgroundColor = navbarBgOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(26, 26, 26, 0)', 'rgba(26, 26, 26, 1)'],
  });

  return (
    <ThemedView style={styles.container}>
      {/* News list in background with dynamic top padding so nothing is cut off */}
      <NewsList
        news={filteredNews}
        displayMode={displayMode}
        loading={loading}
        onRefresh={refreshNews}
        fontSize={fontSize}
        onScroll={handleScroll}
        contentTopPadding={insets.top + navbarHeight + controlsHeightStatic + 12}
      />

      {/* Navbar overlaid on top */}
      <Animated.View
        onLayout={(e) => setNavbarHeight(e.nativeEvent.layout.height)}
        style={[
          styles.navbarContainer,
          {
            top: insets.top,
            transform: [{ scaleY: navbarScale }],
            backgroundColor: navbarBackgroundColor,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 8,
          },
        ]}
      >
        <NewsSourceSelector
          selectedSources={selectedSources}
          onToggleSource={toggleSource}
          onExclusiveSelect={selectExclusiveSource}
        />
      </Animated.View>
      
      {/* Controls overlaid below navbar */}
      <Animated.View
        onLayout={(e) => setControlsHeightStatic(e.nativeEvent.layout.height)}
        style={[
          styles.controlsContainer,
          {
            top: insets.top + navbarHeight,
            opacity: controlsOpacity,
            transform: [{ scaleY: controlsHeight }],
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          },
        ]}
      >
        <NewsControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          displayMode={displayMode}
          onDisplayModeChange={setDisplayMode}
          fontSize={fontSize}
          onFontSizeChange={handleFontSizeChange}
          onRefresh={refreshNews}
          loading={loading}
          lastUpdate={lastUpdate}
          autoRefresh={autoRefresh}
          onToggleAutoRefresh={toggleAutoRefresh}
        />
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  navbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  controlsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 99,
    backgroundColor: 'rgba(26, 26, 26, 0.92)',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
});

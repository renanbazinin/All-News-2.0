import { ThemedText } from '@/components/themed-text';
import { DisplayMode, NEWS_SOURCES, NewsItem } from '@/types/news';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { NewsCard } from './news-card';

interface NewsListProps {
  news: NewsItem[];
  displayMode: DisplayMode;
  loading: boolean;
  onRefresh: () => void;
  fontSize: number;
  onScroll?: (event: any) => void;
  contentTopPadding?: number;
}

export function NewsList({ news, displayMode, loading, onRefresh, fontSize, onScroll, contentTopPadding }: NewsListProps) {
  const isHebrewSource = (newsType: string) => {
    const source = NEWS_SOURCES.find(s => s.name === newsType);
    return source?.isHebrew ?? false;
  };

  if (loading && news.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Loading news...</ThemedText>
      </View>
    );
  }

  if (news.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText style={styles.emptyText}>No news found</ThemedText>
        <ThemedText style={styles.emptySubtext}>
          Try selecting different sources or adjusting your search
        </ThemedText>
      </View>
    );
  }

  return (
    <FlatList
      data={news}
      keyExtractor={(item, index) => `${item.link}-${index}`}
      renderItem={({ item }) => (
        <NewsCard
          item={item}
          mode={displayMode}
          isHebrew={isHebrewSource(item.newsType)}
        />
      )}
      contentContainerStyle={[styles.listContent, { paddingTop: contentTopPadding ?? 300 }]}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor="#007AFF"
          colors={['#007AFF']}
        />
      }
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#b8b8b8',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#b8b8b8',
    textAlign: 'center',
  },
});

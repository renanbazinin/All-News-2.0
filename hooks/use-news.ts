import { NEWS_SOURCES, NewsItem, NewsSource } from '@/types/news';
import { useCallback, useEffect, useState } from 'react';

const API_BASE_URL = 'https://allnews-server.onrender.com';

export function useNews() {
  const [newsData, setNewsData] = useState<Record<string, NewsItem[]>>({});
  const [selectedSources, setSelectedSources] = useState<Set<string>>(
    new Set(NEWS_SOURCES.map(source => source.id))
  );
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchNewsForSource = async (source: NewsSource): Promise<void> => {
    if (!selectedSources.has(source.id)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${source.endpoint}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${source.name}`);
      }
      const items: NewsItem[] = await response.json();
      
      setNewsData(prev => ({
        ...prev,
        [source.id]: items.map(item => ({ ...item, newsType: source.name })),
      }));
    } catch (err) {
      console.error(`Error fetching ${source.name}:`, err);
      throw err;
    }
  };

  const fetchAllNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    const errors: string[] = [];

    try {
      const sourcesToFetch = NEWS_SOURCES.filter(source =>
        selectedSources.has(source.id)
      );

      await Promise.allSettled(
        sourcesToFetch.map(async source => {
          try {
            await fetchNewsForSource(source);
          } catch (err) {
            errors.push(source.name);
          }
        })
      );

      if (errors.length > 0) {
        setError(`Failed to fetch: ${errors.join(', ')}`);
      } else {
        setLastUpdate(new Date());
      }
    } finally {
      setLoading(false);
    }
  }, [selectedSources]);

  const toggleSource = useCallback((sourceId: string) => {
    setSelectedSources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sourceId)) {
        newSet.delete(sourceId);
        // Remove news data for deselected source
        setNewsData(current => {
          const updated = { ...current };
          delete updated[sourceId];
          return updated;
        });
      } else {
        newSet.add(sourceId);
        // Fetch news for newly selected source
        const source = NEWS_SOURCES.find(s => s.id === sourceId);
        if (source) {
          fetchNewsForSource(source);
        }
      }
      return newSet;
    });
  }, []);

  const selectExclusiveSource = useCallback((sourceId: string) => {
    // Clear all other sources
    setSelectedSources(new Set([sourceId]));
    
    // Clear all news data and fetch only the selected source
    setNewsData({});
    const source = NEWS_SOURCES.find(s => s.id === sourceId);
    if (source) {
      fetchNewsForSource(source);
    }
  }, []);

  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, []);

  const getAllNews = useCallback((): NewsItem[] => {
    const allItems: NewsItem[] = [];
    
    Object.values(newsData).forEach(items => {
      allItems.push(...items);
    });

    // Sort by date, newest first
    return allItems.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return dateB - dateA;
    });
  }, [newsData]);

  const getFilteredNews = useCallback((): NewsItem[] => {
    const allNews = getAllNews();
    
    if (!searchQuery.trim()) {
      return allNews;
    }

    const query = searchQuery.toLowerCase();
    return allNews.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.newsType.toLowerCase().includes(query)
    );
  }, [getAllNews, searchQuery]);

  // Initial fetch
  useEffect(() => {
    fetchAllNews();
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchAllNews();
      }, 30000); // 30 seconds
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [autoRefresh, fetchAllNews]);

  return {
    newsData,
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
    refreshNews: fetchAllNews,
    getFilteredNews,
  };
}

import { ThemedText } from '@/components/themed-text';
import { NewsItem } from '@/types/news';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

interface NewsCardProps {
  item: NewsItem;
  mode: 'list' | 'card';
  isHebrew: boolean;
}

export function NewsCard({ item, mode, isHebrew }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handlePress = () => {
    if (mode === 'list') {
      setExpanded(!expanded);
    }
  };

  const handleLinkPress = async () => {
    try {
      if (Platform.OS === 'web') {
        window.open(item.link, '_blank');
      } else {
        await WebBrowser.openBrowserAsync(item.link);
      }
    } catch (error) {
      console.error('Error opening link:', error);
      // Fallback to Linking
      Linking.openURL(item.link);
    }
  };

  // Strip HTML tags from description
  const cleanDescription = (text: string | undefined): string => {
    if (!text) return '';
    // Remove HTML tags and entities
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  };

  const containerStyle = mode === 'list' ? styles.listContainer : styles.cardContainer;
  const textAlign = isHebrew ? 'right' : 'left';
  const writingDirection = isHebrew ? 'rtl' : 'ltr';

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
      activeOpacity={mode === 'list' ? 0.7 : 1}
    >
      {mode === 'card' && item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.cardImage}
          contentFit="cover"
        />
      )}
      
      <View style={styles.content}>
        <View style={[styles.header, { flexDirection: isHebrew ? 'row-reverse' : 'row' }]}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.source, { textAlign }]}
          >
            {item.newsType}
          </ThemedText>
          <ThemedText style={[styles.time, { textAlign }]}>
            {formatTime(item.pubDate)}
          </ThemedText>
        </View>

        <ThemedText
          type="subtitle"
          style={[
            styles.title,
            { textAlign, writingDirection: writingDirection as any },
          ]}
          numberOfLines={mode === 'list' && !expanded ? 2 : undefined}
        >
          {item.title}
        </ThemedText>

        {item.description && (mode === 'card' || expanded) && (
          <ThemedText
            style={[
              styles.description,
              { textAlign, writingDirection: writingDirection as any },
            ]}
            numberOfLines={mode === 'card' ? 3 : undefined}
          >
            {cleanDescription(item.description)}
          </ThemedText>
        )}

        <TouchableOpacity
          onPress={handleLinkPress}
          style={styles.linkButton}
        >
          <ThemedText style={styles.linkText}>
            Read more
          </ThemedText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#252525',
  },
  content: {
    padding: 16,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  source: {
    color: '#007AFF',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  time: {
    color: '#b8b8b8',
    fontSize: 12,
  },
  title: {
    marginBottom: 8,
    lineHeight: 24,
    color: '#ffffff',
  },
  description: {
    color: '#e0e0e0',
    marginBottom: 12,
    lineHeight: 20,
  },
  linkButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  linkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

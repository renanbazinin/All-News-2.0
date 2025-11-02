import { Image } from 'expo-image';
import { Linking, StyleSheet, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AboutScreen() {
  const handleEmailPress = () => {
    Linking.openURL('mailto:renanthestudent@gmail.com');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/myLogo.png')}
          style={styles.logo}
          contentFit="contain"
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText>
          Multi-source news aggregator with 9 trusted sources.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Contact</ThemedText>
        <TouchableOpacity onPress={handleEmailPress}>
          <ThemedText style={styles.email}>renanthestudent@gmail.com</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    gap: 8,
    marginBottom: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
  },
  logo: {
    height: 200,
    width: 200,
    bottom: 0,
    left: '50%',
    marginLeft: -100,
    position: 'absolute',
  },
  email: {
    color: '#2e78b7',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

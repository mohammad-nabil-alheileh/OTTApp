import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { VODList } from './components/VODList/VODList';
import { mockVODData } from './services/mockData';
import { VODItem } from './types/vod';
import { styles } from './App.styles';

export default function App() {
  const [vodList, setVodList] = useState<VODItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVodList(mockVODData);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSelectVOD = (vod: VODItem) => {
    console.log('Selected VOD:', vod.title);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>OTT TV App</Text>
        <Text style={styles.subtitle}>Videos & Live Channels</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VODList
          vodList={vodList}
          onSelectVOD={handleSelectVOD}
          isLoading={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

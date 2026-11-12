import React, { useCallback, useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ContinueListeningRail } from '../ContinueListeningRail/ContinueListeningRail';
import { FocusGroup } from '../FocusGroup/FocusGroup';
import { PodcastRail } from '../PodcastRail/PodcastRail';
import { useBackHandler } from '../../hooks/useBackHandler';
import { groupByCategory } from '../../services/podcasts';
import { styles } from './ListenScreen.styles';
import { ListenScreenProps } from './ListenScreen.types';

// Audio landing page: Continue Listening, then one podcast rail per category.
export const ListenScreen: React.FC<ListenScreenProps> = ({
  podcasts,
  isLoading,
  continueListening,
  onSelectPodcast,
  onPlayEpisode,
  onBack,
}) => {
  const categories = useMemo(() => groupByCategory(podcasts), [podcasts]);
  const hasContinue = continueListening.length > 0;

  const handleBack = useCallback(() => {
    onBack();
    return true;
  }, [onBack]);
  useBackHandler(handleBack);

  let body: React.ReactNode;
  if (isLoading) {
    body = (
      <View style={styles.message}>
        <Text style={styles.messageText}>Loading podcasts...</Text>
      </View>
    );
  } else if (podcasts.length === 0) {
    body = (
      <View style={styles.message}>
        <Text style={styles.messageText}>No podcasts available yet.</Text>
      </View>
    );
  } else {
    body = (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hasContinue && (
          <FocusGroup>
            <ContinueListeningRail
              items={continueListening}
              onPlayEpisode={onPlayEpisode}
              autoFocus
            />
          </FocusGroup>
        )}
        {categories.map(({ category, podcasts: items }, index) => (
          <FocusGroup key={category}>
            <PodcastRail
              groupId={`podcast-rail-${category}`}
              title={category}
              podcasts={items}
              onSelectPodcast={onSelectPodcast}
              autoFocus={!hasContinue && index === 0}
            />
          </FocusGroup>
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Listen</Text>
        <Text style={styles.subtitle}>Podcasts & Audio</Text>
      </View>
      {body}
    </View>
  );
};

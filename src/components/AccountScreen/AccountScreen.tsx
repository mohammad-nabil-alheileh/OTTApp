import React, { useEffect } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { useBackHandler } from '../../hooks/useBackHandler';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { initialsOf } from '../../services/account';
import { FavoritesRail } from '../FavoritesRail/FavoritesRail';
import { AccountScreenProps } from './AccountScreen.types';
import { styles } from './AccountScreen.styles';

export const AccountScreen: React.FC<AccountScreenProps> = ({
  profile,
  favorites,
  onSelectVOD,
  onBack,
}) => {
  const {
    containerRef: backContainerRef,
    getItemProps: getBackItemProps,
    focusFirst: focusBack,
  } = useFocusGroup('account-back', 1);
  // The profile has nothing to press, but the remote still needs somewhere to
  // land below Back: without a stop per section, Down dies on this page and
  // the favorites rail is unreachable.
  const profileGroup = useFocusGroup('account-profile', 1);
  const infoGroup = useFocusGroup('account-info', 1);
  const emptyGroup = useFocusGroup('account-empty', 1);

  useBackHandler(() => {
    onBack();
    return true;
  });

  // Back is the first stop, so leaving the page is always one press away.
  useEffect(() => {
    focusBack();
  }, [focusBack]);

  const backItemProps = getBackItemProps(0);
  const details = [
    { label: 'Plan', value: profile.plan },
    { label: 'Member since', value: profile.memberSince },
    { label: 'Devices', value: profile.devices },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View ref={backContainerRef}>
          <Pressable
            {...backItemProps}
            hasTVPreferredFocus
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Back"
            accessibilityHint="Closes account"
            style={({ focused }) => [
              styles.backButton,
              focused && styles.backButtonFocused,
            ]}
          >
            <Text style={styles.backChevron}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>
        <Text style={styles.headerTitle} accessibilityRole="header">
          Account
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.body}>
          <View ref={profileGroup.containerRef}>
            <Pressable
              {...profileGroup.getItemProps(0)}
              style={({ focused }) => [
                styles.profileCard,
                focused && styles.cardFocused,
              ]}
            >
              {/* Placeholder until a real profile photo is wired up. */}
              <View style={styles.avatar} aria-hidden>
                {profile.avatarUrl ? (
                  <Image
                    source={{ uri: profile.avatarUrl }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                    aria-hidden
                  />
                ) : (
                  <Text style={styles.avatarInitials}>
                    {initialsOf(profile.name)}
                  </Text>
                )}
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileEmail}>{profile.email}</Text>
              </View>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle} accessibilityRole="header">
            Account info
          </Text>
          <View ref={infoGroup.containerRef}>
            <Pressable
              {...infoGroup.getItemProps(0)}
              style={({ focused }) => [
                styles.detailsCard,
                focused && styles.cardFocused,
              ]}
            >
              {details.map((detail, index) => (
                <View
                  key={detail.label}
                  style={[
                    styles.detailRow,
                    index === details.length - 1 && styles.detailRowLast,
                  ]}
                >
                  <Text style={styles.detailLabel}>{detail.label}</Text>
                  <Text style={styles.detailValue}>{detail.value}</Text>
                </View>
              ))}
            </Pressable>
          </View>

          {favorites.length === 0 && (
            <View ref={emptyGroup.containerRef}>
              <Pressable
                {...emptyGroup.getItemProps(0)}
                style={({ focused }) => [
                  styles.emptyPanel,
                  focused && styles.cardFocused,
                ]}
              >
                <Text style={styles.emptyTitle} accessibilityRole="header">
                  Favorites
                </Text>
                <Text style={styles.emptyText}>
                  Nothing saved yet. Press Favorite on a title's details page
                  and it will show up here.
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {favorites.length > 0 && (
          <FavoritesRail items={favorites} onSelectVOD={onSelectVOD} />
        )}
      </ScrollView>
    </View>
  );
};

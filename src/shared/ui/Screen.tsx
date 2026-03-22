import React from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/shared/theme';
import { screenPadding } from '../lib/layout';
import type { ScreenProps } from '@/shared/types';

export function Screen({ children, scroll = false, padding, style }: ScreenProps) {
  const pad = padding ?? screenPadding();

  if (scroll) {
    return (
      <SafeAreaView style={[styles.container, style]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: pad }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingHorizontal: pad }, style]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
});

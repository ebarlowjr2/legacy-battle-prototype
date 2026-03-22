import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { colors } from '@/shared/theme';
import type { SplashVideoProps } from '@/shared/types';

export const SplashVideo: React.FC<SplashVideoProps> = ({ onFinish }) => {
  const didFinishRef = useRef(false);
  const finishOnce = useCallback(() => {
    if (didFinishRef.current) return;
    didFinishRef.current = true;
    onFinish();
  }, [onFinish]);

  const player = useVideoPlayer(require('../../../assets/videos/splash-video.mp4'), (instance) => {
    instance.loop = false;
    instance.play();
  });

  useEffect(() => {
    const endSub = player.addListener('playToEnd', () => {
      finishOnce();
    });

    const statusSub = player.addListener('statusChange', ({ status }) => {
      if (status === 'error') {
        finishOnce();
      }
    });

    // Safety net: never block app startup if playback events fail on a device.
    const failSafe = setTimeout(() => {
      finishOnce();
    }, 9000);

    return () => {
      endSub.remove();
      statusSub.remove();
      clearTimeout(failSafe);
    };
  }, [finishOnce, player]);

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        contentFit="cover"
        player={player}
        nativeControls={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  video: {
    flex: 1,
  },
});

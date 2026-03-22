import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { RPH, RPW, Sizes, verticalScale, horizontalScale, shadows } from '@/shared/theme';
import { AppText } from '@/shared/ui/atoms/AppText';
import type { ToastProps } from '@/shared/types';
import { TOAST_DURATION_MS } from '@/shared/constants';

const typeConfig = {
  success: { label: 'Success!', bgColor: '#17B26A' } as const,
  fail: { label: 'Error!', bgColor: '#FF0000' } as const,
};

export const Toast: React.FC<ToastProps> = ({ type, message, visible, onClose }) => {
  const windowHeight = Dimensions.get('window').height;
  const popAnim = useRef(new Animated.Value(windowHeight * -1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const config = typeConfig[type];

  useEffect(() => {
    if (visible) {
      popIn();
      startProgressBar();
    } else {
      popOut();
    }
  }, [visible]);

  const popIn = () => {
    Animated.timing(popAnim, {
      toValue: windowHeight * 0.35 * -1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const popOut = () => {
    Animated.timing(popAnim, {
      toValue: windowHeight * -1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const startProgressBar = () => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: TOAST_DURATION_MS,
      useNativeDriver: false,
    }).start(() => {
      onClose();
    });
  };

  const instantPopOut = () => {
    Animated.timing(popAnim, {
      toValue: windowHeight * -1,
      duration: 150,
      useNativeDriver: true,
    }).start(onClose);
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          backgroundColor: config.bgColor,
          transform: [{ translateY: popAnim }],
        },
      ]}
    >
      <View style={styles.toastRow}>
        <AntDesign
          name={type === 'success' ? 'check-circle' : 'close-circle'}
          size={Sizes.font22}
          color="#fff"
        />

        <View style={styles.toastText}>
          <AppText variant="label" color="#fff">
            {config.label}
          </AppText>
          <AppText variant="body2" color="rgba(255,255,255,0.85)">
            {message}
          </AppText>
        </View>

        <TouchableOpacity
          onPress={instantPopOut}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Entypo name="cross" size={Sizes.font22} color="#fff" />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['100%', '0%'],
            }),
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: RPH(50),
    alignSelf: 'center',
    transform: [{ translateX: -RPW(45) }],
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(16),
    width: RPW(90),
    justifyContent: 'center',
    borderRadius: Sizes.radius,
    overflow: 'hidden',
    ...shadows.md,
    elevation: 5,
  },
  toastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(12),
  },
  toastText: {
    flex: 1,
    gap: verticalScale(2),
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: verticalScale(4),
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
});

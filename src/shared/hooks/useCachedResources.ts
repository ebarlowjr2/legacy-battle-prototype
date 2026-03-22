import { useState, useEffect, useCallback } from 'react';
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import {
  Roboto_100Thin,
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

export type UseCachedResourcesResult = {
  isLoaded: boolean;
  isReady: boolean;
  onSplashFinish: () => void;
};

export const useCachedResources = (): UseCachedResourcesResult => {
  const [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Roboto_100Thin,
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      setIsLoadingComplete(true);
    }
  }, [fontsLoaded]);

  const onSplashFinish = useCallback(() => {
    setSplashDone(true);
  }, []);

  const isLoaded = isLoadingComplete;
  const isReady = isLoaded && splashDone;

  return {
    isLoaded,
    isReady,
    onSplashFinish,
  };
};

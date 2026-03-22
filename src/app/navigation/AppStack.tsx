import React from 'react';
import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {
  CreateBattleScreen,
  BattleDetailScreen,
  StartBattleScreen,
  BattleTypeScreen,
  BattleVisibilityScreen,
  StatDuelModeScreen,
  StatDuelDetailsScreen,
  StatDuelChampionScreen,
  StatDuelOpponentScreen,
  StatDuelConfirmScreen,
} from '@/features/battles';
import { FriendsScreen, AddFriendScreen } from '@/features/crew';
import { DevDebugScreen } from '@/features/profile';
import { AllResultsScreen, AllUpcomingGamesScreen } from '@/features/sports';
import { RootStackParamList } from './types';
import { MainTabs } from './BottomTab';

const Stack = createNativeStackNavigator<RootStackParamList>();
const headerOptions: NativeStackNavigationOptions = { headerShown: false };

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="CreateBattle" component={CreateBattleScreen} />
      <Stack.Screen name="BattleDetail" component={BattleDetailScreen} />
      <Stack.Screen name="AllResults" component={AllResultsScreen} />
      <Stack.Screen name="AllUpcomingGames" component={AllUpcomingGamesScreen} />
      <Stack.Screen name="StartBattle" component={StartBattleScreen} />
      <Stack.Screen name="BattleType" component={BattleTypeScreen} />
      <Stack.Screen name="DevDebug" component={DevDebugScreen} />
      <Stack.Screen name="Friends" component={FriendsScreen} />
      <Stack.Screen name="BattleVisibility" component={BattleVisibilityScreen} />
      <Stack.Screen name="AddFriend" component={AddFriendScreen} />
      <Stack.Screen name="StatDuelMode" component={StatDuelModeScreen} />
      <Stack.Screen name="StatDuelDetails" component={StatDuelDetailsScreen} />
      <Stack.Screen name="StatDuelChampion" component={StatDuelChampionScreen} />
      <Stack.Screen name="StatDuelOpponent" component={StatDuelOpponentScreen} />
      <Stack.Screen name="StatDuelConfirm" component={StatDuelConfirmScreen} />
    </Stack.Navigator>
  );
}

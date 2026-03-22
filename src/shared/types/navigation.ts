import type { GestureResponderEvent } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { BattleMode, StatDuelPlayer, StatDuelStatCategory, StatDuelOpponent } from './battle';

export type AuthStackParamList = {
  Login: undefined;
  EmailLogin: undefined;
  LoginWithBiometrics: undefined;
  SignUp: undefined;
  OTPVerification: { email: string; reference: string };
  ForgotPassword: undefined;
  VerifyResetOTP: { email: string; reference: string };
  ResetPassword: { reference: string };
  CreateUsername: undefined;
};

export type TabStackParamList = {
  Home: undefined;
  Battles: undefined;
  BattleNow: undefined;
  Explore: undefined;
  Profile: undefined;
};

/** Visibility passed through battle creation flow */
export type BattleVisibilityParam = 'private' | 'public' | 'crew';

/** Game shape used in stat duel navigation params (e.g. from MOCK_GAMES) */
export interface StatDuelGameParam {
  id: string;
  name: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  CreateBattle:
    | {
        prefillTitle?: string;
        prefillEventId?: string;
        prefillDescription?: string;
        homeTeam?: string;
        awayTeam?: string;
        visibility?: BattleVisibilityParam;
      }
    | undefined;
  BattleDetail: { battleId: string };
  AllResults: { initialSport?: string } | undefined;
  AllUpcomingGames:
    | { initialSport?: string; mode?: string }
    | undefined;
  StartBattle: undefined;
  BattleType: { visibility?: BattleVisibilityParam } | undefined;
  DevDebug: undefined;
  Friends: undefined;
  BattleVisibility:
    | {
        prefillTitle?: string;
        prefillEventId?: string;
        homeTeam?: string;
        awayTeam?: string;
      }
    | undefined;
  AddFriend: undefined;
  StatDuelMode: { visibility?: BattleVisibilityParam } | undefined;
  StatDuelDetails:
    | { visibility?: BattleVisibilityParam; battleMode?: BattleMode }
    | undefined;
  StatDuelChampion:
    | {
        visibility?: BattleVisibilityParam;
        battleMode?: BattleMode;
        sport?: string | null;
        game?: StatDuelGameParam | null;
        position?: string | null;
        positionName?: string;
      }
    | undefined;
  StatDuelOpponent:
    | {
        visibility?: BattleVisibilityParam;
        battleMode?: BattleMode;
        sport?: string | null;
        game?: StatDuelGameParam | null;
        position?: string | null;
        positionName?: string;
        player?: StatDuelPlayer | null;
        statCategory?: StatDuelStatCategory | null;
        stake?: string;
        direction?: string | null;
        directionName?: string;
      }
    | undefined;
  StatDuelConfirm:
    | {
        visibility?: BattleVisibilityParam;
        battleMode?: BattleMode;
        sport?: string | null;
        game?: StatDuelGameParam | null;
        player?: StatDuelPlayer | null;
        statCategory?: StatDuelStatCategory | null;
        stake?: string;
        opponent?: StatDuelOpponent | null;
      }
    | undefined;
};

export type AuthScreenProps<ScreenName extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, ScreenName>;

export type TabScreenProps<ScreenName extends keyof TabStackParamList> =
  BottomTabScreenProps<TabStackParamList, ScreenName>;

export type RootStackScreenProps<ScreenName extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, ScreenName>;

export type AppStackParamList = RootStackParamList;
export type TabParamList = TabStackParamList;

/** Props for the custom Battle Now tab bar button. */
export interface CustomTabBarButtonProps {
  onPress?: (e: GestureResponderEvent) => void;
}

/** Props for the MainTabs screen (tab navigator) when used inside the root stack. */
export type MainTabsScreenProps = RootStackScreenProps<'MainTabs'>;

// ─── Root stack screen props (typed navigation + route) ──────────────────────

export type BattleTypeScreenProps = RootStackScreenProps<'BattleType'>;
export type StartBattleScreenProps = RootStackScreenProps<'StartBattle'>;
export type CreateBattleScreenProps = RootStackScreenProps<'CreateBattle'>;
export type BattleDetailScreenProps = RootStackScreenProps<'BattleDetail'>;
export type BattleVisibilityScreenProps = RootStackScreenProps<'BattleVisibility'>;
export type StatDuelModeScreenProps = RootStackScreenProps<'StatDuelMode'>;
export type StatDuelDetailsScreenProps = RootStackScreenProps<'StatDuelDetails'>;
export type StatDuelChampionScreenProps = RootStackScreenProps<'StatDuelChampion'>;
export type StatDuelOpponentScreenProps = RootStackScreenProps<'StatDuelOpponent'>;
export type StatDuelConfirmScreenProps = RootStackScreenProps<'StatDuelConfirm'>;
export type AllResultsScreenProps = RootStackScreenProps<'AllResults'>;
export type AllUpcomingGamesScreenProps = RootStackScreenProps<'AllUpcomingGames'>;
export type FriendsScreenProps = RootStackScreenProps<'Friends'>;
export type AddFriendScreenProps = RootStackScreenProps<'AddFriend'>;

// ─── Auth stack screen props (typed navigation + route) ────────────────────

export type LoginWelcomeScreenProps = AuthScreenProps<'Login'>;
export type EmailLoginScreenProps = AuthScreenProps<'EmailLogin'>;
export type LoginWithBiometricsScreenProps = AuthScreenProps<'LoginWithBiometrics'>;
export type SignUpScreenProps = AuthScreenProps<'SignUp'>;
export type OTPVerificationScreenProps = AuthScreenProps<'OTPVerification'>;
export type CreateUsernameScreenProps = AuthScreenProps<'CreateUsername'>;
export type ForgotPasswordScreenProps = AuthScreenProps<'ForgotPassword'>;
export type VerifyResetOTPScreenProps = AuthScreenProps<'VerifyResetOTP'>;
export type ResetPasswordScreenProps = AuthScreenProps<'ResetPassword'>;

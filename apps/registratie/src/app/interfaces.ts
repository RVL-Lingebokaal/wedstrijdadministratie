import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  home: undefined;
  registration: { wedstrijdId: string };
};

export type NavigationProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

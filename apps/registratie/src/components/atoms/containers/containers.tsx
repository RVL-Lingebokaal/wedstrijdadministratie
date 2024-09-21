import { View } from 'react-native';
import { ReactNode } from 'react';

export function MultipleInputsContainer({ children }: { children: ReactNode }) {
  return (
    <View style={{ flex: 1, flexDirection: 'row', marginVertical: 20 }}>
      {children}
    </View>
  );
}

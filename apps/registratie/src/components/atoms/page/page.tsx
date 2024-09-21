import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { colors } from '../../../theme/colors';
import { Header } from '../typography/headings';

interface PageProps {
  children: ReactNode;
  title?: string;
}

export function Page({ children, title }: PageProps) {
  return (
    <View style={{ flex: 1 }}>
      {title ? (
        <View style={{ backgroundColor: colors.primary, padding: 20 }}>
          <Header text={title} />
        </View>
      ) : null}
      <View
        style={{
          padding: 20,
          gap: 10,
          paddingTop: 40,
          flex: 1,
          backgroundColor: colors.text,
        }}
      >
        {children}
      </View>
    </View>
  );
}

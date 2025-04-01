import { colors } from '../../../theme/colors';
import { Text } from 'react-native';

export interface TypographyProps {
  text: string;
  type: 'primary' | 'text';
}

export function HeaderXL({ text, type }: TypographyProps) {
  return (
    <Text style={{ fontSize: 50, fontWeight: 'bold', color: colors[type] }}>
      {text}
    </Text>
  );
}

export function Header({ text, type }: TypographyProps) {
  return (
    <Text style={{ fontSize: 35, fontWeight: 'bold', color: colors[type] }}>
      {text}
    </Text>
  );
}

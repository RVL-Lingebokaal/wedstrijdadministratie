import { colors } from '../../../theme/colors';
import { Text } from 'react-native';

export interface TypographyProps {
  text: string;
}

export function HeaderXL({ text }: TypographyProps) {
  return (
    <Text style={{ fontSize: 50, fontWeight: 'bold', color: colors.text }}>
      {text}
    </Text>
  );
}

export function Header({ text }: TypographyProps) {
  return (
    <Text style={{ fontSize: 35, fontWeight: 'bold', color: colors.text }}>
      {text}
    </Text>
  );
}

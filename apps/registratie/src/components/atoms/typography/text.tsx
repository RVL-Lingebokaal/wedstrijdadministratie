import { colors } from '../../../theme/colors';
import { TypographyProps } from './headings';
import { Text } from 'react-native';

interface TextProps extends TypographyProps {
  light?: boolean;
}

export function MainText({ text, light }: TextProps) {
  return (
    <Text
      style={{ fontSize: 20, color: light ? colors.text : colors.darkText }}
    >
      {text}
    </Text>
  );
}

export function LabelText({ text, light }: TextProps) {
  return (
    <Text
      style={{ fontSize: 16, color: light ? colors.text : colors.darkText }}
    >
      {text}
    </Text>
  );
}

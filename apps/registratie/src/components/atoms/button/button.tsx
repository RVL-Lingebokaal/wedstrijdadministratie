import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { borderColors, colors, textColors } from '../../../theme/colors';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'contained' | 'outlined';
  color?: 'primary' | 'secondary' | 'white';
  disabled?: boolean;
}

export function Button({
  onPress,
  title,
  disabled,
  variant,
  color = 'primary',
}: ButtonProps) {
  const styles = createStyles({
    color: colors[color],
    textColor: textColors[color],
    borderColor: borderColors[color],
  });

  return (
    <Pressable style={styles.button} onPress={onPress} disabled={disabled}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

interface CreateStylesProps {
  color: string;
  textColor: string;
  borderColor?: string;
}

const createStyles = ({ color, textColor, borderColor }: CreateStylesProps) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: color,
      borderColor: borderColor,
      borderWidth: borderColor ? 1 : 0,
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: textColor,
    },
  });

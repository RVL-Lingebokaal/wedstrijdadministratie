import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../../theme/colors';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'contained' | 'outlined';
  color?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  onPress,
  title,
  disabled,
  variant,
  color,
}: ButtonProps) {
  const styles = createStyles({
    color: colors[color || 'primary'],
    textColor: colors.text,
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
}

const createStyles = ({ color, textColor }: CreateStylesProps) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: color,
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: textColor,
    },
  });

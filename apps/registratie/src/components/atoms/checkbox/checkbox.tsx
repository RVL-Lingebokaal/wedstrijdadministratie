import { StyleSheet, Text, View } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import { colors } from '../../../theme/colors';

interface CheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

export function CustomCheckbox({ checked, label, onChange }: CheckboxProps) {
  return (
    <View style={styles.section}>
      <Checkbox
        style={styles.checkbox}
        value={checked}
        onValueChange={onChange}
      />
      <Text style={{ fontSize: 16, color: colors.darkText }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  checkbox: {
    margin: 8,
    marginRight: 16,
  },
});

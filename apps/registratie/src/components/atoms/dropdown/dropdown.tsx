import InputSelect from 'react-native-input-select';
import React from 'react';

interface DropdownProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  label: string;
}

export function Dropdown({
  options,
  selectedValue,
  onValueChange,
  label,
}: DropdownProps) {
  return (
    <InputSelect
      label={label}
      options={options}
      onValueChange={(value: any) => onValueChange(value)}
      selectedValue={selectedValue}
    />
  );
}

import { Select } from './select';
import { Gender, genders } from '@models';

interface SelectGenderProps {
  selectedValue: Gender;
  onChange: (g: Gender) => void;
  classNames?: string;
  label?: string;
  topClassNames?: string;
  disabled?: boolean;
}

export function SelectGender({
  selectedValue,
  onChange,
  classNames,
  label,
  topClassNames,
  disabled,
}: SelectGenderProps) {
  return (
    <Select
      items={genders.map((g) => ({
        id: g,
        text: translateGender(g),
      }))}
      selectedValue={selectedValue}
      onChange={(val: string) => onChange(val as Gender)}
      classNames={classNames}
      label={label}
      topClassNames={topClassNames}
      disabled={disabled}
    />
  );
}

function translateGender(gender: Gender) {
  switch (gender) {
    case 'male':
      return 'Mannen';
    case 'female':
      return 'Vrouwen';
    case 'mix':
      return 'Mix';
    default:
      return 'Open';
  }
}

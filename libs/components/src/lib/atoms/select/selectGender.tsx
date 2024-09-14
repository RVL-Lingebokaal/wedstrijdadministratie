import { Select } from './select';
import { Gender } from '@models';

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
      items={Object.values(Gender).map((g) => ({
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
    case Gender.M:
      return 'Mannen';
    case Gender.F:
      return 'Vrouwen';
    default:
      return 'Mix';
  }
}

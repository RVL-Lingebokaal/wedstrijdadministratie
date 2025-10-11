import {
  FieldValues,
  Path,
  useController,
  useFormContext,
} from 'react-hook-form';
import { StyledRadioGroup } from '@components';

interface RadioGroupControllerProps<T extends FieldValues, A> {
  path: Path<T>;
  items: { label: string; value: A }[];
}

export function RadioGroupController<T extends FieldValues, A>({
  path,
  items,
}: RadioGroupControllerProps<T, A>) {
  const { control } = useFormContext<T>();
  const { field } = useController<T>({ name: path, control });

  return (
    <StyledRadioGroup
      items={items}
      selected={field.value}
      onChange={field.onChange}
    />
  );
}

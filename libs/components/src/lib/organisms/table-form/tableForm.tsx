'use client';
import { GridHeader } from '../../atoms/grid-header/gridHeader';
import { GridRow } from '../../atoms/grid-row/gridRow';
import {
  ArrayPath,
  Controller,
  ControllerRenderProps,
  DefaultValues,
  FieldArrayWithId,
  FieldPath,
  FieldValues,
  Path,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { Button } from '../../atoms/button/button';
import { AgeForm, BoatForm } from '@models';
import { ReactElement } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { ZodType } from 'zod';

export type Form = BoatForm | AgeForm;

interface RowHeaderItem<T extends Form> {
  input?: (field: ControllerRenderProps<FieldValues, Path<T>>) => ReactElement;
  getValue?: (field: FieldArrayWithId<T, ArrayPath<T>>) => string;
  name: FieldPath<T['items'][0]>;
}

interface TableFormProps<T extends Form> {
  onSubmit: (val: any) => void;
  schema: ZodType<Form, FieldValues>;
  defaultValues: DefaultValues<T>;
  gridHeaderItems: string[];
  rowInputs: RowHeaderItem<T>[];
}

export function TableForm<T extends Form>({
  onSubmit,
  schema,
  defaultValues,
  rowInputs,
  gridHeaderItems,
}: TableFormProps<T>) {
  const { handleSubmit, control, getValues } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
    mode: 'all',
  });
  const { fields } = useFieldArray({
    control,
    name: 'items',
  });

  return (
    <div className="w-full flex">
      <form onSubmit={handleSubmit(() => onSubmit(getValues()))}>
        <div className="mx-4 w-full">
          <div className="flex">
            <GridHeader
              items={gridHeaderItems}
              needsRounding
              classNames="w-4/5"
            />
            <Button
              name="Opslaan"
              color="highlight"
              type="submit"
              classNames=" flex items-center my-1 max-h-14"
            />
          </div>

          {fields.map((field, index) => (
            <GridRow
              key={field.id}
              items={rowInputs.map(({ name, input, getValue }) => ({
                node: input ? (
                  <Controller
                    control={control}
                    name={`items.${index}.${String(name)}` as Path<T>}
                    render={({ field }) => input(field)}
                  />
                ) : (
                  getValue?.(field as FieldArrayWithId<T, ArrayPath<T>>) ?? ''
                ),
                isInput: Boolean(input),
              }))}
              lastRow={index === fields.length - 1}
              classNames="w-4/5"
            />
          ))}
        </div>
      </form>
    </div>
  );
}

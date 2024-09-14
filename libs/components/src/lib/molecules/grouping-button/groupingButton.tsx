'use client';
import { Button, ErrorModal, FormModal, Input } from '@components/server';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { groupingClassSchema } from '@schemas';

interface GroupingButtonProps {
  selectedIndexes: Set<number>;
  onSaveName: (name: string) => void;
}

interface GroupingForm {
  name: string;
}

export function GroupingButton({
  selectedIndexes,
  onSaveName,
}: GroupingButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const { handleSubmit, control } = useForm<GroupingForm>({
    resolver: yupResolver(groupingClassSchema),
    defaultValues: { name: '' },
    mode: 'onSubmit',
  });

  const onClick = useCallback(() => {
    let isCorrect = false;
    if (selectedIndexes.size === 1) isCorrect = true;
    if (selectedIndexes.size > 1) {
      const indexesArray = Array.from(selectedIndexes.values());
      const sortedArray = indexesArray.sort();
      isCorrect = sortedArray.every((val, index) =>
        index === 0 ? true : val === sortedArray[index - 1] + 1
      );
    }

    setIsError(!isCorrect);
    setShowModal(isCorrect);
  }, [selectedIndexes]);

  const onSubmit = useCallback(
    (val: GroupingForm) => {
      onSaveName(val.name);
      setShowModal(false);
    },
    [onSaveName]
  );

  return (
    <>
      {isError && (
        <ErrorModal
          onClose={() => setIsError(false)}
          text="Het is niet mogelijk om klassen te groeperen die niet naast elkaar liggen"
        />
      )}
      {showModal && (
        <FormModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit(onSubmit)}
          title="Naam"
          description="Geef hieronder een naam voor de klassen die je net hebt geselecteerd."
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input label="Naam" {...field} />}
          />
        </FormModal>
      )}
      <Button
        name="Groepeer"
        color="highlight"
        classNames="mt-1 ml-1"
        onClick={onClick}
      />
    </>
  );
}

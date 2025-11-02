'use client';
import { Button, ConfirmModal } from '@components/server';
import { useRemoveClassItem } from '@hooks';
import { useCallback, useState } from 'react';
import { ClassItem, WedstrijdIdProps } from '@models';

interface RemoveGroupingButtonProps extends WedstrijdIdProps {
  group: ClassItem;
  classes: ClassItem[];
  refetch: () => void;
}

export function RemoveGroupingButton({
  group,
  classes,
  refetch,
  wedstrijdId,
}: RemoveGroupingButtonProps) {
  const { mutate } = useRemoveClassItem(wedstrijdId);
  const [showModal, setShowModal] = useState(false);

  const onClick = useCallback(() => setShowModal(true), []);

  const onConfirm = useCallback(() => {
    mutate(group);
    const index = classes.findIndex(
      ({ gender, name, boatType }) =>
        gender === group.gender &&
        name === group.name &&
        boatType === group.boatType
    );
    classes.splice(index, 1);
    refetch();
    setShowModal(false);
  }, [classes, group, mutate, refetch]);

  return (
    <>
      {showModal && (
        <ConfirmModal
          onClose={() => setShowModal(false)}
          text={`Weet je zeker dat je de groep ${group.name} wil verwijderen?`}
          title="Bevestig"
          onClick={onConfirm}
        />
      )}
      <Button
        onClick={onClick}
        classNames="mt-1 ml-1 flex items-center"
        name="Verwijderen"
        color="highlightReverse"
      />
    </>
  );
}

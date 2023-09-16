import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../../atoms/input/input";
import { Button } from "../../atoms/button/button";
import { useCallback } from "react";
import { TeamAddForm } from "../team-add-button/teamAddButton";

interface ParticipantForm {
  name: string;
  club: string;
  birthYear: number;
}

interface AddParticipantFormProps {
  addParticipant: (val: ParticipantForm, index: number) => void;
  index: number;
}

export function AddParticipantForm({
  index,
  addParticipant,
}: AddParticipantFormProps) {
  const { control, watch } = useFormContext<TeamAddForm>();
  const participant = watch(`participants.${index}`);
  const onClick = useCallback(
    () => addParticipant(participant, index),
    [addParticipant, index, participant]
  );

  return (
    <div className="rounded-md border border-gray-300 p-2 my-3">
      <div className="flex gap-x-3">
        <Controller
          name={`participants.${index}.name`}
          control={control}
          render={({ field }) => <Input label="Naam" {...field} />}
        />
        <Controller
          name={`participants.${index}.club`}
          control={control}
          render={({ field }) => <Input label="Vereniging" {...field} />}
        />
        <Controller
          name={`participants.${index}.birthYear`}
          control={control}
          render={({ field }) => <Input label="Geboortejaar" {...field} />}
        />
      </div>
      <Button
        classNames="mt-3"
        name="Voeg toe"
        color="primary"
        onClick={onClick}
        disabled={
          !(participant?.name && participant?.club && participant?.birthYear)
        }
      />
    </div>
  );
}

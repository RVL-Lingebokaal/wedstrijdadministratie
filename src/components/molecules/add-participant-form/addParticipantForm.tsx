import { useFormContext } from "react-hook-form";
import { Button } from "../../atoms/button/button";
import { useCallback } from "react";
import { TeamAddForm } from "../../organisms/team/team-add-button/teamAddButton";
import InputController from "../../atoms/input/inputController";

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
        <InputController<TeamAddForm>
          path={`participants.${index}.name`}
          control={control}
          label="Naam"
          classNames="mt-2"
        />
        <InputController<TeamAddForm>
          path={`participants.${index}.club`}
          control={control}
          label="Vereniging"
          classNames="mt-2"
        />
        <InputController<TeamAddForm>
          path={`participants.${index}.birthYear`}
          control={control}
          label="Geboortejaar"
          classNames="mt-2"
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

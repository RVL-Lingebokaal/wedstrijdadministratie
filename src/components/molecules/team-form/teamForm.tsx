import SelectController from "../../atoms/select/selectController";
import { BoatType } from "../../../models/settings";
import InputController from "../../atoms/input/inputController";
import { Button } from "../../atoms/button/button";
import { AddParticipantForm } from "../add-participant-form/addParticipantForm";
import { IconButton } from "../../atoms/button/iconButton";
import { FaTrashAlt } from "react-icons/fa";
import {
  getDisabled,
  TeamAddForm,
} from "../../organisms/team/team-add-button/teamAddButton";
import {
  Control,
  useFieldArray,
  UseFormGetValues,
  UseFormWatch,
} from "react-hook-form";
import { useCallback, useState } from "react";

interface TeamFormProps {
  control: Control<TeamAddForm>;
  watch: UseFormWatch<TeamAddForm>;
  getValues: UseFormGetValues<TeamAddForm>;
  setError: (val: string | null) => void;
  isUpdate?: boolean;
}

export default function TeamForm({
  control,
  watch,
  getValues,
  setError,
  isUpdate,
}: TeamFormProps) {
  const [showAddParticipant, setShowAddParticipant] = useState(false);

  const boatType = watch("boatType");
  const club = watch("club");
  const { fields, append, remove } = useFieldArray<TeamAddForm>({
    control,
    name: "participants",
  });

  const onClick = useCallback(
    (val: TeamAddForm["participants"][0], index: number) => {
      remove(index);
      append(val);
      setShowAddParticipant(false);
    },
    [append, remove]
  );

  return (
    <>
      <div className="flex gap-x-3">
        <SelectController
          path="boatType"
          control={control}
          label="Boottype"
          topClassNames="grow"
          items={Object.values(BoatType).map((val) => ({ id: val }))}
          disabled={isUpdate}
        />
        <SelectController
          path="preferredBlock"
          control={control}
          label="Voorkeursblok"
          topClassNames="grow"
          items={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        />
        <SelectController
          path="gender"
          control={control}
          label="Geslacht"
          topClassNames="grow"
          isGender
        />
      </div>
      <div className="flex gap-x-3">
        <InputController
          disabled={isUpdate}
          path="name"
          control={control}
          label="Team naam"
        />
        <InputController path="club" control={control} label="Vereniging" />
        <InputController path="boat" control={control} label="Boot naam" />
      </div>
      {boatType !== BoatType.skiff && boatType !== BoatType.boardTwoWithout && (
        <div className="flex gap-x-3">
          <InputController
            path="helm.name"
            control={control}
            label="Naam stuur"
          />
          <InputController
            path="helm.club"
            control={control}
            label="Vereniging stuur"
          />
          <InputController
            path="helm.birthYear"
            control={control}
            label="Geboortejaar stuur"
          />
        </div>
      )}
      {!isUpdate && (
        <Button
          name="Voeg deelnemer toe"
          color="primary"
          disabled={showAddParticipant || getDisabled(boatType, fields.length)}
          onClick={() => {
            setShowAddParticipant(true);
            append({ name: "", club, birthYear: 1999 });
            setError(null);
          }}
          classNames="my-3"
        />
      )}
      {showAddParticipant && !isUpdate && (
        <AddParticipantForm
          addParticipant={onClick}
          index={getValues("participants").length - 1}
        />
      )}
      {fields.map((field, index) =>
        field.name ? (
          <div key={field.id} className="grid grid-cols-3 gap-x-3">
            <div>
              {isUpdate ? (
                <InputController<TeamAddForm>
                  path={`participants.${index}.name`}
                  control={control}
                />
              ) : (
                <>
                  <IconButton
                    icon={<FaTrashAlt />}
                    onClick={() => remove(index)}
                    classNames="mr-2"
                  />
                  {index + 1}. {field.name}
                </>
              )}
            </div>
            {isUpdate ? (
              <InputController<TeamAddForm>
                path={`participants.${index}.club`}
                control={control}
              />
            ) : (
              <div>{field.club}</div>
            )}
            {isUpdate ? (
              <InputController<TeamAddForm>
                path={`participants.${index}.birthYear`}
                control={control}
              />
            ) : (
              <div>{field.birthYear}</div>
            )}
          </div>
        ) : undefined
      )}
    </>
  );
}

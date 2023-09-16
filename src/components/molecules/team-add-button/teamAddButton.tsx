import { Button } from "../../atoms/button/button";
import { useCallback, useState } from "react";
import FormModal from "../../atoms/form-modal/formModal";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { BoatType } from "../../../models/settings";
import { yupResolver } from "@hookform/resolvers/yup";
import { addTeamSchema } from "../../../schemas/addTeamSchema";
import { Input } from "../../atoms/input/input";
import { Select } from "../select/select";
import { AddParticipantForm } from "../add-participant-form/addParticipantForm";
import { FaTrashAlt } from "react-icons/fa";
import { IconButton } from "../../atoms/button/iconButton";
import { useAddTeam } from "../../../hooks/useAddTeam";
import { Gender } from "../../../models/team";

interface TeamAddButtonProps {
  refetch: () => void;
}

export interface TeamAddForm {
  name: string;
  club: string;
  participants: { name: string; club: string; birthYear: number }[];
  helm: { name: string; club: string; birthYear: number } | null;
  boat: string;
  preferredBlock: number;
  boatType: BoatType;
  gender: Gender;
}

export default function TeamAddButton({ refetch }: TeamAddButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const methods = useForm<TeamAddForm>({
    resolver: yupResolver(addTeamSchema),
    defaultValues: getDefaultValues(),
    mode: "onSubmit",
  });
  const { watch, control, getValues, handleSubmit, reset } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });
  const { mutate } = useAddTeam();
  const [error, setError] = useState<string | null>(null);
  const club = watch("club");
  const boatType = watch("boatType");

  const onClick = useCallback(
    (val: TeamAddForm["participants"][0], index: number) => {
      remove(index);
      append(val);
      setShowAddParticipant(false);
    },
    [append, remove]
  );
  const onClickSubmit = useCallback(
    async (val: TeamAddForm) => {
      if (!getDisabled(boatType, val.participants.length)) {
        setError(
          "Er missen nog deelnemers. Voeg meer deelnemers toe om de boot vol te krijgen."
        );
        return;
      }
      await mutate(val);
      refetch();
      reset(getDefaultValues());
      setShowModal(false);
    },
    [boatType, mutate, refetch, reset]
  );

  return (
    <>
      {showModal && (
        <FormModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit(onClickSubmit)}
          title="Team"
          description="Vul alle velden hieronder in om een team toe te voegen"
          panelClassNames="max-w-xl"
        >
          <FormProvider {...methods}>
            <div className="flex gap-x-3">
              <Controller
                name="boatType"
                control={control}
                render={({ field }) => (
                  <Select
                    items={Object.values(BoatType)}
                    selectedValue={field.value}
                    onChange={(val) => field.onChange(val)}
                    label="Boottype"
                  />
                )}
              />
              <Controller
                name="preferredBlock"
                control={control}
                render={({ field }) => (
                  <Select
                    items={[1, 2, 3]}
                    selectedValue={field.value.toString()}
                    onChange={(val) => field.onChange(parseInt(val))}
                    label="Voorkeursblok"
                  />
                )}
              />
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    items={Object.values(Gender)}
                    selectedValue={field.value}
                    onChange={(val) => field.onChange(val)}
                    label="Geslacht"
                  />
                )}
              />
            </div>
            <div className="flex gap-x-3">
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    label="Team naam"
                    hasError={fieldState.invalid}
                    {...field}
                  />
                )}
              />
              <Controller
                name="club"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    label="Vereniging"
                    hasError={fieldState.invalid}
                    {...field}
                  />
                )}
              />
              <Controller
                name="boat"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    label="Boot naam"
                    hasError={fieldState.invalid}
                    {...field}
                  />
                )}
              />
            </div>
            {boatType !== BoatType.skiff &&
              boatType !== BoatType.boatTwoScull && (
                <div className="flex gap-x-3">
                  <Controller
                    name={`helm.name`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        label="Naam stuur"
                        hasError={fieldState.invalid}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name={`helm.club`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        label="Vereniging stuur"
                        hasError={fieldState.invalid}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name={`helm.birthYear`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        label="Geboortejaar stuur"
                        hasError={fieldState.invalid}
                        {...field}
                      />
                    )}
                  />
                </div>
              )}
            <Button
              name="Voeg deelnemer toe"
              color="primary"
              disabled={
                showAddParticipant || getDisabled(boatType, fields.length)
              }
              onClick={() => {
                setShowAddParticipant(true);
                append({ name: "", club, birthYear: 1999 });
                setError(null);
              }}
              classNames="my-3"
            />
            {showAddParticipant && (
              <AddParticipantForm
                addParticipant={onClick}
                index={getValues("participants").length - 1}
              />
            )}
            {fields.map((field, index) =>
              field.name ? (
                <div key={field.id} className="grid grid-cols-3 gap-x-3">
                  <div>
                    <IconButton
                      icon={<FaTrashAlt />}
                      onClick={() => remove(index)}
                      classNames="mr-2"
                    />
                    {index + 1}. {field.name}
                  </div>
                  <div>{field.club}</div>
                  <div>{field.birthYear}</div>
                </div>
              ) : undefined
            )}
            {error && <span className="text-red-600">{error}</span>}
          </FormProvider>
        </FormModal>
      )}
      <Button
        name="Voeg team toe"
        color="primary"
        onClick={() => setShowModal(true)}
      />
    </>
  );
}

function getDefaultValues(): TeamAddForm {
  return {
    name: "",
    club: "",
    participants: [],
    boat: "",
    preferredBlock: 1,
    boatType: BoatType.skiff,
    helm: null,
    gender: Gender.M,
  };
}

function getDisabled(type: BoatType, participantsLength: number) {
  switch (type) {
    case BoatType.skiff:
      return participantsLength >= 1;
    case BoatType.boatTwoScull:
      return participantsLength >= 2;
    case BoatType.boatFourBoardWith:
    case BoatType.cBoatFourBoardWith:
      return participantsLength >= 4;
    default:
      return participantsLength >= 8;
  }
}

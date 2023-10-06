import { Button } from "../../../atoms/button/button";
import { useCallback, useState } from "react";
import FormModal from "../../../atoms/form-modal/formModal";
import { FormProvider, useForm } from "react-hook-form";
import { BoatType } from "../../../../models/settings";
import { yupResolver } from "@hookform/resolvers/yup";
import { addTeamSchema } from "../../../../schemas/addTeamSchema";
import { useAddTeam } from "../../../../hooks/teams/useAddTeam";
import { Gender } from "../../../../models/team";
import TeamForm from "../../../molecules/team-form/teamForm";

interface TeamAddButtonProps {
  refetch: () => void;
}

export interface TeamAddFormParticipant {
  name: string;
  club: string;
  birthYear: number;
  id?: string;
}

export interface TeamAddForm {
  name: string;
  club: string;
  participants: TeamAddFormParticipant[];
  helm: TeamAddFormParticipant | null;
  boat: string;
  preferredBlock: number;
  boatType: BoatType;
  gender: Gender;
}

export default function TeamAddButton({ refetch }: TeamAddButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const methods = useForm<TeamAddForm>({
    resolver: yupResolver(addTeamSchema),
    defaultValues: getDefaultValues(),
    mode: "onSubmit",
  });
  const [error, setError] = useState<string | null>(null);
  const { watch, control, getValues, handleSubmit, reset } = methods;
  const { mutate } = useAddTeam();
  const boatType = watch("boatType");

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
            <TeamForm
              control={control}
              watch={watch}
              getValues={getValues}
              setError={(val) => setError(val)}
            />
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

export function getDisabled(type: BoatType, participantsLength: number) {
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

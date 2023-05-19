import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { AGE_CODE, BOAT_CODE, STRATEGY } from "../../enums";
import { yupResolver } from "@hookform/resolvers/yup";
import { settingsSchema } from "../../yup/SettingsSchema";
import { Grid, MenuItem, Select, TextField } from "@mui/material";
import InputBar from "../../components/molecules/input-bar/inputBar";
import React from "react";
import { CorrectionAgeContainer } from "../../components/atoms/correction-age/CorrectionAge";

export interface FormValuesSettings {
  startNr: number;
  minimumAge: number;
  costForLoan: number;
  correctionAge: CorrectionAge[];
  correctionBoat: CorrectionBoat[];
}

interface CorrectionAge {
  ageCode: AGE_CODE;
  male: number;
  female: number;
  strategy: STRATEGY;
}

interface CorrectionBoat {
  boatCode: BOAT_CODE;
  correction: number;
}

export default function Settings() {
  const methods = useForm<FormValuesSettings>({
    resolver: yupResolver(settingsSchema),
    defaultValues: getDefaultValues(),
  });
  const onSubmit = (data: FormValuesSettings) => console.log(data);
  const { fields: ageFields } = useFieldArray({
    control: methods.control,
    name: "correctionAge",
  });
  const { fields: boatFields } = useFieldArray({
    control: methods.control,
    name: "correctionBoat",
  });

  return (
    <div>
      <h1>Instellingen</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <InputBar<FormValuesSettings>
            label="Startnummer"
            path="startNr"
            render={({ field }) => <TextField {...field} type="number" />}
          />
          <InputBar<FormValuesSettings>
            label="Minimum leeftijd"
            path="minimumAge"
            render={({ field }) => <TextField {...field} type="number" />}
          />
          <InputBar<FormValuesSettings>
            label="Leenkosten per plek"
            path="costForLoan"
            render={({ field }) => <TextField {...field} />}
          />
          <h3>Correctiefactoren boot</h3>
          {boatFields.map((boatField, index) => (
            <InputBar<FormValuesSettings>
              key={boatField.id}
              label={boatField.boatCode}
              path={`correctionBoat.${index}.correction`}
              render={({ field }) => <TextField {...field} />}
            />
          ))}
          <h3>Correctiefactoren leeftijd</h3>
          <CorrectionAgeContainer container spacing={2}>
            <Grid item xs={3}>
              Code
            </Grid>
            <Grid item xs={3}>
              Man
            </Grid>
            <Grid item xs={3}>
              Vrouw
            </Grid>
            <Grid item xs={3}>
              Strategie
            </Grid>
            {ageFields.map((ageField, index) => (
              <React.Fragment key={ageField.id}>
                <Grid item xs={3}>
                  {ageField.ageCode}
                </Grid>
                <Grid item xs={3}>
                  <InputBar<FormValuesSettings>
                    path={`correctionAge.${index}.male`}
                    render={({ field }) => (
                      <TextField {...field} type="number" />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputBar<FormValuesSettings>
                    path={`correctionAge.${index}.female`}
                    render={({ field }) => (
                      <TextField {...field} type="number" />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputBar<FormValuesSettings>
                    path={`correctionAge.${index}.strategy`}
                    render={({ field }) => (
                      <Select {...field}>
                        {Object.values(STRATEGY).map((key) => (
                          <MenuItem key={key} value={key}>
                            {key}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Grid>
              </React.Fragment>
            ))}
          </CorrectionAgeContainer>
        </form>
      </FormProvider>
    </div>
  );
}

const getDefaultValues = () => {
  const correctionAge = Object.values(AGE_CODE).map((key) => ({
    male: 1,
    female: 1,
    strategy: STRATEGY.AVERAGE,
    ageCode: key as AGE_CODE,
  }));
  const correctionBoat = Object.values(BOAT_CODE).map((key) => ({
    correction: 1,
    boatCode: key,
  }));
  return {
    startNr: 1,
    minimumAge: 18,
    costForLoan: 5,
    correctionAge,
    correctionBoat,
  };
};

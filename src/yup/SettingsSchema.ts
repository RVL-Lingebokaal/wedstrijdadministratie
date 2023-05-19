import { array, number, object, string } from "yup";
import { FormValuesSettings } from "../pages/settings";
import { AGE_CODE, BOAT_CODE, STRATEGY } from "../enums";

export const settingsSchema = object<FormValuesSettings>({
  startNr: number().required("Een startnummer is verplicht"),
  minimumAge: number().required("Een minimumleeftijd is verplicht"),
  costForLoan: number().required(
    "De prijs voor een zitplek in een leenboot is verplicht"
  ),
  correctionAge: array()
    .required("Er is minimaal 1 correctiefactor voor leeftijd nodig")
    .min(1, "Er is minimaal 1 correctiefactor voor leeftijd nodig")
    .of(
      object({
        male: number().required("Een correctiefactor voor mannen is verplicht"),
        female: number().required(
          "Een correctiefactor voor vrouwen is verplicht"
        ),
        strategy: string().oneOf(Object.values(STRATEGY)).required(),
        ageCode: string().oneOf(Object.values(AGE_CODE)).required(),
      })
    ),
  correctionBoat: array()
    .required("Er is minimaal 1 correctiefactor voor boot nodig")
    .min(1, "Er is minimaal 1 correctiefactor voor boot nodig")
    .of(
      object({
        correction: number().required(
          "Een correctiefactor voor een boot is verplicht"
        ),
        boatCode: string().oneOf(Object.values(BOAT_CODE)).required(),
      })
    ),
});

import { AGE_CODE, BOAT_CODE, STRATEGY } from "../enums";
import { settingsSchema } from "./SettingsSchema";

const form = {
  startNr: 1,
  minimumAge: 18,
  costForLoan: 5,
  correctionAge: [
    {
      male: 0.98,
      female: 1.02,
      strategy: STRATEGY.AVERAGE,
      ageCode: AGE_CODE.OPEN,
    },
  ],
  correctionBoat: [{ correction: 1.23, boatCode: BOAT_CODE.TWO }],
};

describe("SettingsSchema", () => {
  it("validates a correct settings form", () =>
    expect(settingsSchema.validate(form)).resolves.not.toThrow());

  it.each([
    [
      {
        form: { ...form, startNr: undefined },
        expected: "Een startnummer is verplicht",
      },
    ],
    [
      {
        form: { ...form, minimumAge: undefined },
        expected: "Een minimumleeftijd is verplicht",
      },
    ],
    [
      {
        form: { ...form, costForLoan: undefined },
        expected: "De prijs voor een zitplek in een leenboot is verplicht",
      },
    ],
    [
      {
        form: { ...form, correctionAge: undefined },
        expected: "Er is minimaal 1 correctiefactor voor leeftijd nodig",
      },
    ],
    [
      {
        form: { ...form, correctionAge: [] },
        expected: "Er is minimaal 1 correctiefactor voor leeftijd nodig",
      },
    ],
    [
      {
        form: {
          ...form,
          correctionAge: [{ ...form.correctionAge[0], male: undefined }],
        },
        expected: "Een correctiefactor voor mannen is verplicht",
      },
    ],
    [
      {
        form: {
          ...form,
          correctionAge: [{ ...form.correctionAge[0], female: undefined }],
        },
        expected: "Een correctiefactor voor vrouwen is verplicht",
      },
    ],
    [
      {
        form: {
          ...form,
          correctionAge: [{ ...form.correctionAge[0], strategy: undefined }],
        },
        expected: "correctionAge[0].strategy is a required field",
      },
    ],
    [
      {
        form: {
          ...form,
          correctionAge: [{ ...form.correctionAge[0], strategy: "strategy" }],
        },
        expected:
          "correctionAge[0].strategy must be one of the following values: OLDEST, AVERAGE",
      },
    ],
    [
      {
        form: {
          ...form,
          correctionAge: [{ ...form.correctionAge[0], ageCode: undefined }],
        },
        expected: "correctionAge[0].ageCode is a required field",
      },
    ],
    [
      {
        form: {
          ...form,
          correctionAge: [{ ...form.correctionAge[0], ageCode: "ageCode" }],
        },
        expected:
          "correctionAge[0].ageCode must be one of the following values: 14, 16, 18, -, VA, VB, VC, VD, VE, VF, VG, VH, VI, VJ, VK",
      },
    ],
    [
      {
        form: { ...form, correctionBoat: undefined },
        expected: "Er is minimaal 1 correctiefactor voor boot nodig",
      },
    ],
    [
      {
        form: {
          ...form,
          correctionBoat: [
            { ...form.correctionBoat[0], correction: undefined },
          ],
        },
        expected: "Een correctiefactor voor een boot is verplicht",
      },
    ],
    [
      {
        form: {
          ...form,
          correctionBoat: [{ ...form.correctionBoat[0], boatCode: "" }],
        },
        expected:
          "correctionBoat[0].boatCode must be one of the following values: C1X, C4+, C4*, 1x, 2-, 2x, 4+, 4-, 4*, 4x-, 8+, 8*, C2*",
      },
    ],
  ])(
    "invalidates the form with message $expected",
    async ({ form, expected }) => {
      return expect(settingsSchema.validate(form)).rejects.toThrow(expected);
    }
  );
});

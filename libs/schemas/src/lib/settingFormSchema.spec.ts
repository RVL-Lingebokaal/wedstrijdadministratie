import { settingFormSchema } from "./settingFormSchema";

describe("settingFormSchema", () => {
  it("validates a correct schema", () =>
    expect(
      settingFormSchema.validate({ date: "01-01-1999" })
    ).resolves.not.toThrow());

  it("throws an error, because of missing date", () =>
    expect(settingFormSchema.validate({ date: "" })).rejects.toThrow(
      "date is a required field"
    ));
});

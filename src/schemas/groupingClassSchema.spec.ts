import { groupingClassSchema } from "./groupingClassSchema";

describe("groupingClassSchema", () => {
  it("validates the scheme", () =>
    expect(
      groupingClassSchema.validate({ name: "name" })
    ).resolves.not.toThrow());

  it("throws an error, because of missing name", () =>
    expect(groupingClassSchema.validate({})).rejects.toThrow(
      "name is a required field"
    ));
});

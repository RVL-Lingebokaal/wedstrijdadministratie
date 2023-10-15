import { typesFormSchema } from "./typesFormSchema";
import { BoatType } from "../models/settings";

describe("typesFormSchema", () => {
  it("validates a correct schema", () =>
    expect(
      typesFormSchema.validate({
        items: [{ type: BoatType.boardFourWithout, correction: 1, price: 12 }],
      })
    ).resolves.not.toThrow());
});

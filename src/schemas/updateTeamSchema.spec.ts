import { updateTeamSchema } from "./updateTeamSchema";
import { BoatType } from "../models/settings";
import { Gender } from "../models/team";

describe("updateTeamSchema", () => {
  it("validates a correct scheme", () =>
    expect(
      updateTeamSchema.validate({
        team: "team",
        name: "name",
        club: "club",
        participants: [],
        boat: "boat",
        preferredBlock: 1,
        boatType: BoatType.skiff,
        helm: null,
        gender: Gender.M,
      })
    ).resolves.not.toThrow());

  it("throws an error, because of missing team name", () =>
    expect(
      updateTeamSchema.validate({
        name: "name",
        club: "club",
        participants: [],
        boat: "boat",
        preferredBlock: 1,
        boatType: BoatType.skiff,
        helm: null,
        gender: Gender.M,
      })
    ).rejects.toThrow("team is a required field"));
});

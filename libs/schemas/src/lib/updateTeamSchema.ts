import { string } from "yup";
import { addTeamSchema } from "./addTeamSchema";

export const updateTeamSchema = addTeamSchema.shape({
  team: string().required(),
});

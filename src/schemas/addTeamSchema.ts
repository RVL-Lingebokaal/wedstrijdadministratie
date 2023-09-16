import { array, mixed, number, object, string } from "yup";
import { BoatType } from "../models/settings";
import { Gender } from "../models/team";

export const participantSchema = object({
  name: string().required(),
  club: string().required(),
  birthYear: number().required(),
});

export const addTeamSchema = object({
  name: string().required(),
  club: string().required(),
  participants: array().of(participantSchema).required(),
  boat: string().required(),
  preferredBlock: number().min(1).max(3).required(),
  boatType: mixed<BoatType>().oneOf(Object.values(BoatType)).required(),
  helm: object({
    name: string().required(),
    club: string().required(),
    birthYear: number().required(),
  }).nullable(),
  gender: mixed<Gender>().oneOf(Object.values(Gender)).required(),
});

type ErrorName = "PARTICIPANT_BLOCK" | "HELM_BLOCK" | "BOAT_BLOCK";

interface ErrorCreation {
  name: ErrorName;
  message: string;
}

export class BlockError extends Error {
  name: ErrorName;
  message: string;

  constructor({ name, message }: ErrorCreation) {
    super();
    this.message = message;
    this.name = name;
  }
}

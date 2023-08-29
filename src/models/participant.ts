interface ParticipantCreation {
  name: string;
  id: string;
  club: string;
  birthYear: number;
}

export class Participant {
  private name = "";
  private id = "";
  private club = "";
  private birthYear = 1900;

  constructor({ name, id, club, birthYear }: ParticipantCreation) {
    this.birthYear = birthYear;
    this.id = id;
    this.name = name;
    this.club = club;
  }

  getId() {
    return this.id;
  }

  getDatabaseParticipant() {
    return {
      birthYear: this.birthYear,
      id: this.id,
      name: this.name,
      club: this.club,
    };
  }
}

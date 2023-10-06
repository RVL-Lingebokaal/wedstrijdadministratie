export interface BoatCreation {
  name: string;
  club: string;
}

export class Boat {
  private name = "";
  private club = "";
  private id = "";

  constructor({ name, club }: BoatCreation) {
    this.name = name;
    this.club = club;
    this.id = name.substring(0, 3) + club.substring(0, 3);
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getDatabaseBoat() {
    return {
      name: this.name,
      club: this.club,
    };
  }

  updateData({ name, club }: Partial<BoatCreation>) {
    this.name = name ?? this.name;
    this.club = club ?? this.club;
  }
}

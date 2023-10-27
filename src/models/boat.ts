export interface BoatCreation {
  name: string;
  club: string;
  blocks: number[];
}

export class Boat {
  private name = "";
  private club = "";
  private id = "";
  private blocks = new Set<number>();

  constructor({ name, club, blocks }: BoatCreation) {
    this.name = name;
    this.club = club;
    this.id = name.substring(0, 3) + club.substring(0, 3);
    this.blocks = new Set(blocks);
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getBlocks() {
    return this.blocks;
  }

  getDatabaseBoat() {
    return {
      name: this.name,
      club: this.club,
      blocks: JSON.stringify(Array.from(this.blocks.values())),
    };
  }

  updateData({ name, club }: Partial<BoatCreation>) {
    this.name = name ?? this.name;
    this.club = club ?? this.club;
  }

  addBlocks(blocks: Set<number>, reset?: boolean) {
    Array.from(blocks.values()).forEach((block) => this.addBlock(block, reset));
  }

  addBlock(block: number, reset?: boolean) {
    if (!reset && this.blocks.has(block)) {
      throw new Error("This block is already taken");
    }
    this.blocks.add(block);
  }

  updateBlock(toRemove: number, toAdd: number, reset?: boolean) {
    this.addBlock(toAdd, reset);
    this.blocks.delete(toRemove);
  }
}

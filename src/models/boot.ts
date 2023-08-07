export enum BootTypes {
  cBoatOne = "C1x",
  cBoatFourBoardWith = "C4+",
  cBoatFourWith = "C4*",
  cBoatTwoWith = "C2*",
  skiff = "1x",
  boatTwoBoard = "2-",
  boatTwoScull = "2x",
  boatFourBoardWith = "4+",
  boatFourBoard = "4-",
  boatFourWith = "4*",
  boatFour = "4x-",
  boatEightBoardWith = "8+",
  boatEightWith = "8*",
}

export interface BootForm {
  items: { type: BootTypes; correction: number; price: number }[];
}

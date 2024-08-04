import { BoatService } from "./boatService.server";
import fireStore from "firebase/firestore";
import { mockBoat } from "../tests/mocks";

jest.mock("firebase/firestore", () => ({
  writeBatch: jest.fn(),
  getFirestore: jest.fn(),
  doc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
}));

describe("BoatService", () => {
  let boatService: BoatService;
  let mockWriteBatch: any;
  let mockGetDocs: any;

  beforeEach(() => {
    boatService = new BoatService();
    mockWriteBatch = jest.spyOn(fireStore, "writeBatch");
    mockGetDocs = jest.spyOn(fireStore, "getDocs");
    jest.spyOn(fireStore, "collection");
    jest.spyOn(fireStore, "doc");
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("saves the given boats", async () => {
    const mockCommit = jest.fn();
    const mockSet = jest.fn();

    mockWriteBatch.mockReturnValue({ commit: mockCommit, set: mockSet });
    await boatService.saveBoats([mockBoat, { ...mockBoat, id: "2" }]);

    expect(mockSet).toHaveBeenCalledTimes(2);
    expect(mockCommit).toHaveBeenCalledTimes(1);
  });

  it("removes all boats", async () => {
    const mockCommit = jest.fn();
    const mockDelete = jest.fn();
    const mockSet = jest.fn();

    mockGetDocs.mockResolvedValue({
      docs: [mockBoat, { ...mockBoat, id: "2" }],
    });
    mockWriteBatch.mockReturnValue({
      commit: mockCommit,
      delete: mockDelete,
      set: mockSet,
    });

    await boatService.saveBoats([mockBoat, { ...mockBoat, id: "2" }]);
    await boatService.removeAllBoats();

    expect(mockSet).toHaveBeenCalledTimes(2);
    expect(mockCommit).toHaveBeenCalledTimes(2);
    expect(mockDelete).toHaveBeenCalledTimes(2);
  });

  it("doesn't call any firestore functions, because there are no boats to remove", async () => {
    const mockCommit = jest.fn();
    const mockDelete = jest.fn();

    await boatService.removeAllBoats();

    expect(mockCommit).toHaveBeenCalledTimes(0);
    expect(mockDelete).toHaveBeenCalledTimes(0);
  });

  it("gets the boats from firestore", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        { id: "1", data: () => ({ ...mockBoat, blocks: "[1]" }) },
        { id: "2", data: () => ({ ...mockBoat, id: "2", blocks: "[2]" }) },
      ],
    });
    const boats = await boatService.getBoats();

    expect(boats.size).toEqual(2);
    expect(boats.get("1")).toBeDefined();
    expect(boats.get("2")).toBeDefined();
  });

  it("updates a boat without id", async () => {
    const mockSetDocs = jest.spyOn(fireStore, "setDoc");

    const boat = await boatService.updateBoat({
      name: "name",
      blocks: new Set([1]),
      club: "club",
    });

    expect(mockSetDocs).toHaveBeenCalledTimes(1);
    expect(boat.id).toBeDefined();
  });

  it("updates a boat with id", async () => {
    const mockSetDocs = jest.spyOn(fireStore, "setDoc");

    const boat = await boatService.updateBoat(mockBoat, "3");

    expect(mockSetDocs).toHaveBeenCalledTimes(1);
    expect(boat.id).not.toEqual(mockBoat.id);
  });

  it("updates a boat with id that already exists", async () => {
    const mockSetDocs = jest.spyOn(fireStore, "setDoc");

    mockWriteBatch.mockReturnValue({ commit: jest.fn(), set: jest.fn() });
    await boatService.saveBoats([mockBoat]);
    const boat = await boatService.updateBoat(mockBoat, "1");

    expect(mockSetDocs).toHaveBeenCalledTimes(1);
    expect(boat.id).toEqual(mockBoat.id);
  });
});

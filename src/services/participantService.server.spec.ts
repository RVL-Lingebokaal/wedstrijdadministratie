import fireStore from "firebase/firestore";
import { ParticipantService } from "./participantService.server";
import { mockParticipant } from "../tests/mocks";

jest.mock("firebase/firestore", () => ({
  writeBatch: jest.fn(),
  getFirestore: jest.fn(),
  doc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  addDoc: jest.fn(),
}));

describe("participantService", () => {
  let participantService: ParticipantService;
  let mockWriteBatch: any;
  let mockGetDocs: any;
  let mockAddDoc: any;

  beforeEach(() => {
    participantService = new ParticipantService();
    mockWriteBatch = jest.spyOn(fireStore, "writeBatch");
    mockGetDocs = jest.spyOn(fireStore, "getDocs");
    mockAddDoc = jest.spyOn(fireStore, "addDoc");
    jest.spyOn(fireStore, "collection");
    jest.spyOn(fireStore, "doc");
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("saves the given participants", async () => {
    const mockCommit = jest.fn();
    const mockSet = jest.fn();

    mockWriteBatch.mockReturnValue({ commit: mockCommit, set: mockSet });
    await participantService.saveParticipants([
      mockParticipant,
      { ...mockParticipant, id: "2" },
    ]);

    expect(mockSet).toHaveBeenCalledTimes(2);
    expect(mockCommit).toHaveBeenCalledTimes(1);
  });

  it("removes all participants", async () => {
    const mockCommit = jest.fn();
    const mockDelete = jest.fn();
    const mockSet = jest.fn();

    mockGetDocs.mockResolvedValue({
      docs: [mockParticipant, { ...mockParticipant, id: "2" }],
      size: 2,
    });
    mockWriteBatch.mockReturnValue({
      commit: mockCommit,
      delete: mockDelete,
      set: mockSet,
    });

    await participantService.saveParticipants([
      mockParticipant,
      { ...mockParticipant, id: "2" },
    ]);
    await participantService.removeAllParticipants();

    expect(mockSet).toHaveBeenCalledTimes(2);
    expect(mockCommit).toHaveBeenCalledTimes(3);
    expect(mockDelete).toHaveBeenCalledTimes(2);
  });

  it("doesn't call any firestore functions, because there are no participants to remove", async () => {
    const mockCommit = jest.fn();
    const mockDelete = jest.fn();

    await participantService.removeAllParticipants();

    expect(mockCommit).toHaveBeenCalledTimes(0);
    expect(mockDelete).toHaveBeenCalledTimes(0);
  });

  it("get all participants with refetch", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        { id: "1", data: () => ({ ...mockParticipant, blocks: "[1]" }) },
        {
          id: "2",
          data: () => ({ ...mockParticipant, id: "id1", blocks: "[2]" }),
        },
      ],
    });
    const participants = await participantService.getParticipants(true);

    expect(participants.size).toEqual(2);
    expect(participants.get("id")).toBeDefined();
    expect(participants.get("id1")).toBeDefined();
  });

  it("get all participants when there are none", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        { id: "1", data: () => ({ ...mockParticipant, blocks: "[1]" }) },
        {
          id: "2",
          data: () => ({ ...mockParticipant, id: "id1", blocks: "[2]" }),
        },
      ],
    });
    const participants = await participantService.getParticipants();

    expect(participants.size).toEqual(2);
    expect(participants.get("id")).toBeDefined();
    expect(participants.get("id1")).toBeDefined();
  });

  it("get no participants from firestore", async () => {
    mockWriteBatch.mockReturnValue({ commit: jest.fn(), set: jest.fn() });

    await participantService.saveParticipants([
      mockParticipant,
      { ...mockParticipant, id: "2" },
    ]);
    const participants = await participantService.getParticipants();

    expect(participants.size).toEqual(2);
    expect(mockGetDocs).not.toHaveBeenCalled();
  });

  it("creates a participant", async () => {
    mockAddDoc.mockResolvedValue({ id: "newId" });

    const participant = await participantService.createParticipant(
      mockParticipant
    );

    expect(participant.id).toEqual("newId");
    expect(mockAddDoc).toHaveBeenCalledTimes(1);
  });

  it("doesn't create a participant, because he already exists", async () => {
    mockAddDoc.mockResolvedValue({ id: "newId" });
    mockWriteBatch.mockReturnValue({ commit: jest.fn(), set: jest.fn() });
    await participantService.saveParticipants([mockParticipant]);

    const participant = await participantService.createParticipant(
      mockParticipant
    );

    expect(participant.id).toEqual(mockParticipant.id);
    expect(mockAddDoc).toHaveBeenCalledTimes(0);
  });

  it("updates a participant", async () => {
    const mockSetDocs = jest.spyOn(fireStore, "setDoc");

    mockWriteBatch.mockReturnValue({ commit: jest.fn(), set: jest.fn() });

    const participant = await participantService.updateParticipant(
      mockParticipant,
      {
        club: "club2",
        name: "name2",
        birthYear: 1900,
      }
    );

    expect(mockSetDocs).toHaveBeenCalledTimes(1);
    expect(participant.club).toEqual("club2");
    expect(participant.name).toEqual("name2");
    expect(participant.birthYear).toEqual(1900);
  });
});

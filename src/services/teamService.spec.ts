import { TeamService } from "./teamService.server";
import fireStore, { setDoc } from "firebase/firestore";
import { mockTeam } from "../tests/mocks";
import boatService from "./boatService.server";
import participantService from "./participantService.server";
import { Boat } from "../models/boat";
import { Participant } from "../models/participant";
import { BoatType } from "../models/settings";

jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(),
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  writeBatch: jest.fn(),
  collection: jest.fn(),
}));
jest.mock("./participantService.server", () => ({
  saveParticipants: jest.fn(),
  getParticipants: jest.fn(),
}));
jest.mock("./boatService.server", () => ({
  saveBoats: jest.fn(),
  getBoats: jest.fn(),
}));

describe("teamService", () => {
  let teamService: TeamService;
  let mockWriteBatch: any;
  let mockSetDoc: any;
  let mockAddDoc: any;
  let mockGetDocs: any;

  beforeEach(() => {
    teamService = new TeamService();
    mockWriteBatch = jest.spyOn(fireStore, "writeBatch");
    mockSetDoc = jest.spyOn(fireStore, "setDoc");
    mockAddDoc = jest.spyOn(fireStore, "addDoc");
    mockGetDocs = jest.spyOn(fireStore, "getDocs");
  });

  afterEach(() => jest.resetAllMocks());

  it("saves a team", async () => {
    const mockCommit = jest.fn();
    const mockSet = jest.fn();
    mockWriteBatch.mockReturnValue({ commit: mockCommit, set: mockSet });

    await teamService.saveTeams([mockTeam, { ...mockTeam, id: "id1" }]);

    expect(mockSet).toHaveBeenCalledTimes(2);
    expect(mockCommit).toHaveBeenCalledTimes(1);
  });

  it("saves one team without a helm and boat", async () => {
    const saveBoatspy = jest.spyOn(boatService, "saveBoats");
    const saveParticipantsSpy = jest.spyOn(
      participantService,
      "saveParticipants"
    );

    await teamService.saveTeam(mockTeam);

    expect(mockSetDoc).toHaveBeenCalledTimes(1);
    expect(saveBoatspy).not.toHaveBeenCalled();
    expect(saveParticipantsSpy).toHaveBeenCalledTimes(1);
  });

  it("saves one team with a helm and boat", async () => {
    const saveBoatspy = jest.spyOn(boatService, "saveBoats");
    const saveParticipantsSpy = jest.spyOn(
      participantService,
      "saveParticipants"
    );

    await teamService.saveTeam({
      ...mockTeam,
      helm: {
        name: "name",
        id: "id",
        club: "club",
        blocks: new Set([1]),
        birthYear: 1990,
      },
      boat: { name: "name", club: "club", id: "id", blocks: new Set([1]) },
    });

    expect(mockSetDoc).toHaveBeenCalledTimes(1);
    expect(saveBoatspy).toHaveBeenCalledTimes(1);
    expect(saveParticipantsSpy).toHaveBeenCalledTimes(1);
  });

  it("saves one team without id", async () => {
    const saveBoatspy = jest.spyOn(boatService, "saveBoats");
    const saveParticipantsSpy = jest.spyOn(
      participantService,
      "saveParticipants"
    );
    mockAddDoc.mockResolvedValue({ id: "1" });

    await teamService.saveTeam({ ...mockTeam, id: "" });

    expect(mockSetDoc).not.toHaveBeenCalled();
    expect(mockAddDoc).toHaveBeenCalledTimes(1);
    expect(saveBoatspy).not.toHaveBeenCalled();
    expect(saveParticipantsSpy).toHaveBeenCalledTimes(1);
  });

  it("removes all teams", async () => {
    const mockCommit = jest.fn();
    const mockDelete = jest.fn();
    mockWriteBatch.mockReturnValue({
      commit: mockCommit,
      delete: mockDelete,
      set: jest.fn(),
    });
    mockGetDocs.mockResolvedValue({
      docs: [mockTeam, { ...mockTeam, id: "id1" }],
    });

    await teamService.saveTeams([mockTeam, { ...mockTeam, id: "id1" }]);
    await teamService.removeAllTeams();

    expect(mockGetDocs).toHaveBeenCalledTimes(1);
    expect(mockWriteBatch).toHaveBeenCalledTimes(2);
    expect(mockDelete).toHaveBeenCalledTimes(2);
    expect(mockCommit).toHaveBeenCalledTimes(2);
  });

  it("removes no teams, because there are none", async () => {
    await teamService.removeAllTeams();

    expect(mockGetDocs).not.toHaveBeenCalled();
    expect(mockWriteBatch).not.toHaveBeenCalled();
  });

  it("get all teams from firestore", async () => {
    jest
      .spyOn(boatService, "getBoats")
      .mockResolvedValueOnce(new Map<string, Boat>());
    jest
      .spyOn(participantService, "getParticipants")
      .mockResolvedValueOnce(new Map<string, Participant>());
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        {
          data: () => ({
            boat: "1",
            boatType: BoatType.skiff,
            id: "11",
            participants: ["111"],
            preferredBlock: "1",
            place: "1",
          }),
        },
      ],
    });

    const teams = await teamService.getTeams();
    expect(mockGetDocs).toHaveBeenCalledTimes(1);
    expect(teams.size).toEqual(1);
  });

  it("get all teams from firestore with helm", async () => {
    const helm: Participant = {
      name: "name",
      id: "112",
      club: "club",
      birthYear: 1900,
      blocks: new Set(),
    };
    jest
      .spyOn(boatService, "getBoats")
      .mockResolvedValueOnce(new Map<string, Boat>());
    const pMap = new Map<string, Participant>().set("112", helm);
    jest
      .spyOn(participantService, "getParticipants")
      .mockResolvedValueOnce(pMap);
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        {
          data: () => ({
            boat: "1",
            boatType: BoatType.skiff,
            id: "11",
            participants: ["111"],
            preferredBlock: "1",
            place: "1",
            helm: "112",
          }),
        },
      ],
    });

    const teams = await teamService.getTeams();
    expect(mockGetDocs).toHaveBeenCalledTimes(1);
    expect(teams.size).toEqual(1);
    expect(teams.get("11")?.helm).toEqual(helm);
  });

  it("retrieves teams without going to firestore", async () => {
    mockWriteBatch.mockReturnValue({ commit: jest.fn(), set: jest.fn() });

    await teamService.saveTeams([mockTeam, { ...mockTeam, id: "id1" }]);
    const teams = await teamService.getTeams();

    expect(mockGetDocs).not.toHaveBeenCalled();
    expect(teams.size).toEqual(2);
  });

  it("retrieves team", async () => {
    mockWriteBatch.mockReturnValue({ commit: jest.fn(), set: jest.fn() });

    await teamService.saveTeams([mockTeam, { ...mockTeam, id: "id1" }]);
    const team = await teamService.getTeam(mockTeam.id);

    expect(team).toEqual(mockTeam);
  });
});

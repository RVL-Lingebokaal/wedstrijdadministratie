import { SettingsService } from './settingsService.server';
import fireStore from 'firebase/firestore';
import { mockSettings } from './tests/mocks';
import {
  AgeStrategy,
  AgeType,
  BoatItem,
  BoatType,
  ClassItem,
} from '../../../models/src/lib/settings';
import { Gender } from '../../../models/src/lib/team';

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
}));

describe('SettingService', () => {
  let settingService: SettingsService;
  let mockGetDoc: any;
  let mockSetDoc: any;

  beforeEach(() => {
    settingService = new SettingsService();
    mockGetDoc = jest.spyOn(fireStore, 'getDoc');
    mockSetDoc = jest.spyOn(fireStore, 'setDoc');
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('retrieves empty settings, because there are none', async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => false,
    });
    const settings = await settingService.getSettings();

    expect(settings).toEqual({ ages: [], boats: [], classes: [] });
  });

  it('retrieves the settings, when there are no ages settings', async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => mockSettings,
    });
    const settings = await settingService.getSettings();

    expect(settings).toEqual(mockSettings);
  });

  it('retrieves the settings, when there are no boats settings', async () => {
    await settingService.saveSettings('ages', [
      {
        type: AgeType.eighteen,
        age: '18',
        correctionMale: 1,
        correctionFemale: 1,
        strategy: AgeStrategy.average,
      },
    ]);
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => mockSettings,
    });
    const settings = await settingService.getSettings();

    expect(settings).toEqual(mockSettings);
  });

  it('saves the settings', async () => {
    const boatItems: BoatItem[] = [
      { type: BoatType.skiff, correction: 1, price: 10 },
    ];
    await settingService.saveSettings('boats', boatItems);

    expect(mockSetDoc).toHaveBeenCalledTimes(1);
    expect(mockSetDoc).toHaveBeenCalledWith(
      undefined,
      { boats: boatItems },
      { merge: true }
    );
  });

  it('removes a classItem', async () => {
    const classItem: ClassItem = {
      name: 'name',
      boatType: BoatType.skiff,
      ages: [],
      gender: Gender.M,
    };

    await settingService.saveSettings('classes', [
      classItem,
      { ...classItem, name: 'name2' },
    ]);
    await settingService.removeClassItem({ ...classItem, name: 'name2' });

    expect(mockSetDoc).toHaveBeenCalledTimes(2);
    expect(mockSetDoc).toHaveBeenNthCalledWith(
      2,
      undefined,
      { classes: [classItem] },
      { merge: true }
    );
  });
});

import { teamService, wedstrijdService } from '@services';
// @ts-ignore
import { Workbook } from 'exceljs';
import { AgeType, ClassItem, Team, translateClass } from '@models';
import {
  convertTimeToObject,
  getClassMap,
  getCorrectionAgeSexMap,
  getCorrectionBoatMap,
  getDifference,
} from '@utils';
import { DateTime } from 'luxon';
import { getCorrectedTime } from '../../../components/src/lib/utils/timeUtils';

export class DownloadService {
  async getBetalingenByStartNumber(wedstrijdId: string) {
    const sortFunction = (a: Team, b: Team) =>
      (a.startNumber ?? 0) - (b.startNumber ?? 0);
    return this.getBetalingen(sortFunction, true, wedstrijdId);
  }

  async getBetalingenByVerenigingsNaam(wedstrijdId: string) {
    const sortFunction = (a: Team, b: Team) => a.club.localeCompare(b.club);
    return this.getBetalingen(sortFunction, false, wedstrijdId);
  }

  async getRugnummerByStartNumber(wedstrijdId: string) {
    const sortFunction = (a: Team, b: Team) =>
      (a.startNumber ?? 0) - (b.startNumber ?? 0);
    return this.getRugnummer(sortFunction, true, wedstrijdId);
  }

  async getRugnummerByVerenigingsNaam(wedstrijdId: string) {
    const sortFunction = (a: Team, b: Team) => a.club.localeCompare(b.club);
    return this.getRugnummer(sortFunction, false, wedstrijdId);
  }

  async getBootControle(wedstrijdId: string) {
    const teams = await teamService.getTeams(wedstrijdId);

    // Create a new Excel workbook
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Define columns
    worksheet.columns = [
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Bootnaam', key: 'name', width: 25 },
      { header: 'Vereniging', key: 'vereniging', width: 20 },
      { header: 'Startnr blok 1', key: 'startnr1', width: 5 },
      { header: 'Startnr blok 2', key: 'startnr2', width: 5 },
      { header: 'Startnr blok 3', key: 'startnr3', width: 5 },
      { header: 'Opmerkingen', key: 'opmerkingen', width: 30 },
    ];

    Array.from(teams.values())
      .sort((a, b) => (a.boat?.name ?? '').localeCompare(b.boat?.name ?? ''))
      .forEach(
        ({ boat, boatType, club, startNumber, block, preferredBlock }) => {
          const finalBlock = block ?? preferredBlock;
          worksheet.addRow({
            type: boatType,
            name: boat?.name,
            vereniging: club,
            startnr1: finalBlock === 1 ? startNumber : '',
            startnr2: finalBlock === 2 ? startNumber : '',
            startnr3: finalBlock === 3 ? startNumber : '',
            opmerkingen: '',
          });
        }
      );

    // Write workbook to buffer
    return await workbook.xlsx.writeBuffer();
  }

  async getKamprechterInfo(heat: number, wedstrijdId: string) {
    const teams = await teamService.getTeams(wedstrijdId);

    // Create a new Excel workbook
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Define columns
    worksheet.columns = [
      { header: 'Startnummer', key: 'startnr', width: 10 },
      { header: 'Boot', key: 'type', width: 10 },
      { header: 'Vereniging', key: 'vereniging', width: 25 },
      { header: 'Opmerkingen', key: 'opmerkingen', width: 30 },
    ];

    Array.from(teams.values())
      .filter(
        ({ block, preferredBlock }) => block === heat || preferredBlock === heat
      )
      .sort((a, b) => (a.startNumber ?? 0) - (b.startNumber ?? 0))
      .forEach(({ boatType, club, startNumber }) => {
        worksheet.addRow({
          startnr: startNumber,
          type: boatType,
          vereniging: club,
          opmerkingen: '',
        });
      });

    // Add title row
    const title = `Startlijst Heat ${heat}`;
    const titleRow = worksheet.insertRow(1, [title]);

    // Merge title row across all columns
    worksheet.mergeCells('A1:D1');
    titleRow.font = { bold: true, size: 14 };

    // Write workbook to buffer
    return await workbook.xlsx.writeBuffer();
  }

  async getRoeiersOverzicht(wedstrijdId: string) {
    const teams = await teamService.getTeams(wedstrijdId);
    const settings = await wedstrijdService.getSettingsFromWedstrijd(
      wedstrijdId
    );
    const classes = this.getSettingsMapClasses(settings.classes ?? []);

    // Create a new Excel workbook
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Define columns
    worksheet.columns = [
      { header: 'Blok', key: 'blok', width: 10 },
      { header: 'Startnr', key: 'startnr', width: 10 },
      { header: 'Veld', key: 'klasse', width: 25 },
      { header: 'Ploegnaam', key: 'ploegnaam', width: 30 },
      { header: 'Slag', key: 'slag', width: 25 },
      { header: 'Bootnaam', key: 'bootnaam', width: 30 },
    ];

    let currentClass = '';
    Array.from(teams.values())
      .sort((a, b) => (a.startNumber ?? 0) - (b.startNumber ?? 0))
      .forEach(
        ({
          club,
          startNumber,
          boat,
          block,
          ageClass,
          participants,
          boatType,
          gender,
          name,
        }) => {
          const translatedClass = translateClass({
            gender,
            boatType,
            className: classes.get(ageClass) ?? '',
            isJeugdWedstrijd: settings.general.isJeugd ?? false,
          });

          if (currentClass !== translatedClass) {
            worksheet.addRow({});
          }

          const ploegnaam = boatType === '1x' ? club : name;
          const slag = participants[0].name;

          worksheet.addRow({
            blok: block,
            startnr: startNumber,
            klasse: translatedClass,
            vereniging: club,
            bootnaam: boat?.name,
            slag,
            ploegnaam,
          });

          currentClass = translatedClass;
        }
      );
    // Write workbook to buffer
    return await workbook.xlsx.writeBuffer();
  }

  async getResultatenOverzicht(wedstrijdId: string) {
    const results = await teamService.getResults(wedstrijdId);
    const settings = await wedstrijdService.getSettingsFromWedstrijd(
      wedstrijdId
    );

    const classMap = getClassMap(settings.classes ?? []);
    const correctionAgeSexMap = getCorrectionAgeSexMap(settings.ages);
    const correctionBoatMap = getCorrectionBoatMap(settings.boats);

    // Create a new Excel workbook
    const workbook = new Workbook();
    const worksheetCorrected = workbook.addWorksheet('Gecorrigeerd');
    const worksheetOriginal = workbook.addWorksheet('Ongecorrigeerd');

    // Define columns for corrected worksheet
    worksheetCorrected.columns = [
      { header: 'Startnr', key: 'startNr', width: 30 },
      { header: 'Veld', key: 'veld', width: 30 },
      { header: 'Ploeg', key: 'ploeg', width: 30 },
      { header: 'Slag', key: 'slag', width: 30 },
      { header: 'Cat', key: 'categorie', width: 20 },
      { header: 'Gevaren tijd', key: 'tijd', width: 15 },
      { header: 'Gecorrigeerd', key: 'correctie', width: 15 },
      { header: 'Plaats', key: 'plaats', width: 20 },
    ];

    // Define columns for original worksheet
    worksheetOriginal.columns = [
      { header: 'Startnr', key: 'startNr', width: 30 },
      { header: 'Veld', key: 'veld', width: 30 },
      { header: 'Ploeg', key: 'ploeg', width: 30 },
      { header: 'Slag', key: 'slag', width: 30 },
      { header: 'Cat', key: 'categorie', width: 20 },
      { header: 'Gevaren tijd', key: 'tijd', width: 15 },
      { header: 'Plaats', key: 'plaats', width: 20 },
      { header: 'Blok', key: 'block', width: 20 },
    ];

    const uncorrectedByClass = new Map<string, any[]>();
    const correctedRows = [] as any;

    results.forEach(
      ({ name, result, gender, boatType, ageClass, startNr, slag, block }) => {
        const key = `${ageClass}${gender}${boatType}`;
        const className = classMap.get(key) ?? '';
        const unCorrectedRow = uncorrectedByClass.get(className) || [];

        const { start, finish, correction } = getCorrectedTime({
          result,
          gender,
          boatType,
          ageClass,
          correctionBoatMap,
          correctionAgeSexMap,
        });

        correctedRows.push({
          startNr,
          veld: className,
          ploeg: name,
          slag: slag?.name,
          categorie: ageClass,
          tijd:
            start.dateTime && finish.dateTime
              ? getDifference(start.dateTime, finish.dateTime)
              : '-',
          correctie: convertTimeToObject(correction).localeString ?? '-',
        });
        unCorrectedRow.push({
          startNr,
          veld: className,
          ploeg: name,
          slag: slag?.name,
          categorie: ageClass,
          tijd:
            start.dateTime && finish.dateTime
              ? getDifference(start.dateTime, finish.dateTime)
              : '-',
          block,
        });
        uncorrectedByClass.set(className, unCorrectedRow);
      }
    );

    const sortedCorrectedRows = correctedRows.sort((a: any, b: any) =>
      this.sortTimes(a.correctie, b.correctie)
    );
    sortedCorrectedRows.forEach((row: any, index: number) => {
      worksheetCorrected.addRow({ ...row, plaats: index + 1 });
    });
    uncorrectedByClass.forEach((rows) => {
      if (rows.length > 0) {
        worksheetOriginal.addRow({ veld: rows[0].veld });
        const sortedUncorrectedRows = rows.sort((a: any, b: any) =>
          this.sortTimes(a.tijd, b.tijd)
        );
        sortedUncorrectedRows.forEach((row: any, index: number) => {
          worksheetOriginal.addRow({ ...row, plaats: index + 1 });
        });
        worksheetOriginal.addRow({});
      }
    });

    // Write workbook to buffer
    return await workbook.xlsx.writeBuffer();
  }

  private async getRugnummer(
    sortFunc: (a: Team, b: Team) => number,
    hasWhiteSpaceStartNr: boolean,
    wedstrijdId: string
  ) {
    const teams = await teamService.getTeams(wedstrijdId);
    const settings = await wedstrijdService.getSettingsFromWedstrijd(
      wedstrijdId
    );
    const classes = this.getSettingsMapClasses(settings.classes ?? []);

    // Create a new Excel workbook
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Define columns
    worksheet.columns = [
      { header: 'Vereniging', key: 'vereniging', width: 15 },
      { header: 'Ploeg info', key: 'info', width: 25 },
      { header: 'Slag', key: 'slag', width: 20 },
      { header: 'Startnr', key: 'startnr', width: 5 },
      { header: 'Blok', key: 'blok', width: 5 },
      { header: 'Rugnr uitgegeven', key: 'rugnrUitgegeven', width: 15 },
      { header: 'Rugnr retour', key: 'rugnrRetour', width: 15 },
      { header: 'Opmerkingen', key: 'opmerkingen', width: 30 },
    ];

    let indexStartNumber = 0;
    Array.from(teams.values())
      .sort(sortFunc)
      .forEach(
        ({
          club,
          name,
          helm,
          ageClass,
          startNumber,
          block,
          gender,
          boatType,
          participants,
        }) => {
          if (hasWhiteSpaceStartNr) {
            while (indexStartNumber + 1 !== startNumber) {
              indexStartNumber++;
              worksheet.addRow({ startnr: indexStartNumber });
            }
          }

          const translatedClass = translateClass({
            gender,
            boatType,
            className: classes.get(ageClass) ?? '',
            isJeugdWedstrijd: settings.general.isJeugd ?? false,
          });
          worksheet.addRow({
            vereniging: club,
            info: `${name} - ${translatedClass}`,
            slag: helm?.name ?? participants[0].name,
            startnr: startNumber,
            blok: block,
            rugnrUitgegeven: '',
            rugnrRetour: '',
            opmerkingen: '',
          });
          indexStartNumber++;
        }
      );

    // Write workbook to buffer
    return await workbook.xlsx.writeBuffer();
  }

  private async getBetalingen(
    sortFunc: (a: Team, b: Team) => number,
    hasWhiteSpaceStartNr: boolean,
    wedstrijdId: string
  ) {
    const teams = await teamService.getTeams(wedstrijdId);
    const settings = await wedstrijdService.getSettingsFromWedstrijd(
      wedstrijdId
    );
    const classes = this.getSettingsMapClasses(settings.classes ?? []);

    // Create a new Excel workbook
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Define columns
    worksheet.columns = [
      { header: 'Vereniging', key: 'vereniging', width: 15 },
      { header: 'Ploeg info', key: 'info', width: 25 },
      { header: 'Slag', key: 'slag', width: 20 },
      { header: 'Startnr', key: 'startnr', width: 5 },
      { header: 'Blok', key: 'blok', width: 5 },
      { header: 'Inschrijfgeld', key: 'inschrijfgeld', width: 8 },
      { header: 'Betaald via bank', key: 'betaaldViaBank', width: 8 },
      { header: 'Betaald via contant', key: 'betaaldViaContant', width: 8 },
      { header: 'Tijdstip betaald', key: 'tijdstipBetaald', width: 8 },
      { header: 'Opmerkingen', key: 'opmerkingen', width: 30 },
    ];

    let indexStartNumber = 0;
    Array.from(teams.values())
      .sort(sortFunc)
      .forEach(
        ({
          club,
          name,
          helm,
          ageClass,
          startNumber,
          block,
          registrationFee,
          gender,
          boatType,
          participants,
        }) => {
          if (hasWhiteSpaceStartNr) {
            while (indexStartNumber + 1 !== startNumber) {
              indexStartNumber++;
              worksheet.addRow({ startnr: indexStartNumber });
            }
          }

          const translatedClass = translateClass({
            gender,
            boatType,
            className: classes.get(ageClass) ?? '',
            isJeugdWedstrijd: settings.general.isJeugd ?? false,
          });
          worksheet.addRow({
            vereniging: club,
            info: `${name} - ${translatedClass}`,
            slag: helm?.name ?? participants[0].name,
            startnr: startNumber,
            blok: block,
            inschrijfgeld: registrationFee,
            betaaldViaBank: '',
            betaaldViaContant: '',
            tijdstipBetaald: '',
            opmerkingen: '',
          });
          indexStartNumber++;
        }
      );

    // Write workbook to buffer
    return await workbook.xlsx.writeBuffer();
  }

  private getSettingsMapClasses(classItems: ClassItem[]) {
    return classItems.reduce((map, { ages, name }) => {
      ages.forEach((age) => {
        map.set(age, name);
      });
      return map;
    }, new Map<AgeType, string>());
  }

  private sortTimes(a: string, b: string) {
    if (a && b && a !== '-' && b !== '-') {
      return DateTime.fromISO(a).toMillis() - DateTime.fromISO(b).toMillis();
    }
    if (a === '-') {
      return 1;
    }
    return -1;
  }
}

export const downloadService = new DownloadService();

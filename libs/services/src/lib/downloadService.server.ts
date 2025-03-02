import { settingsService, teamService } from '@services';
// @ts-ignore
import ExcelJS from 'exceljs';
import { AgeType, ClassItem, Team, translateClass } from '@models';

export class DownloadService {
  async getBetalingenByStartNumber() {
    const sortFunction = (a: Team, b: Team) =>
      (a.startNumber ?? 0) - (b.startNumber ?? 0);
    return this.getBetalingen(sortFunction, true);
  }

  async getBetalingenByVerenigingsNaam() {
    const sortFunction = (a: Team, b: Team) => a.club.localeCompare(b.club);
    return this.getBetalingen(sortFunction, false);
  }

  async getRugnummerByStartNumber() {
    const sortFunction = (a: Team, b: Team) =>
      (a.startNumber ?? 0) - (b.startNumber ?? 0);
    return this.getRugnummer(sortFunction, true);
  }

  async getRugnummerByVerenigingsNaam() {
    const sortFunction = (a: Team, b: Team) => a.club.localeCompare(b.club);
    return this.getRugnummer(sortFunction, false);
  }

  async getBootControle() {
    const teams = await teamService.getTeams();

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
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

  async getKamprechterInfo(heat: number) {
    const teams = await teamService.getTeams();

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
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

  private async getRugnummer(
    sortFunc: (a: Team, b: Team) => number,
    hasWhiteSpaceStartNr: boolean
  ) {
    const teams = await teamService.getTeams();
    const settings = await settingsService.getSettings();
    const classes = this.getSettingsMapClasses(settings.classes);

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
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
        (
          {
            club,
            name,
            helm,
            ageClass,
            startNumber,
            block,
            gender,
            boatType,
            participants,
          },
          index
        ) => {
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
    hasWhiteSpaceStartNr: boolean
  ) {
    const teams = await teamService.getTeams();
    const settings = await settingsService.getSettings();
    const classes = this.getSettingsMapClasses(settings.classes);

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    const headerStyle = {
      font: { bold: true, size: 12 },
    };

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
        (
          {
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
          },
          index
        ) => {
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
}

export const downloadService = new DownloadService();

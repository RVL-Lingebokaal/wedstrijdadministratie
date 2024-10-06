import { NextRequest } from 'next/server';
import { ItemsToSave, settingsService, SettingsType } from '@services';
import { SettingData } from '@models';

interface PostProps extends SettingData {
  type: SettingsType;
  items: ItemsToSave;
}

export async function POST(req: NextRequest) {
  const args = (await req.json()) as PostProps;

  if (args.type === 'general') {
    await settingsService.saveGeneralSettings({
      date: args.date,
      missingNumbers: args.missingNumbers,
    });
    return Response.json({ success: true });
  }

  await settingsService.saveSettings(args.type, args.items);

  return Response.json({ success: true });
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get('type');

  if (type === 'general') {
    const generalSettings = await settingsService.getGeneralSettings();

    return Response.json(generalSettings);
  }
  const settings = await settingsService.getSettings();

  return Response.json(settings);
}

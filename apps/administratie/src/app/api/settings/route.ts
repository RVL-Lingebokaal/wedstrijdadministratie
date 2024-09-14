import { NextRequest } from 'next/server';
import { ItemsToSave, settingsService, SettingsType } from '@services';

export async function POST(req: NextRequest) {
  const args = (await req.json()) as {
    type: SettingsType;
    items: ItemsToSave;
    date: string;
  };

  if (args.type === 'general') {
    await settingsService.saveGeneralSettings({ date: args.date });
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

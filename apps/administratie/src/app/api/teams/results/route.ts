import { NextRequest, NextResponse } from 'next/server';
import { teamService, wedstrijdService } from '@services';
import {
  convertTimeToObject,
  getClassMap,
  getCorrectionAgeSexMap,
  getCorrectionBoatMap,
  getDifference,
  QUERY_PARAMS,
} from '@utils';
import { Duration } from 'luxon';
import { postResultsForTeamSchema } from '@models';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }

  const settings = await wedstrijdService.getSettingsFromWedstrijd(wedstrijdId);
  const result = await teamService.getResults(wedstrijdId);

  const classMap = getClassMap(settings.classes ?? []);
  const correctionAgeSexMap = getCorrectionAgeSexMap(settings.ages);
  const correctionBoatMap = getCorrectionBoatMap(settings.boats);

  const teamsResult = result.map(
    ({
      ageClass,
      result,
      gender,
      name,
      startNr,
      boatType,
      slag,
      block,
      id,
    }) => {
      const startTimeMillis = result?.startTimeA ?? result?.startTimeB;
      const finishTimeMillis = result?.finishTimeA ?? result?.finishTimeB;
      const start = convertTimeToObject(startTimeMillis);
      const finish = convertTimeToObject(finishTimeMillis);
      let correction = 0;
      const key = `${ageClass}${gender}${boatType}`;
      const className = classMap.get(key) ?? '';

      if (startTimeMillis && finishTimeMillis) {
        const difference =
          Number.parseInt(finishTimeMillis) - Number.parseInt(startTimeMillis);
        const correctionAgeSex =
          correctionAgeSexMap.get(`${ageClass}${gender}`) ?? 0;
        const correctionBoat = correctionBoatMap.get(boatType) ?? 0;
        const totalCorrection = correctionAgeSex * correctionBoat;

        correction = difference * totalCorrection;
      }
      const difference =
        start.dateTime && finish.dateTime
          ? getDifference(start.dateTime, finish.dateTime)
          : null;

      return {
        id,
        startNr,
        name,
        slag: slag?.name,
        difference,
        ageClass,
        block,
        className,
        correction: correction
          ? Duration.fromMillis(correction).toFormat("hh:mm:ss.SSS'")
          : null,
        result,
      };
    }
  );

  return NextResponse.json({ teamsResult });
}

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }

  const args = postResultsForTeamSchema.safeParse(await req.json());

  if (!args.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: args.error },
      { status: 400 }
    );
  }

  const {
    data: { id, useStartA, useFinishA },
  } = args;
  const team = await teamService.getTeam(id, wedstrijdId);

  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  team.result = { ...team.result, useStartA, useFinishA };
  await teamService.saveTeam(team);

  return NextResponse.json({ success: true });
}

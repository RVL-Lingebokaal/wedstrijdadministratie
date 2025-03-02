import { NextRequest, NextResponse } from 'next/server';
import { downloadService } from '@services';

export async function GET(req: NextRequest) {
  try {
    // Create a new Excel workbook
    const buffer = await downloadService.getBootControle();

    // Set response headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename=bootcontrole.xlsx',
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error('Error generating Excel file:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

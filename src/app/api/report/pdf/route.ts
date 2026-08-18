import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const pdfPath = path.join(process.cwd(), 'public', 'RIZON_Full_System_Testing_Report.pdf');
    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json({ error: 'PDF report not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(pdfPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="RIZON_Full_System_Testing_Report.pdf"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}

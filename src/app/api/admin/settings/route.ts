import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany(); // 👈 حالا جدول Setting وجود داره
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { settings } = body; // آرایه‌ای از { key, value }

    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: "داده‌های نامعتبر" }, { status: 400 });
    }

    // ذخیره هر تنظیمات به صورت جداگانه
    for (const item of settings) { // 👈 خطای any با اینجا رفع شد (چون settings رو آرایه گرفتیم)
      await prisma.setting.upsert({
        where: { key: item.key },
        update: { value: String(item.value) },
        create: { key: item.key, value: String(item.value) }
      });
    }

    return NextResponse.json({ success: true, message: "تنظیمات با موفقیت ذخیره شد." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, basename } from 'path';
import { requireAdminAuth } from '@/lib/auth';

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const SAFE_NAME_REGEX = /[^a-zA-Z0-9._-]/g;

export async function POST(request: Request) {
  try {
    const session = await requireAdminAuth(request);
    if (!session) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof (file as any).arrayBuffer !== 'function') {
      return NextResponse.json({ error: '업로드할 파일이 없습니다.' }, { status: 400 });
    }

    const uploadFile = file as File;
    if (!ALLOWED_MIME_TYPES.includes(uploadFile.type)) {
      return NextResponse.json(
        { error: '허용되지 않는 파일 형식입니다. JPG, PNG, WEBP만 업로드 가능합니다.' },
        { status: 400 }
      );
    }

    if (uploadFile.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: `파일 크기는 ${MAX_UPLOAD_SIZE / 1024 / 1024}MB 이하만 허용됩니다.` },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const safeName = basename(uploadFile.name).replace(SAFE_NAME_REGEX, '_');
    const filename = `${Date.now()}_${safeName}`;
    const filePath = join(uploadDir, filename);

    const buffer = Buffer.from(await uploadFile.arrayBuffer());
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: '업로드 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

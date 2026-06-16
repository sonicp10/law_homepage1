import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdminAuth } from '@/lib/auth';

// ✅ Next.js App Router: API Route body 크기 제한 20MB로 확장 (413 오류 해결)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 파일 1개당 최대 10MB
const MAX_FILES = 10; // 업로드 최대 파일 수
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const SAFE_NAME_REGEX = /[^a-zA-Z0-9._-]/g;
const BUCKET_NAME = 'post-images';

export async function POST(request: Request) {
  try {
    // 관리자 인증 확인
    const session = await requireAdminAuth(request);
    if (!session) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
    }

    const formData = await request.formData();

    // ✅ 다중 파일 지원: 'file' 필드를 여러 개 가져오기
    const files = formData.getAll('file') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: '업로드할 파일이 없습니다.' }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `한 번에 최대 ${MAX_FILES}개까지만 업로드할 수 있습니다.` },
        { status: 400 }
      );
    }

    // ✅ 요청 시점에 Supabase 클라이언트 생성
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    for (const uploadFile of files) {
      // MIME 타입 검증
      if (!ALLOWED_MIME_TYPES.includes(uploadFile.type)) {
        errors.push(`${uploadFile.name}: 허용되지 않는 파일 형식 (JPG, PNG, WEBP, GIF만 가능)`);
        continue;
      }

      // 파일 크기 검증
      if (uploadFile.size > MAX_FILE_SIZE) {
        errors.push(`${uploadFile.name}: 파일 크기 초과 (${MAX_FILE_SIZE / 1024 / 1024}MB 이하만 가능)`);
        continue;
      }

      // 안전한 파일명 생성
      const ext = uploadFile.name.split('.').pop() || 'jpg';
      const safeName = uploadFile.name.replace(/\.[^.]+$/, '').replace(SAFE_NAME_REGEX, '_');
      const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}_${safeName}.${ext}`;

      // 파일을 ArrayBuffer → Uint8Array 변환
      const arrayBuffer = await uploadFile.arrayBuffer();
      const fileBuffer = new Uint8Array(arrayBuffer);

      // Supabase Storage 버킷에 업로드
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filename, fileBuffer, {
          contentType: uploadFile.type,
          upsert: false,
        });

      if (error) {
        console.error('Supabase Storage 업로드 오류:', error);
        errors.push(`${uploadFile.name}: 업로드 실패 (${error.message})`);
        continue;
      }

      // Public URL 생성
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filename);

      uploadedUrls.push(urlData.publicUrl);
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: `모든 파일 업로드에 실패했습니다.\n${errors.join('\n')}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      // 단일 파일 호환성 유지
      url: uploadedUrls[0],
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: '업로드 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

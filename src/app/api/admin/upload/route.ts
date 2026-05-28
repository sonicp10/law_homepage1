import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdminAuth } from '@/lib/auth';

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const SAFE_NAME_REGEX = /[^a-zA-Z0-9._-]/g;

// Supabase Admin 클라이언트 (Storage 업로드용)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

const BUCKET_NAME = 'post-images';

export async function POST(request: Request) {
  try {
    // 관리자 인증 확인
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

    // MIME 타입 검증
    if (!ALLOWED_MIME_TYPES.includes(uploadFile.type)) {
      return NextResponse.json(
        { error: '허용되지 않는 파일 형식입니다. JPG, PNG, WEBP, GIF만 업로드 가능합니다.' },
        { status: 400 }
      );
    }

    // 파일 크기 검증
    if (uploadFile.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: `파일 크기는 ${MAX_UPLOAD_SIZE / 1024 / 1024}MB 이하만 허용됩니다.` },
        { status: 400 }
      );
    }

    // 안전한 파일명 생성
    const ext = uploadFile.name.split('.').pop() || 'jpg';
    const safeName = uploadFile.name.replace(/\.[^.]+$/, '').replace(SAFE_NAME_REGEX, '_');
    const filename = `${Date.now()}_${safeName}.${ext}`;

    // 파일을 ArrayBuffer → Uint8Array 변환
    const arrayBuffer = await uploadFile.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // Supabase Storage 버킷에 업로드
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filename, fileBuffer, {
        contentType: uploadFile.type,
        upsert: false,
      });

    if (error) {
      // 버킷이 없는 경우 자동 생성 시도
      if (error.message?.includes('Bucket not found') || error.message?.includes('bucket')) {
        // 버킷 생성 시도
        const { error: createError } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
          public: true,
          allowedMimeTypes: ALLOWED_MIME_TYPES,
          fileSizeLimit: MAX_UPLOAD_SIZE,
        });

        if (createError) {
          console.error('Bucket 생성 실패:', createError);
          return NextResponse.json(
            { error: `스토리지 버킷을 생성하지 못했습니다: ${createError.message}` },
            { status: 500 }
          );
        }

        // 버킷 생성 후 재업로드
        const { data: retryData, error: retryError } = await supabaseAdmin.storage
          .from(BUCKET_NAME)
          .upload(filename, fileBuffer, {
            contentType: uploadFile.type,
            upsert: false,
          });

        if (retryError) {
          console.error('재업로드 실패:', retryError);
          return NextResponse.json(
            { error: `이미지 업로드에 실패했습니다: ${retryError.message}` },
            { status: 500 }
          );
        }
      } else {
        console.error('Supabase Storage 업로드 오류:', error);
        return NextResponse.json(
          { error: `이미지 업로드에 실패했습니다: ${error.message}` },
          { status: 500 }
        );
      }
    }

    // Public URL 생성
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: '업로드 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

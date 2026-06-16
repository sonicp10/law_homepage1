'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { Extension, Node, mergeAttributes } from '@tiptap/core';

// ── 폰트 크기 조절 커스텀 Tiptap 확장 ─────────────────────────
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize: null }).run();
      },
    } as any;
  },
});

// ── 구분선 클래스 보존용 커스텀 HorizontalRule Node ─────────────────
const CustomHorizontalRule = Node.create({
  name: 'horizontalRule',
  group: 'block',
  addAttributes() {
    return {
      class: {
        default: 'hr-solid',
        parseHTML: element => element.getAttribute('class') || 'hr-solid',
        renderHTML: attributes => {
          return { class: attributes.class };
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: 'hr' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['hr', mergeAttributes(HTMLAttributes)];
  },
  addCommands() {
    return {
      setHorizontalRule: () => ({ chain }) => {
        return chain()
          .insertContent({ type: this.name })
          .run();
      },
    } as any;
  },
});

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// ── 툴바 버튼 컴포넌트 ──────────────────────────────────────
const ToolBtn = ({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }}
    className={`flex items-center justify-center w-8 h-8 rounded-md text-sm font-bold transition-all select-none
      ${active
        ? 'bg-[#A67C52] text-white shadow-sm'
        : 'text-[#2C3E50]/70 hover:bg-gray-100 hover:text-[#2C3E50]'
      }`}
  >
    <span className="pointer-events-none flex items-center justify-center w-full h-full">
      {children}
    </span>
  </button>
);

const Divider = () => <div className="w-px h-6 bg-gray-200 mx-0.5" />;

// ── 메인 에디터 컴포넌트 ─────────────────────────────
interface UploadProgress {
  uploading: boolean;
  current: number;
  total: number;
}

export default function RichEditor({ value, onChange, placeholder = '내용을 입력하세요...' }: RichEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textColorInputRef = useRef<HTMLInputElement>(null);
  const highlightColorInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ uploading: false, current: 0, total: 0 });
  const [isDragOver, setIsDragOver] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
        horizontalRule: false, // 기존 내장 hr 비활성화
      }),
      CustomHorizontalRule,
      Underline,
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose-editor min-h-[550px] pt-8 px-6 pb-6 focus:outline-none',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // ✅ 통합 이미지 업로드 함수 (다중 파일 지원)
  const uploadFiles = useCallback(async (files: File[]) => {
    if (!editor || files.length === 0) return;

    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setUploadProgress({ uploading: true, current: 0, total: imageFiles.length });

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      setUploadProgress(prev => ({ ...prev, current: i + 1 }));

      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        if (!res.ok) {
          let errMsg = `업로드 실패 (${res.status})`;
          try {
            const errData = await res.json();
            if (errData.error) errMsg = errData.error;
          } catch {}
          alert(`[${file.name}] ${errMsg}`);
          continue;
        }
        const data = await res.json();
        if (data.success && data.url) {
          editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
          // 여러 이미지 사이 줄바꿼 삽입
          if (i < imageFiles.length - 1) {
            editor.chain().focus().insertContent('<p></p>').run();
          }
        } else {
          alert(data.error || '이미지 업로드에 실패했습니다.');
        }
      } catch (err: any) {
        alert(`[${file.name}] 서버 연결 오류: ${err?.message || '알 수 없는 오류'}`);
      }
    }

    setUploadProgress({ uploading: false, current: 0, total: 0 });
  }, [editor]);

  // 파일 input change 핸들러
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await uploadFiles(files);
    e.target.value = '';
  }, [uploadFiles]);

  // ✅ 드래그 앤 드롭 핸들러들
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  }, [uploadFiles]);

  // 링크 삽입
  const handleLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('URL을 입력하세요:', prev);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
    }
  }, [editor]);

  // 이미지 URL 삽입
  const handleImageUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('이미지 URL을 입력하세요:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  // 글자색 변경
  const handleColor = useCallback((color: string) => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
  }, [editor]);

  // 하이라이트 색 변경
  const handleHighlight = useCallback((color: string) => {
    if (!editor) return;
    editor.chain().focus().toggleHighlight({ color }).run();
  }, [editor]);

  // 프리미엄 구분선 삽입
  const handleInsertDivider = useCallback((type: 'solid' | 'dashed' | 'gradient' | 'wavy') => {
    if (!editor) return;
    let className = 'hr-solid';
    if (type === 'dashed') className = 'hr-dashed';
    else if (type === 'gradient') className = 'hr-gradient';
    else if (type === 'wavy') className = 'hr-wavy';

    editor.chain().focus().insertContent({
      type: 'horizontalRule',
      attrs: { class: className }
    }).run();
  }, [editor]);

  // 프리미엄 서식 템플릿 삽입
  const handleInsertTemplate = useCallback((type: 'success' | 'guide' | 'cta' | 'profile' | 'procedure' | 'qa' | 'compare') => {
    if (!editor) return;
    let html = '';
    if (type === 'success') {
      html = `<blockquote class="template-success-story" style="border-left: 4px solid #A67C52; padding: 1.5em; background: #FDF8F3; border-radius: 12px; margin: 1.5em 0;">
  <h3 style="margin-top: 0; color: #8B6840; font-size: 1.3em;">🏆 법원 인가 성공사례 브리핑</h3>
  <table style="width:100%; border-collapse:collapse; margin-top:1em; font-size:0.95em;">
    <tr style="border-bottom:1px solid #E8E4D8;"><td style="padding:8px 0; font-weight:bold; color:#2C3E50; width:30%;">총 채무액</td><td style="padding:8px 0; color:#5a6a7a;">[8,500만 원]</td></tr>
    <tr style="border-bottom:1px solid #E8E4D8;"><td style="padding:8px 0; font-weight:bold; color:#2C3E50;">총 탕감액</td><td style="padding:8px 0; color:#E53E3E; font-weight:bold;">[7,200만 원 (탕감률 84%)]</td></tr>
    <tr style="border-bottom:1px solid #E8E4D8;"><td style="padding:8px 0; font-weight:bold; color:#2C3E50;">월 변제금</td><td style="padding:8px 0; color:#5a6a7a;">[월 36만 원 (36개월)]</td></tr>
    <tr><td style="padding:8px 0; font-weight:bold; color:#2C3E50;">사건 특징</td><td style="padding:8px 0; color:#5a6a7a;">최근 대출 비율이 높아 기각 우려가 컸으나 변제 계획안 보정을 거쳐 법원의 빠른 인가 결정을 받아낸 사례입니다.</td></tr>
  </table>
</blockquote><p></p>`;
    } else if (type === 'guide') {
      html = `<div class="template-guide-box" style="border: 1px solid #E8E4D8; padding: 1.5em; border-radius: 16px; background: #FAF9F6; margin: 1.5em 0;">
  <h3 style="margin-top: 0; color: #2C3E50; font-size: 1.25em;">📌 핵심 체크리스트</h3>
  <ol style="margin-bottom:0; padding-left: 1.5em;">
    <li style="margin: 0.5em 0;"><strong>자격 요건 분석:</strong> 재산보다 채무가 많아야 하며, 소득 증빙이 최우선입니다.</li>
    <li style="margin: 0.5em 0;"><strong>최근 채무 소명:</strong> 사용처를 투명하게 입증하는 소명 자료를 보정 단계에서 철저히 대비해야 합니다.</li>
    <li style="margin: 0.5em 0;"><strong>생계비 공제 극대화:</strong> 추가 생계비를 최대한 인정받아 월 변제금을 낮춰야 완주할 수 있습니다.</li>
  </ol>
</div><p></p>`;
    } else if (type === 'cta') {
      html = `<div class="template-cta-box" style="background: linear-gradient(135deg, #2C3E50, #1a2634); color: white; padding: 2em; border-radius: 20px; text-align: center; margin: 2.5em 0; box-shadow: 0 8px 30px rgba(44,62,80,0.15);">
  <h4 style="margin: 0 0 0.5em; font-size: 1.4em; font-weight: bold; color: #FFF176;">⚖️ 나도 개인회생/파산 자격이 될까?</h4>
  <p style="margin: 0 0 1.2em; font-size: 0.95em; opacity: 0.85; line-height: 1.6;">복잡한 서류 없이, 30초면 자격 요건 및 월 예상 변제금을 확인하실 수 있습니다.</p>
  <div style="display: inline-block;">
    <a href="/qna/board" style="display: inline-block; padding: 0.8em 2em; background: #A67C52; color: white !important; font-weight: bold; border-radius: 12px; text-decoration: none !important; transition: all 0.2s; font-size: 0.95em;">
      👉 30초 간편 자격진단 신청하기
    </a>
  </div>
</div><p></p>`;
    } else if (type === 'profile') {
      html = `<div class="template-profile-card" style="border: 1px solid #E8E4D8; padding: 2em; border-radius: 20px; background: #FFFFFF; box-shadow: 0 4px 20px rgba(0,0,0,0.03); margin: 1.5em 0; display: flex; gap: 1.5em; flex-wrap: wrap; align-items: center;">
  <div style="flex: 1; min-width: 250px;">
    <span style="background: #A67C52; color: white; padding: 4px 10px; border-radius: 6px; font-size: 0.8em; font-weight: bold; display: inline-block; margin-bottom: 0.8em;">대표 법무사</span>
    <h3 style="margin: 0 0 0.5em; color: #2C3E50; font-size: 1.4em; font-weight: bold;">김형근 법무사</h3>
    <p style="margin: 0 0 1.2em; color: #718096; font-size: 0.95em; line-height: 1.7;">
      "실패는 끝이 아니라 새로운 시작입니다. 15년 이상의 풍부한 실무 경험과 법원 보정 노하우로 의뢰인의 무거운 짐을 확실하게 덜어드리겠습니다."
    </p>
    <ul style="list-style-type: none; padding-left: 0; margin: 0; font-size: 0.85em; color: #2C3E50; line-height: 1.8;">
      <li style="margin: 0.4em 0; display: flex; align-items: center; gap: 6px;">✔️ 대한법무사협회 정회원</li>
      <li style="margin: 0.4em 0; display: flex; align-items: center; gap: 6px;">✔️ 서울회생법원 개인회생·파산 실무 연수 수료</li>
      <li style="margin: 0.4em 0; display: flex; align-items: center; gap: 6px;">✔️ 前 법원 연계 무료법률상담 위원</li>
    </ul>
  </div>
</div><p></p>`;
    } else if (type === 'procedure') {
      html = `<div class="template-timeline" style="background: #FAF9F6; border: 1px solid #E8E4D8; padding: 2em; border-radius: 20px; margin: 1.5em 0;">
  <h3 style="margin-top: 0; color: #2C3E50; font-size: 1.25em; margin-bottom: 1.5em; text-align: center; font-weight: bold;">📋 개인회생 진행 절차 핵심 요약</h3>
  <div style="display: flex; flex-direction: column; gap: 1.2em;">
    <div style="display: flex; gap: 1em; align-items: flex-start;">
      <div style="background: #2C3E50; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 0.85em;">1</div>
      <div>
        <h4 style="margin: 0 0 0.2em; color: #2C3E50; font-size: 0.95em; font-weight: bold;">신청서 접수 및 금지명령 (1~2주)</h4>
        <p style="margin: 0; color: #718096; font-size: 0.85em; line-height: 1.5;">법원에 신청서를 제출하면 1~2주 내에 채권추심과 독촉을 차단하는 금지명령이 내려집니다.</p>
      </div>
    </div>
    <div style="display: flex; gap: 1em; align-items: flex-start;">
      <div style="background: #A67C52; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 0.85em;">2</div>
      <div>
        <h4 style="margin: 0 0 0.2em; color: #2C3E50; font-size: 0.95em; font-weight: bold;">개시결정 및 채권자집회 (2~3개월)</h4>
        <p style="margin: 0; color: #718096; font-size: 0.85em; line-height: 1.5;">회생위원의 보정 권고를 거쳐 개시결정이 내려지며, 법원에 출석하여 채권자집회에 참석합니다.</p>
      </div>
    </div>
    <div style="display: flex; gap: 1em; align-items: flex-start;">
      <div style="background: #38A169; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 0.85em;">3</div>
      <div>
        <h4 style="margin: 0 0 0.2em; color: #2C3E50; font-size: 0.95em; font-weight: bold;">인가결정 및 면책 (36~60개월 변제)</h4>
        <p style="margin: 0; color: #718096; font-size: 0.85em; line-height: 1.5;">변제계획안대로 매월 법원에 변제금을 납부하고, 납부가 완료되면 남은 채무를 면책받아 소멸시킵니다.</p>
      </div>
    </div>
  </div>
</div><p></p>`;
    } else if (type === 'qa') {
      html = `<div class="template-faq-box" style="border: 1px dashed #A67C52; padding: 1.5em; border-radius: 16px; background: #FFFDF9; margin: 1.5em 0;">
  <h4 style="margin-top: 0; color: #8B6840; font-size: 1.1em; display: flex; align-items: center; gap: 8px; font-weight: bold;">❓ 최근에 받은 대출이 많은데 기각될까요?</h4>
  <p style="margin: 0.5em 0 0; color: #5A6A7A; font-size: 0.95em; line-height: 1.7; padding-left: 20px;">
    <strong>답변:</strong> 최근 채무 비율이 높아도 기각 사유가 되지는 않습니다. 다만, 최근 대출금의 구체적인 사용처(생활비, 타 채무 대환, 사업자금 등)에 대한 소명 자료를 철저히 준비하고 보정 계획에 반영한다면, 기각 없이 원활하게 법원 인가를 받으실 수 있습니다.
  </p>
</div><p></p>`;
    } else if (type === 'compare') {
      html = `<div class="template-comparison-box" style="border: 1px solid #E8E4D8; border-radius: 20px; overflow: hidden; margin: 2em 0; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
  <div style="background: #2C3E50; color: white; padding: 1em; text-align: center; font-weight: bold; font-size: 1.1em;">
    ⚖️ 개인회생 신청 전 vs 후 변화 비교
  </div>
  <table style="width: 100%; border-collapse: collapse; font-size: 0.9em; text-align: center;">
    <thead>
      <tr style="background: #FAF9F6; border-bottom: 1px solid #E8E4D8;">
        <th style="padding: 12px; font-weight: bold; color: #2C3E50; width: 33%;">구분</th>
        <th style="padding: 12px; font-weight: bold; color: #E53E3E; width: 33%;">제도 신청 전</th>
        <th style="padding: 12px; font-weight: bold; color: #38A169; width: 33%;">인가 결정 후</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #E8E4D8;">
        <td style="padding: 12px; font-weight: bold; color: #2C3E50;">월 채무 변제액</td>
        <td style="padding: 12px; color: #E53E3E; text-decoration: line-through;">월 [250만 원]</td>
        <td style="padding: 12px; color: #38A169; font-weight: bold;">월 [45만 원] (82% 절감)</td>
      </tr>
      <tr style="border-bottom: 1px solid #E8E4D8;">
        <td style="padding: 12px; font-weight: bold; color: #2C3E50;">채권 추심 / 독촉</td>
        <td style="padding: 12px; color: #E53E3E;">빗발치는 전화 & 압류 위협</td>
        <td style="padding: 12px; color: #38A169; font-weight: bold;">법적 전면 금지 (추심 제로)</td>
      </tr>
      <tr>
        <td style="padding: 12px; font-weight: bold; color: #2C3E50;">이자 및 원금 탕감</td>
        <td style="padding: 12px; color: #E53E3E;">이자 누적으로 채무 증식</td>
        <td style="padding: 12px; color: #38A169; font-weight: bold;">이자 100% 면제 + 원금 최대 90% 탕감</td>
      </tr>
    </tbody>
  </table>
</div><p></p>`;
    }
    editor.chain().focus().insertContent(html).run();
  }, [editor]);

  if (!editor) return null;

  const wordCount = editor.getText().trim().split(/\s+/).filter(Boolean).length;
  const charCount = editor.getText().length;
  const charCountWithoutSpaces = editor.getText().replace(/\s/g, '').length;

  return (
    <div
      className={`border rounded-2xl overflow-hidden bg-white shadow-sm relative transition-all duration-200
        ${
          isDragOver
            ? 'border-[#A67C52] border-2 shadow-[0_0_0_4px_rgba(166,124,82,0.15)] ring-0'
            : 'border-[var(--border)]'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* ── 드래그 오버레이 ──────────────────────── */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#FDF8F3]/95 backdrop-blur-sm rounded-2xl pointer-events-none">
          <div className="text-6xl mb-4">🖼️</div>
          <p className="text-2xl font-black text-[#A67C52]">이미지를 여기에 놓으세요</p>
          <p className="text-sm text-[#A67C52]/70 mt-2 font-medium">JPG, PNG, WEBP, GIF · 파일당 최대 10MB</p>
        </div>
      )}

      {/* ── 업로드 진행 오버레이 ───────────────── */}
      {uploadProgress.uploading && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl">
          <div className="w-16 h-16 rounded-full border-4 border-[#A67C52]/20 border-t-[#A67C52] animate-spin mb-5" />
          <p className="text-lg font-bold text-[#2C3E50]">
            이미지 업로드 중... ({uploadProgress.current}/{uploadProgress.total})
          </p>
          <div className="mt-4 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#A67C52] rounded-full transition-all duration-300"
              style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">잠시만 기다려주세요...</p>
        </div>
      )}
      {/* ── 툴바 ─────────────────────────────── */}
      <div className="sticky top-[60px] md:top-0 z-30 bg-white border-b border-[var(--border)] px-3 py-2 flex flex-wrap items-center gap-1.5">

        {/* 헤딩 드롭다운 */}
        <select
          value={
            editor.isActive('heading', { level: 1 }) ? '1'
            : editor.isActive('heading', { level: 2 }) ? '2'
            : editor.isActive('heading', { level: 3 }) ? '3'
            : '0'
          }
          onChange={(e) => {
            const level = parseInt(e.target.value);
            if (level === 0) editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: level as 1|2|3 }).run();
          }}
          className="h-8 px-2 text-sm font-bold border border-gray-200 rounded-md text-[#2C3E50] bg-white cursor-pointer focus:outline-none hover:border-[#A67C52] transition-colors"
          title="문단 스타일"
        >
          <option value="0">본문</option>
          <option value="1">제목 1</option>
          <option value="2">제목 2</option>
          <option value="3">제목 3</option>
        </select>

        {/* 글자 크기 드롭다운 */}
        <select
          onChange={(e) => {
            const size = e.target.value;
            if (size === 'default') {
              (editor.commands as any).unsetFontSize();
            } else {
              (editor.commands as any).setFontSize(size);
            }
          }}
          className="h-8 px-2 text-sm font-bold border border-gray-200 rounded-md text-[#2C3E50] bg-white cursor-pointer focus:outline-none hover:border-[#A67C52] transition-colors"
          defaultValue="default"
          title="글자 크기"
        >
          <option value="default">크기</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="32px">32px</option>
        </select>

        {/* 프리미엄 서식 템플릿 */}
        <select
          onChange={(e) => {
            const template = e.target.value;
            if (template !== 'none') {
              handleInsertTemplate(template as any);
              e.target.value = 'none';
            }
          }}
          className="h-8 px-2.5 text-sm font-bold border border-[#A67C52]/30 rounded-md text-white bg-[#A67C52] cursor-pointer focus:outline-none hover:bg-[#8B6840] transition-colors shadow-sm ml-auto sm:ml-0"
          defaultValue="none"
          title="서식 템플릿 불러오기"
        >
          <option value="none">⭐ 서식 템플릿</option>
          <option value="success">성공사례 브리핑</option>
          <option value="guide">법률 정보 가이드</option>
          <option value="cta">상담 유도 CTA</option>
          <option value="profile">대표 법무사 프로필</option>
          <option value="procedure">개인회생 진행 절차</option>
          <option value="qa">자주 묻는 질문 FAQ</option>
          <option value="compare">신청 전후 비교표</option>
        </select>

        <Divider />

        {/* 텍스트 스타일 */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="굵게 (Ctrl+B)">
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="기울임 (Ctrl+I)">
          <em>I</em>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="밑줄 (Ctrl+U)">
          <span className="underline">U</span>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="취소선">
          <span className="line-through">S</span>
        </ToolBtn>

        <Divider />

        {/* 글자색 & 하이라이트 */}
        <div className="relative group">
          <button
            type="button"
            title="글자색"
            className="flex flex-col items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors gap-0.5"
          >
            <span className="text-xs font-black text-[#2C3E50]">A</span>
            <div className="w-5 h-1 rounded-full bg-[#E53E3E]" />
          </button>
          <div className="absolute top-full left-0 mt-1 p-2.5 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 grid grid-cols-7 gap-1 w-[215px]">
            {[
              '#000000', '#2C3E50', '#5A6A7A', '#718096', 
              '#E53E3E', '#C53030', '#FEB2B2', '#ED8936', 
              '#D69E2E', '#C5A059', '#F6AD55', '#38A169', 
              '#48BB78', '#9AE6B4', '#3182CE', '#4299E1', 
              '#90CAF9', '#805AD5', '#9F7AEA', '#E9D8FD'
            ].map(c => (
              <button
                key={c}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); handleColor(c); }}
                className="w-6 h-6 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
            {/* 커스텀 컬러 피커 버튼 */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                textColorInputRef.current?.click();
              }}
              className="w-6 h-6 rounded-full border border-gray-300 bg-gradient-to-tr from-red-400 via-green-400 to-blue-500 hover:scale-110 transition-transform flex items-center justify-center"
              title="사용자 지정 색상 선택"
            >
              <span className="text-[10px] text-white font-bold drop-shadow-sm">+</span>
            </button>
            <button 
              type="button" 
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetColor().run(); }} 
              className="w-6 h-6 rounded-full border border-gray-300 bg-white text-gray-400 text-[9px] font-bold hover:bg-gray-50 flex items-center justify-center"
              title="색상 초기화"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="relative group">
          <button
            type="button"
            title="하이라이트"
            className="flex flex-col items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors gap-0.5"
          >
            <span className="text-xs font-black text-[#2C3E50] px-0.5" style={{ backgroundColor: '#FFF176' }}>HL</span>
          </button>
          <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 grid grid-cols-5 gap-1.5 w-[160px]">
            {[
              '#FFF176', '#FFEEBA', '#FEEBC8', '#B9F6CA', 
              '#E6FFFA', '#C6F6D5', '#B3E5FC', '#EBF4FF', 
              '#E2E8F0', '#FFCCBC', '#E1BEE7', '#FDE8E8'
            ].map(c => (
              <button
                key={c}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); handleHighlight(c); }}
                className="w-6 h-6 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
            {/* 커스텀 하이라이트 피커 버튼 */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                highlightColorInputRef.current?.click();
              }}
              className="w-6 h-6 rounded-full border border-gray-300 bg-gradient-to-tr from-red-400 via-green-400 to-blue-500 hover:scale-110 transition-transform flex items-center justify-center"
              title="사용자 지정 하이라이트 선택"
            >
              <span className="text-[10px] text-white font-bold drop-shadow-md">+</span>
            </button>
            <button 
              type="button" 
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetHighlight().run(); }} 
              className="w-6 h-6 rounded-full border border-gray-300 bg-white text-gray-400 text-[9px] font-bold hover:bg-gray-50 flex items-center justify-center"
              title="하이라이트 초기화"
            >
              ✕
            </button>
          </div>
        </div>

        <Divider />

        {/* 정렬 */}
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="왼쪽 정렬">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M2 3.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5z"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="가운데 정렬">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4 3.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-2 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm2 3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-2 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="오른쪽 정렬">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M6 3.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-4 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm4 3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-4 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z"/></svg>
        </ToolBtn>

        <Divider />

        {/* 목록 */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="비순서 목록">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5 11.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm-3 1a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2z"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="순서 목록">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5 11.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM1 12a1 1 0 112 0 1 1 0 01-2 0zm0-4a1 1 0 112 0 1 1 0 01-2 0zm0-4a1 1 0 112 0 1 1 0 01-2 0z"/></svg>
        </ToolBtn>

        <Divider />

        {/* 인용구 & 구분선 */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="인용구">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="코드 블록">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </ToolBtn>

        {/* 프리미엄 구분선 선택 */}
        <select
          onChange={(e) => {
            const type = e.target.value;
            if (type !== 'none') {
              handleInsertDivider(type as any);
              e.target.value = 'none';
            }
          }}
          className="h-8 px-2 text-sm font-bold border border-gray-200 rounded-md text-[#2C3E50] bg-white cursor-pointer focus:outline-none hover:border-[#A67C52] transition-colors"
          defaultValue="none"
          title="구분선 스타일 삽입"
        >
          <option value="none">구분선</option>
          <option value="solid">실선</option>
          <option value="dashed">점선</option>
          <option value="gradient">그라데이션</option>
          <option value="wavy">물결선</option>
        </select>

        <Divider />

        {/* 이미지 & 링크 */}
        <ToolBtn onClick={() => fileInputRef.current?.click()} active={false} title="이미지 업로드">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </ToolBtn>
        <ToolBtn onClick={handleImageUrl} active={false} title="이미지 URL">
          <span className="text-[10px] font-black">URL</span>
        </ToolBtn>
        <ToolBtn onClick={handleLink} active={editor.isActive('link')} title="링크 삽입">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
        </ToolBtn>

        <Divider />

        {/* 실행취소 / 다시실행 */}
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} active={false} title="실행취소 (Ctrl+Z)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 00-4-4H4"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} active={false} title="다시실행 (Ctrl+Y)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 014-4h12"/></svg>
        </ToolBtn>
      </div>

      {/* ── 숨겨진 파일 입력 ────────────────── */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageUpload}
      />
      {/* ── 숨겨진 컬러 피커 입력 ─────────────────── */}
      <input
        ref={textColorInputRef}
        type="color"
        className="hidden"
        onChange={(e) => handleColor(e.target.value)}
      />
      <input
        ref={highlightColorInputRef}
        type="color"
        className="hidden"
        onChange={(e) => handleHighlight(e.target.value)}
      />

      {/* ── 에디터 본문 ──────────────────────── */}
      <EditorContent editor={editor} />

      {/* 네이버 블로그 스타일 글자수 세기 플로팅 박스 */}
      <div className="absolute bottom-16 left-6 z-20 bg-black/80 text-white rounded-xl px-3 py-2 text-xs font-semibold select-none flex flex-col shadow-lg backdrop-blur-sm pointer-events-none transition-all duration-300">
        <span className="text-[9px] text-white/50 uppercase tracking-wider mb-0.5 font-bold">실시간 자수 계산기</span>
        <div className="flex gap-2.5 items-center font-bold">
          <span>공백 포함 <strong className="text-[#FFF176]">{charCount.toLocaleString()}</strong>자</span>
          <span className="text-white/20">|</span>
          <span>공백 제외 <strong className="text-[#B9F6CA]">{charCountWithoutSpaces.toLocaleString()}</strong>자</span>
        </div>
      </div>

      {/* ── 상태바 ───────────────────────────── */}
      <div className="border-t border-[var(--border)] px-4 py-2 flex items-center justify-between bg-gray-50/60">
        <span className="text-xs text-[#2C3E50]/40 font-medium">
          글자 {charCount.toLocaleString()}자 · 단어 {wordCount.toLocaleString()}개
        </span>
        <span className="text-[10px] text-[#2C3E50]/30 font-medium uppercase tracking-widest">Tiptap Editor</span>
      </div>
    </div>
  );
}

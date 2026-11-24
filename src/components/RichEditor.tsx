'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
const BubbleMenuComponent = BubbleMenu as any;
import type { NodeViewProps } from '@tiptap/react';
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
      setFontSize: (fontSize: string) => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize: null }).run();
      },
    } as any;
  },
});

// ── 추천 서체(Font Family) 변경 커스텀 Tiptap 확장 ──────────────
export const RECOMMENDED_FONTS = [
  { label: '프리텐다드 (기본·추천)', value: "'Pretendard Variable', Pretendard, sans-serif", group: '본문 고딕 (가독성 추천)' },
  { label: '나눔스퀘어 (단정·깔끔)', value: "'NanumSquare', sans-serif", group: '본문 고딕 (가독성 추천)' },
  { label: '본고딕 (Noto Sans KR)', value: "'Noto Sans KR', sans-serif", group: '본문 고딕 (가독성 추천)' },
  { label: '나눔고딕 (네이버 표준)', value: "'Nanum Gothic', sans-serif", group: '본문 고딕 (가독성 추천)' },
  { label: '고운돋움 (부드러운 돋움)', value: "'Gowun Dodum', sans-serif", group: '본문 고딕 (가독성 추천)' },
  { label: '마루부리 (네이버 프리미엄 명조)', value: "'MaruBuri', serif", group: '판결문·인용 명조 (신뢰감 추천)' },
  { label: '나눔명조 (정통 법률 서체)', value: "'Nanum Myeongjo', serif", group: '판결문·인용 명조 (신뢰감 추천)' },
  { label: '본명조 (Noto Serif KR)', value: "'Noto Serif KR', serif", group: '판결문·인용 명조 (신뢰감 추천)' },
  { label: '고운바탕 (따뜻한 바탕체)', value: "'Gowun Batang', serif", group: '판결문·인용 명조 (신뢰감 추천)' },
  { label: '리디바탕 (전자책 가독성 명조)', value: "'RIDIBatang', serif", group: '판결문·인용 명조 (신뢰감 추천)' },
  { label: '지마켓 산스 (타이틀·강조용)', value: "'GmarketSansMedium', sans-serif", group: '제목·포인트·감성 서체' },
  { label: '교보 손글씨 2019 (사연·후기용)', value: "'Kyobo2019', cursive", group: '제목·포인트·감성 서체' },
  { label: '나눔손글씨 펜 (친근한 메모)', value: "'Nanum Pen Script', cursive", group: '제목·포인트·감성 서체' },
];

const FontFamily = Extension.create({
  name: 'fontFamily',
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
          fontFamily: {
            default: null,
            parseHTML: element => element.style.fontFamily || null,
            renderHTML: attributes => {
              if (!attributes.fontFamily) return {};
              return { style: `font-family: ${attributes.fontFamily}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontFamily: (fontFamily: string) => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontFamily }).run();
      },
      unsetFontFamily: () => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontFamily: null }).run();
      },
    } as any;
  },
});

// ── 줄간격(Line Height) 조절 커스텀 Tiptap 확장 ──────────────────
const LineHeight = Extension.create({
  name: 'lineHeight',
  addOptions() {
    return {
      types: ['paragraph', 'heading'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => element.style.lineHeight || null,
            renderHTML: attributes => {
              if (!attributes.lineHeight) return {};
              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight: (lineHeight: string) => ({ commands }: any) => {
        return ['paragraph', 'heading'].every((type) =>
          commands.updateAttributes(type, { lineHeight })
        );
      },
      unsetLineHeight: () => ({ commands }: any) => {
        return ['paragraph', 'heading'].every((type) =>
          commands.resetAttributes(type, 'lineHeight')
        );
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
      setHorizontalRule: () => ({ chain }: any) => {
        return chain()
          .insertContent({ type: this.name })
          .run();
      },
    } as any;
  },
});

// ── 이미지 정렬/크기/삭제 커스텀 노드뷰 ─────────────────────────────────
function ImageNodeView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isVisible = selected || isHovered;

  const rawStyle = ((node.attrs as any).style as string) || '';
  const textAlign = rawStyle.match(/text-align:\s*(\w+)/)?.[1] || 'center';
  const imgWidth = ((node.attrs as any).width as string) || '100%';

  const setAlign = (align: 'left' | 'center' | 'right') => {
    updateAttributes({ style: `text-align: ${align}` });
  };

  const setWidth = (w: string) => {
    updateAttributes({ width: w });
  };

  return (
    <NodeViewWrapper
      className="relative block w-full my-6"
      style={{ textAlign: textAlign as any }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 이미지 본체 */}
      <img
        src={(node.attrs as any).src}
        alt={(node.attrs as any).alt || ''}
        style={{
          width: imgWidth,
          maxWidth: '100%',
          height: 'auto',
          display: 'inline-block',
          margin: 0,
        }}
        className={`rounded-lg transition-all duration-200 ${
          isVisible ? 'ring-2 ring-[#A67C52] ring-offset-2' : ''
        }`}
        draggable={false}
      />

      {/* 클릭/호버 시 나타나는 컨트롤 툴바 (정렬 · 크기 조절 · 삭제) */}
      <div
        className={`absolute top-2 right-2 flex flex-wrap items-center gap-1 bg-white/95 backdrop-blur-sm p-1.5 rounded-xl shadow-xl border border-gray-200 transition-all duration-200 z-20 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        {/* 정렬 버튼 */}
        {(['left', 'center', 'right'] as const).map((al) => (
          <button
            key={al}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAlign(al);
            }}
            className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors ${
              textAlign === al ? 'bg-[#2C3E50] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={al === 'left' ? '왼쪽 정렬' : al === 'center' ? '가운데 정렬' : '오른쪽 정렬'}
          >
            {al === 'left' ? '좌' : al === 'center' ? '중' : '우'}
          </button>
        ))}

        <div className="w-px h-4 bg-gray-200 mx-0.5" />

        {/* 폭(크기) 비율 버튼 */}
        {(['50%', '75%', '100%'] as const).map((w) => (
          <button
            key={w}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setWidth(w);
            }}
            className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors ${
              imgWidth === w ? 'bg-[#A67C52] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={`이미지 너비 ${w}`}
          >
            {w}
          </button>
        ))}

        <div className="w-px h-4 bg-gray-200 mx-0.5" />

        {/* 삭제 버튼 */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteNode();
          }}
          className="flex items-center gap-1 px-2.5 py-1 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-[11px] font-bold rounded-md shadow-sm transition-all duration-150 select-none"
          title="이미지 삭제"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
          삭제
        </button>
      </div>

      {/* 선택됨 표시 배지 */}
      {selected && (
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#A67C52] text-white text-[10px] font-bold rounded-md shadow-md select-none">
          이미지 선택됨 ({imgWidth})
        </div>
      )}
    </NodeViewWrapper>
  );
}

// ── 커스텀 Image Extension (width, style 속성 보존 + NodeView 포함) ──
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: element => element.getAttribute('width') || element.style.width || '100%',
        renderHTML: attributes => {
          const width = attributes.width || '100%';
          const alignMatch = (attributes.style || '').match(/text-align:\s*(\w+)/)?.[1] || 'center';
          const marginStyle =
            alignMatch === 'left'
              ? 'margin: 1.5em auto 1.5em 0;'
              : alignMatch === 'right'
              ? 'margin: 1.5em 0 1.5em auto;'
              : 'margin: 1.5em auto;';
          return {
            width,
            style: `width: ${width}; max-width: 100%; height: auto; display: block; ${marginStyle} text-align: ${alignMatch};`,
          };
        },
      },
      style: {
        default: 'text-align: center',
        parseHTML: element => element.getAttribute('style') || 'text-align: center',
        renderHTML: () => ({}),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
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

// 외부에서 복사한 HTML 코드(마크다운 코드블록 또는 전체 HTML 문서 포함)를 홈페이지 본문용으로 무손실 정규화
function cleanAndNormalizeHtml(raw: string): string {
  if (!raw) return '';
  let cleaned = raw.trim();

  // 1. 앞뒤 마크다운 코드블록 펜스(```html ... ```) 자동 제거
  cleaned = cleaned.replace(/^```(?:html|HTML|xml)?\s*\r?\n?/i, '').replace(/\r?\n?```\s*$/i, '').trim();

  // 2. <!DOCTYPE html> 또는 <html>...<body> 전체 문서 구조인 경우 <style>과 <body> 내부 콘텐츠를 무손실 추출
  if (/<html[\s>]/i.test(cleaned) || /<!DOCTYPE\s+html/i.test(cleaned) || /<body[\s>]/i.test(cleaned)) {
    const styleMatches = cleaned.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
    const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
      cleaned = [...styleMatches, bodyMatch[1].trim()].join('\n');
    } else {
      cleaned = cleaned
        .replace(/<!DOCTYPE[^>]*>/gi, '')
        .replace(/<\/?(?:html|head|meta|title|body)[^>]*>/gi, '')
        .trim();
    }
  }

  return cleaned;
}

// 클립보드 텍스트가 생 HTML 코드인지 판별
function isRawHtmlCodeText(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim().replace(/^```(?:html|HTML)?\s*/i, '');
  return (
    /^<!DOCTYPE\s+html/i.test(trimmed) ||
    /^<(?:html|style|div|section|article|table|header|main|aside|figure|blockquote|h[1-6]|p|ul|ol)\b[^>]*>/i.test(trimmed)
  ) && /<\/[a-zA-Z0-9]+>/.test(trimmed);
}

// Tiptap 기본 스키마가 훼손할 수 있는 고급 HTML(div, table, style, section, inline layout 등) 포함 여부 판별
function hasComplexHtmlStructure(html: string): boolean {
  if (!html) return false;
  return /<(?:div|table|thead|tbody|tr|td|th|style|section|article|header|footer|aside|nav|figure|figcaption|iframe|svg|details|summary|button)\b/i.test(html);
}

export default function RichEditor({ value, onChange, placeholder = '내용을 입력하세요...' }: RichEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textColorInputRef = useRef<HTMLInputElement>(null);
  const highlightColorInputRef = useRef<HTMLInputElement>(null);
  const htmlTextareaRef = useRef<HTMLTextAreaElement>(null);
  const visualHtmlRef = useRef<HTMLDivElement>(null);

  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ uploading: false, current: 0, total: 0 });
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSymbolPalette, setShowSymbolPalette] = useState(false);
  const [previewMode, setPreviewMode] = useState<'EDIT' | 'HTML' | 'DESKTOP' | 'MOBILE'>('EDIT');
  const [htmlSource, setHtmlSource] = useState<string>(value || '');
  const [splitHtmlPreview, setSplitHtmlPreview] = useState<boolean>(true);
  const [htmlNotice, setHtmlNotice] = useState<string>('');
  // 커서 이동/선택 변경 시 툴바 상태를 강제 갱신하기 위한 카운터
  const [, forceUpdate] = useState(0);

  const isComplexHtml = hasComplexHtmlStructure(htmlSource);

  // 외부 value prop 변경 시(예: 수정 페이지 초기 로드, 임시저장 불러오기) htmlSource 및 에디터 동기화
  useEffect(() => {
    if (value !== undefined && value !== htmlSource) {
      setHtmlSource(value);
    }
  }, [value]);

  const showTempNotice = useCallback((msg: string) => {
    setHtmlNotice(msg);
    setTimeout(() => {
      setHtmlNotice(prev => (prev === msg ? '' : prev));
    }, 4500);
  }, []);

  const applyRawHtml = useCallback((rawInput: string, noticeMsg?: string) => {
    const normalized = cleanAndNormalizeHtml(rawInput);
    setHtmlSource(normalized);
    onChange(normalized);
    if (noticeMsg) showTempNotice(noticeMsg);
  }, [onChange, showTempNotice]);

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
      FontFamily,
      LineHeight,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CustomImage.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose-editor min-h-[550px] pt-8 px-6 pb-6 focus:outline-none',
      },
      // 일반 비주얼 에디터 화면에 생 HTML 코드를 그대로 붙여넣었을 때 텍스트로 깨지지 않고 HTML로 자동 감지·적용
      handlePaste: (_view, event) => {
        const plain = event.clipboardData?.getData('text/plain') || '';
        if (isRawHtmlCodeText(plain)) {
          event.preventDefault();
          const normalized = cleanAndNormalizeHtml(plain);
          setHtmlSource(normalized);
          onChange(normalized);
          setTimeout(() => {
            showTempNotice('✅ 붙여넣으신 HTML 코드가 감지되어 디자인과 서식이 그대로 적용되었습니다!');
          }, 50);
          return true;
        }
        return false;
      },
    },
    onUpdate({ editor }) {
      // 복합 HTML 모드일 때는 Tiptap이 원본 태그를 덮어쓰지 않도록 보호
      if (hasComplexHtmlStructure(htmlSource)) return;
      const html = editor.getHTML();
      setHtmlSource(html);
      onChange(html);
    },
    // 커서 이동/선택 변경 시 툴바(폰트 크기 등)를 실시간으로 갱신
    onSelectionUpdate() {
      forceUpdate(c => c + 1);
    },
    immediatelyRender: false,
  });

  // 단순 HTML이 외부에서 로드되었을 때 Tiptap 에디터 내용도 동기화
  useEffect(() => {
    if (editor && value && !hasComplexHtmlStructure(value) && editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  // 복합 HTML 비주얼 직접 편집기(contentEditable)에 htmlSource 동기화
  useEffect(() => {
    if (previewMode === 'EDIT' && isComplexHtml && visualHtmlRef.current) {
      if (document.activeElement !== visualHtmlRef.current && visualHtmlRef.current.innerHTML !== htmlSource) {
        visualHtmlRef.current.innerHTML = htmlSource;
      }
    }
  }, [previewMode, isComplexHtml, htmlSource]);

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
          // ✅ 이미지 삽입 후 커서를 이미지 노드 바깥(아래)으로 명시적으로 이동
          // focus() 후 setImage → selectNodeForward → createParagraphNear 순서로
          // 커서가 항상 이미지 다음 단락에 위치하도록 보장
          editor
            .chain()
            .focus()
            .setImage({ src: data.url, alt: file.name })
            .run();

          // 이미지 노드 선택 상태를 해제하고 커서를 노드 끝으로 이동
          const { state, dispatch } = editor.view;
          const { tr, selection } = state;
          // 현재 선택된 노드 끝 위치로 커서 이동
          const resolvedPos = state.doc.resolve(selection.to);
          const selectionConstructor = state.selection.constructor as any;
          const newTr = tr.setSelection(
            selectionConstructor?.near
              ? selectionConstructor.near(resolvedPos, 1)
              : state.selection
          );
          dispatch(newTr);

          // 이미지 다음에 빈 단락 삽입 (커서가 이미지 아래에 위치)
          editor.chain().createParagraphNear().run();
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
  const handleInsertDivider = useCallback((type: 'solid' | 'dashed' | 'gradient' | 'wavy' | 'double' | 'diamond') => {
    if (!editor) return;
    let className = 'hr-solid';
    if (type === 'dashed') className = 'hr-dashed';
    else if (type === 'gradient') className = 'hr-gradient';
    else if (type === 'wavy') className = 'hr-wavy';
    else if (type === 'double') className = 'hr-double';
    else if (type === 'diamond') className = 'hr-diamond';

    editor.chain().focus().insertContent({
      type: 'horizontalRule',
      attrs: { class: className }
    }).run();
  }, [editor]);

  // HTML 조각(인용구, 표, 동영상, 템플릿 등)을 현재 상태에 맞게 안전하게 삽입
  const insertHtmlFragment = useCallback((fragment: string) => {
    if (previewMode === 'HTML' || isComplexHtml) {
      const base = htmlSource === '<p></p>' ? '' : htmlSource;
      const nextHtml = base ? `${base}\n${fragment}` : fragment;
      setHtmlSource(nextHtml);
      onChange(nextHtml);
      return;
    }
    if (editor && !hasComplexHtmlStructure(fragment)) {
      editor.chain().focus().insertContent(fragment).run();
    } else {
      const base = (editor ? editor.getHTML() : htmlSource) || '';
      const cleanBase = base === '<p></p>' ? '' : base;
      const nextHtml = cleanBase ? `${cleanBase}\n${fragment}` : fragment;
      setHtmlSource(nextHtml);
      onChange(nextHtml);
    }
  }, [previewMode, isComplexHtml, htmlSource, editor, onChange]);

  // 네이버 블로그 스타일 인용구 / 말풍선 / 법조문 박스 삽입
  const handleInsertQuoteStyle = useCallback((style: 'classic' | 'center' | 'frame' | 'speech' | 'law') => {
    let html = '';
    if (style === 'classic') {
      html = `<blockquote style="border-left: 4px solid #A67C52; padding: 1em 1.5em; background: #FDF8F3; border-radius: 0 12px 12px 0; margin: 1.5em 0; color: #2C3E50;"><p>중요한 핵심 내용이나 의뢰인의 사연을 이곳에 입력하세요.</p></blockquote><p></p>`;
    } else if (style === 'center') {
      html = `<div style="text-align: center; padding: 2em 1.5em; margin: 1.8em 0; background: #FAF9F6; border-top: 2px solid #A67C52; border-bottom: 2px solid #A67C52;"><div style="font-size: 28px; color: #A67C52; line-height: 1; font-family: Georgia, serif;">“</div><p style="font-family: 'MaruBuri', 'Nanum Myeongjo', serif; font-size: 19px; font-weight: bold; color: #2C3E50; margin: 0.6em 0;">감당하기 힘들었던 채무의 무게, 법무사 김형근 사무소가 함께 덜어드리겠습니다.</p><div style="font-size: 28px; color: #A67C52; line-height: 1; font-family: Georgia, serif;">”</div></div><p></p>`;
    } else if (style === 'frame') {
      html = `<div style="border: 2px solid #2C3E50; border-radius: 16px; padding: 1.6em; margin: 1.5em 0; background: #FFFFFF; box-shadow: 0 4px 16px rgba(44,62,80,0.05);"><h4 style="margin: 0 0 0.6em; color: #A67C52; font-size: 1.05em; font-weight: 800;">📌 핵심 요약 노트</h4><p style="margin: 0; color: #2C3E50; line-height: 1.75;">여기에 사건의 핵심 쟁점이나 꼭 기억해야 할 법률 포인트를 정리하세요.</p></div><p></p>`;
    } else if (style === 'speech') {
      html = `<div style="background: #F0F4F8; border: 1px solid #D9E2EC; border-radius: 20px 20px 20px 4px; padding: 1.4em 1.6em; margin: 1.5em 0; color: #2C3E50;"><p style="margin: 0 0 0.4em; font-size: 0.85em; font-weight: 800; color: #2563EB;">💬 의뢰인의 실제 고민</p><p style="margin: 0; font-family: 'Gowun Dodum', sans-serif; font-size: 1.02em;">"매달 돌아오는 카드값과 독촉 전화 때문에 일상생활이 불가능할 정도로 힘들었습니다."</p></div><p></p>`;
    } else if (style === 'law') {
      html = `<div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-left: 5px solid #2C3E50; border-radius: 12px; padding: 1.4em 1.6em; margin: 1.5em 0;"><p style="margin: 0 0 0.5em; font-weight: 800; color: #2C3E50; font-size: 0.95em;">⚖️ 관련 법률 근거 (채무자 회생 및 파산에 관한 법률)</p><p style="margin: 0; font-family: 'MaruBuri', 'Nanum Myeongjo', serif; font-size: 0.95em; color: #334155; line-height: 1.8;">재정적 어려움으로 인하여 파탄에 직면해 있는 채무자에 대하여 채권자 등 이해관계인의 법률관계를 조정하여 채무자의 효율적 회생과 채권자의 이익을 도모함을 목적으로 한다.</p></div><p></p>`;
    }
    insertHtmlFragment(html);
  }, [insertHtmlFragment]);

  // 네이버 블로그 스타일 표(Table) 빠른 삽입
  const handleInsertTable = useCallback((preset: '2x3' | '3x4' | 'debt' | 'docs') => {
    let html = '';
    if (preset === '2x3') {
      html = `<table style="width:100%; border-collapse:collapse; margin:1.5em 0; font-size:0.95em;"><thead><tr style="background:#FAF9F6;"><th style="border:1px solid #E8E4D8; padding:10px 14px; font-weight:bold; color:#2C3E50; width:35%;">항목</th><th style="border:1px solid #E8E4D8; padding:10px 14px; font-weight:bold; color:#2C3E50;">상세 내용</th></tr></thead><tbody><tr><td style="border:1px solid #E8E4D8; padding:10px 14px; font-weight:bold;">구분 1</td><td style="border:1px solid #E8E4D8; padding:10px 14px;">내용을 입력하세요</td></tr><tr><td style="border:1px solid #E8E4D8; padding:10px 14px; font-weight:bold;">구분 2</td><td style="border:1px solid #E8E4D8; padding:10px 14px;">내용을 입력하세요</td></tr><tr><td style="border:1px solid #E8E4D8; padding:10px 14px; font-weight:bold;">구분 3</td><td style="border:1px solid #E8E4D8; padding:10px 14px;">내용을 입력하세요</td></tr></tbody></table><p></p>`;
    } else if (preset === '3x4') {
      html = `<table style="width:100%; border-collapse:collapse; margin:1.5em 0; font-size:0.95em; text-align:center;"><thead><tr style="background:#FAF9F6;"><th style="border:1px solid #E8E4D8; padding:10px 14px; font-weight:bold; color:#2C3E50;">구분</th><th style="border:1px solid #E8E4D8; padding:10px 14px; font-weight:bold; color:#2C3E50;">개인회생</th><th style="border:1px solid #E8E4D8; padding:10px 14px; font-weight:bold; color:#2C3E50;">개인파산</th></tr></thead><tbody><tr><td style="border:1px solid #E8E4D8; padding:10px 14px; font-weight:bold;">신청 자격</td><td style="border:1px solid #E8E4D8; padding:10px 14px;">일정 소득이 있는 채무자</td><td style="border:1px solid #E8E4D8; padding:10px 14px;">지급불능 상태의 채무자</td></tr><tr><td style="border:1px solid #E8E4D8; padding:10px 14px; font-weight:bold;">변제 기간</td><td style="border:1px solid #E8E4D8; padding:10px 14px;">36개월 ~ 60개월</td><td style="border:1px solid #E8E4D8; padding:10px 14px;">즉시 면책 (변제 없음)</td></tr><tr><td style="border:1px solid #E8E4D8; padding:10px 14px; font-weight:bold;">재산 유지</td><td style="border:1px solid #E8E4D8; padding:10px 14px;">재산 보유 가능</td><td style="border:1px solid #E8E4D8; padding:10px 14px;">원칙적 환가 배당</td></tr></tbody></table><p></p>`;
    } else if (preset === 'debt') {
      html = `<table style="width:100%; border-collapse:collapse; margin:1.5em 0; font-size:0.95em;"><thead><tr style="background:#2C3E50; color:#FFFFFF;"><th style="border:1px solid #2C3E50; padding:12px 16px; text-align:left; width:35%;">사건 핵심 지표</th><th style="border:1px solid #2C3E50; padding:12px 16px; text-align:left;">인가 결정 결과</th></tr></thead><tbody><tr><td style="border:1px solid #E8E4D8; padding:11px 16px; font-weight:bold; background:#FAF9F6;">관할 법원 / 의뢰인</td><td style="border:1px solid #E8E4D8; padding:11px 16px;">서울회생법원 / 40대 직장인</td></tr><tr><td style="border:1px solid #E8E4D8; padding:11px 16px; font-weight:bold; background:#FAF9F6;">총 채무 원리금</td><td style="border:1px solid #E8E4D8; padding:11px 16px;">120,000,000원</td></tr><tr><td style="border:1px solid #E8E4D8; padding:11px 16px; font-weight:bold; background:#FAF9F6;">최종 탕감액 (탕감률)</td><td style="border:1px solid #E8E4D8; padding:11px 16px; color:#E53E3E; font-weight:800;">96,000,000원 탕감 (원금 80% 탕감)</td></tr><tr><td style="border:1px solid #E8E4D8; padding:11px 16px; font-weight:bold; background:#FAF9F6;">월 변제금 (기간)</td><td style="border:1px solid #E8E4D8; padding:11px 16px; color:#2563EB; font-weight:bold;">월 66만 원 (36개월)</td></tr></tbody></table><p></p>`;
    } else if (preset === 'docs') {
      html = `<table style="width:100%; border-collapse:collapse; margin:1.5em 0; font-size:0.95em;"><thead><tr style="background:#FAF9F6;"><th style="border:1px solid #E8E4D8; padding:10px 14px; font-weight:bold; color:#2C3E50; width:30%;">구분</th><th style="border:1px solid #E8E4D8; padding:10px 14px; font-weight:bold; color:#2C3E50;">필수 준비 서류 목록</th></tr></thead><tbody><tr><td style="border:1px solid #E8E4D8; padding:10px 14px; font-weight:bold;">인적 서류</td><td style="border:1px solid #E8E4D8; padding:10px 14px;">주민등록등본·초본, 가족관계증명서, 혼인관계증명서, 신분증 사본</td></tr><tr><td style="border:1px solid #E8E4D8; padding:10px 14px; font-weight:bold;">소득 증빙</td><td style="border:1px solid #E8E4D8; padding:10px 14px;">재직증명서(또는 사업자등록증), 근로소득원천징수영수증, 급여통장 거래내역</td></tr><tr><td style="border:1px solid #E8E4D8; padding:10px 14px; font-weight:bold;">재산 증빙</td><td style="border:1px solid #E8E4D8; padding:10px 14px;">임대차계약서, 지방세 세목별 과세증명서, 자동차등록원부, 보험 해약환급금 증명서</td></tr></tbody></table><p></p>`;
    }
    insertHtmlFragment(html);
  }, [insertHtmlFragment]);

  // 유튜브 / 동영상 임베드 삽입
  const handleInsertVideo = useCallback(() => {
    const rawUrl = window.prompt('유튜브 영상 주소(URL)를 입력하세요:\n예: https://www.youtube.com/watch?v=xxxx 또는 https://youtu.be/xxxx');
    if (!rawUrl || !rawUrl.trim()) return;
    const trimmed = rawUrl.trim();
    let embedUrl = trimmed;
    const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    if (ytMatch && ytMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    const html = `<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; max-width:100%; border-radius:16px; margin:1.8em 0; box-shadow:0 8px 24px rgba(0,0,0,0.1);"><iframe src="${embedUrl}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;" allowfullscreen></iframe></div><p></p>`;
    insertHtmlFragment(html);
  }, [insertHtmlFragment]);

  // 법률 특수기호 / 이모지 빠른 삽입
  const handleInsertSymbol = useCallback((sym: string) => {
    if (previewMode === 'HTML') {
      const next = htmlSource + sym;
      setHtmlSource(next);
      onChange(next);
      return;
    }
    if (isComplexHtml) {
      document.execCommand('insertText', false, sym);
      if (visualHtmlRef.current) {
        const updated = visualHtmlRef.current.innerHTML;
        setHtmlSource(updated);
        onChange(updated);
      }
      return;
    }
    if (!editor) return;
    editor.chain().focus().insertContent(sym).run();
  }, [editor, previewMode, isComplexHtml, htmlSource, onChange]);

  // 프리미엄 서식 템플릿 삽입
  const handleInsertTemplate = useCallback((type: 'success' | 'guide' | 'cta' | 'profile' | 'procedure' | 'qa' | 'compare') => {
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
    <a href="/qna/diagnosis" style="display: inline-block; padding: 0.8em 2em; background: #A67C52; color: white !important; font-weight: bold; border-radius: 12px; text-decoration: none !important; transition: all 0.2s; font-size: 0.95em;">
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
    insertHtmlFragment(html);
  }, [insertHtmlFragment]);

  // 클립보드에서 HTML 코드 바로 읽어와 적용
  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (!clipText || !clipText.trim()) {
        alert('클립보드에 복사된 텍스트나 HTML 코드가 없습니다.');
        return;
      }
      applyRawHtml(clipText, '✅ 클립보드의 HTML 코드가 입력 영역에 그대로 붙여넣어졌습니다!');
    } catch {
      alert('브라우저 권한 설정으로 인해 자동 붙여넣기가 제한되었습니다. 아래 코드 입력창을 클릭한 후 Ctrl+V 로 직접 붙여넣어 주세요.');
      htmlTextareaRef.current?.focus();
    }
  }, [applyRawHtml]);

  if (!editor) return null;

  // HTML 태그 및 <style> 블록을 제외한 순수 본문 텍스트 기준으로 글자수 계산
  const plainTextForCount = (isComplexHtml || previewMode === 'HTML')
    ? htmlSource
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    : editor.getText();
  const wordCount = plainTextForCount.trim().split(/\s+/).filter(Boolean).length;
  const charCount = plainTextForCount.length;
  const charCountWithoutSpaces = plainTextForCount.replace(/\s/g, '').length;

  return (
    <div
      className={`border rounded-2xl bg-white shadow-sm relative transition-all duration-200
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
      {/* ── 네이버 블로그 스마트에디터 ONE 스타일 2단 툴바 ─────────────────────────────── */}
      <div className="sticky top-[60px] md:top-0 z-30 bg-white border-b border-[var(--border)] rounded-t-2xl">
        
        {/* [1단 상단 바] 멀티미디어 · 블록 요소 · 템플릿 삽입 (사진, URL, 동영상, 인용구, 구분선, 표, 기호, 서식 템플릿) */}
        <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/70 flex flex-wrap items-center gap-1.5">
          {/* 사진 업로드 */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#A67C52] hover:text-[#A67C52] text-xs font-bold text-[#2C3E50] shadow-2xs transition-all cursor-pointer"
            title="내 PC에서 사진 업로드 (다중 선택 및 드래그앤드롭 가능)"
          >
            <span>🖼️</span>
            <span>사진</span>
          </button>

          {/* 이미지 URL */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleImageUrl(); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#A67C52] hover:text-[#A67C52] text-xs font-bold text-[#2C3E50] shadow-2xs transition-all cursor-pointer"
            title="외부 이미지 주소(URL)로 삽입"
          >
            <span>🌐</span>
            <span>이미지 URL</span>
          </button>

          {/* 유튜브/동영상 삽입 */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleInsertVideo(); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#A67C52] hover:text-[#A67C52] text-xs font-bold text-[#2C3E50] shadow-2xs transition-all cursor-pointer"
            title="유튜브 영상 임베드 삽입"
          >
            <span>🎬</span>
            <span>동영상</span>
          </button>

          <Divider />

          {/* 네이버 블로그 스타일 인용구 5종 */}
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (val !== 'none') {
                handleInsertQuoteStyle(val as any);
                e.target.value = 'none';
              }
            }}
            className="h-8 px-2.5 text-xs font-bold border border-gray-200 rounded-lg text-[#2C3E50] bg-white cursor-pointer focus:outline-none hover:border-[#A67C52] transition-colors"
            defaultValue="none"
            title="네이버 블로그 스타일 인용구 삽입"
          >
            <option value="none">💬 인용구</option>
            <option value="classic">기본 좌측 선 인용구</option>
            <option value="center">큰따옴표 중앙 강조 인용구</option>
            <option value="frame">핵심 요약 테두리 박스</option>
            <option value="speech">의뢰인 고민 말풍선</option>
            <option value="law">법조문·판례 근거 박스</option>
          </select>

          {/* 구분선 스타일 6종 */}
          <select
            onChange={(e) => {
              const type = e.target.value;
              if (type !== 'none') {
                handleInsertDivider(type as any);
                e.target.value = 'none';
              }
            }}
            className="h-8 px-2.5 text-xs font-bold border border-gray-200 rounded-lg text-[#2C3E50] bg-white cursor-pointer focus:outline-none hover:border-[#A67C52] transition-colors"
            defaultValue="none"
            title="구분선 스타일 삽입"
          >
            <option value="none">➖ 구분선</option>
            <option value="solid">기본 실선</option>
            <option value="dashed">골드 점선</option>
            <option value="double">클래식 이중선</option>
            <option value="gradient">그라데이션 선</option>
            <option value="diamond">다이아몬드 포인트선</option>
            <option value="wavy">물결 구분선</option>
          </select>

          {/* 표(Table) 빠른 삽입 */}
          <select
            onChange={(e) => {
              const preset = e.target.value;
              if (preset !== 'none') {
                handleInsertTable(preset as any);
                e.target.value = 'none';
              }
            }}
            className="h-8 px-2.5 text-xs font-bold border border-gray-200 rounded-lg text-[#2C3E50] bg-white cursor-pointer focus:outline-none hover:border-[#A67C52] transition-colors"
            defaultValue="none"
            title="표(테이블) 삽입"
          >
            <option value="none">📊 표 삽입</option>
            <option value="debt">탕감 전·후 핵심 요약표 (성공사례 추천)</option>
            <option value="docs">필수 준비 서류 안내표</option>
            <option value="2x3">2열 × 3행 기본 표</option>
            <option value="3x4">3열 × 3행 비교 표</option>
          </select>

          {/* 링크 삽입 */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleLink(); }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
              editor.isActive('link')
                ? 'bg-[#A67C52] text-white border-[#A67C52]'
                : 'bg-white text-[#2C3E50] border-gray-200 hover:border-[#A67C52] hover:text-[#A67C52]'
            }`}
            title="하이퍼링크 삽입/수정"
          >
            <span>🔗</span>
            <span>링크</span>
          </button>

          {/* 법률 특수기호 & 아이콘 팔레트 */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowSymbolPalette(prev => !prev);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#A67C52] hover:text-[#A67C52] text-xs font-bold text-[#2C3E50] shadow-2xs transition-all cursor-pointer"
              title="법률 칼럼·성공사례 자주 쓰는 특수기호 및 아이콘"
            >
              <span>⚖️</span>
              <span>기호·아이콘</span>
            </button>
            {showSymbolPalette && (
              <div className="absolute top-full left-0 mt-1 p-2.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-[250px]">
                <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-gray-100">
                  <span className="text-[11px] font-bold text-gray-500">법률·강조 특수기호 클릭 삽입</span>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); setShowSymbolPalette(false); }}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[
                    '☎', '⚖️', '🏆', '📌', '✅', '✔️', '❗',
                    '💡', '🔎', '📋', '💰', '📉', '🛡️', '🏛️',
                    '※', '★', '☆', '●', '■', '◆', '▶',
                    '①', '②', '③', '④', '⑤', '➔', '👉',
                  ].map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleInsertSymbol(sym);
                        setShowSymbolPalette(false);
                      }}
                      className="h-7 rounded-md hover:bg-amber-50 border border-transparent hover:border-amber-200 flex items-center justify-center text-sm"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 우측 끝: 프리미엄 법률 서식 템플릿 & PC/모바일 미리보기 */}
          <div className="flex items-center gap-1.5 ml-auto">
            <select
              onChange={(e) => {
                const template = e.target.value;
                if (template !== 'none') {
                  handleInsertTemplate(template as any);
                  e.target.value = 'none';
                }
              }}
              className="h-8 px-3 text-xs font-bold border border-[#A67C52]/30 rounded-lg text-white bg-[#A67C52] cursor-pointer focus:outline-none hover:bg-[#8B6840] transition-colors shadow-sm"
              defaultValue="none"
              title="원클릭 법률 서식 템플릿 삽입"
            >
              <option value="none">⭐ 법률 서식 템플릿</option>
              <option value="success">🏆 법원 인가 성공사례 브리핑</option>
              <option value="guide">📌 핵심 체크리스트 가이드</option>
              <option value="cta">⚖️ 30초 자격진단 유도 배너(CTA)</option>
              <option value="profile">👨‍⚖️ 대표 법무사 프로필 카드</option>
              <option value="procedure">📋 개인회생 3단계 절차 타임라인</option>
              <option value="qa">❓ 자주 묻는 질문 (Q&A 박스)</option>
              <option value="compare">📊 제도 신청 전·후 비교표</option>
            </select>

            {/* 네이버 블로그 우측 도크 스타일: 편집 / HTML 코드 입력 / PC 미리보기 / 모바일 미리보기 전환 */}
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 shadow-2xs">
              {[
                { mode: 'EDIT' as const, label: '✍️ 편집' },
                { mode: 'HTML' as const, label: '</> HTML/코드 입력' },
                { mode: 'DESKTOP' as const, label: '🖥️ PC화면' },
                { mode: 'MOBILE' as const, label: '📱 모바일' },
              ].map((m) => (
                <button
                  key={m.mode}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (m.mode === 'HTML' && !isComplexHtml && editor) {
                      const currentEditorHtml = editor.getHTML();
                      if (currentEditorHtml && currentEditorHtml !== '<p></p>') {
                        setHtmlSource(currentEditorHtml);
                      }
                    }
                    setPreviewMode(m.mode);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    previewMode === m.mode
                      ? m.mode === 'HTML'
                        ? 'bg-[#0F172A] text-[#E5C158] shadow-xs ring-1 ring-[#C5A059]/50'
                        : 'bg-[#2C3E50] text-white shadow-xs'
                      : m.mode === 'HTML'
                      ? 'text-[#A67C52] bg-[#A67C52]/10 hover:bg-[#A67C52]/20'
                      : 'text-gray-500 hover:text-[#2C3E50]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* [2단 하단 바] 타이포그래피 & 단락 서식 (문단, 서체 선택, 글자 크기, 줄간격, 굵게/기울임/밑줄/취소선, 색상, 정렬, 목록, 서식 지우기, 실행취소) */}
        <div className="px-3 py-2 flex flex-wrap items-center gap-1.5 bg-white">
          {/* 문단 스타일 드롭다운 */}
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
            className="h-8 px-2 text-xs font-bold border border-gray-200 rounded-md text-[#2C3E50] bg-white cursor-pointer focus:outline-none hover:border-[#A67C52] transition-colors"
            title="문단 스타일 (본문 / 소제목)"
          >
            <option value="0">본문</option>
            <option value="1">대제목 (H1)</option>
            <option value="2">중제목 (H2)</option>
            <option value="3">소제목 (H3)</option>
          </select>

          {/* ✨ 추천 서체(Font Family) 선택 드롭다운 */}
          <select
            value={(() => {
              const attrs = editor.getAttributes('textStyle');
              return (attrs?.fontFamily as string) || 'default';
            })()}
            onChange={(e) => {
              const fam = e.target.value;
              if (fam === 'default') {
                (editor.commands as any).unsetFontFamily();
              } else {
                (editor.commands as any).setFontFamily(fam);
              }
              editor.commands.focus();
            }}
            className="h-8 px-2 text-xs font-bold border border-gray-200 rounded-md text-[#2C3E50] bg-white cursor-pointer focus:outline-none hover:border-[#A67C52] transition-colors max-w-[175px]"
            title="법률 칼럼 & 성공사례 추천 서체 변경"
          >
            <option value="default">서체 (프리텐다드 기본)</option>
            {['본문 고딕 (가독성 추천)', '판결문·인용 명조 (신뢰감 추천)', '제목·포인트·감성 서체'].map((grp) => (
              <optgroup key={grp} label={grp}>
                {RECOMMENDED_FONTS.filter(f => f.group === grp).map((font) => (
                  <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {/* 글자 크기 드롭다운 — 네이버 블로그 스타일 세밀한 크기(11px~36px) */}
          <select
            value={(() => {
              const attrs = editor.getAttributes('textStyle');
              const fontSize = attrs?.fontSize as string | null | undefined;
              if (!fontSize) return 'default';
              const normalized = fontSize.includes('px') ? fontSize : `${fontSize}px`;
              const allowed = ['11px','13px','15px','16px','17px','19px','20px','24px','28px','32px','36px'];
              return allowed.includes(normalized) ? normalized : 'default';
            })()}
            onChange={(e) => {
              const size = e.target.value;
              if (size === 'default') {
                (editor.commands as any).unsetFontSize();
              } else {
                (editor.commands as any).setFontSize(size);
              }
              editor.commands.focus();
            }}
            className="h-8 px-2 text-xs font-bold border border-gray-200 rounded-md text-[#2C3E50] bg-white cursor-pointer focus:outline-none hover:border-[#A67C52] transition-colors"
            title="글자 크기 (네이버 블로그 규격 호환)"
          >
            <option value="default">크기 (17px)</option>
            <option value="11px">11px (주석)</option>
            <option value="13px">13px (작게)</option>
            <option value="15px">15px (부본문)</option>
            <option value="16px">16px (본문 기본)</option>
            <option value="17px">17px (가독성 추천)</option>
            <option value="19px">19px (네이버 강조)</option>
            <option value="20px">20px (소제목급)</option>
            <option value="24px">24px (중제목급)</option>
            <option value="28px">28px (대제목급)</option>
            <option value="32px">32px (특대)</option>
            <option value="36px">36px (배너급)</option>
          </select>

          {/* 줄간격(Line Height) 드롭다운 */}
          <select
            value={(() => {
              const pAttrs = editor.getAttributes('paragraph');
              const hAttrs = editor.getAttributes('heading');
              return (pAttrs?.lineHeight || hAttrs?.lineHeight || 'default') as string;
            })()}
            onChange={(e) => {
              const lh = e.target.value;
              if (lh === 'default') {
                (editor.commands as any).unsetLineHeight();
              } else {
                (editor.commands as any).setLineHeight(lh);
              }
              editor.commands.focus();
            }}
            className="h-8 px-2 text-xs font-bold border border-gray-200 rounded-md text-[#2C3E50] bg-white cursor-pointer focus:outline-none hover:border-[#A67C52] transition-colors"
            title="문단 줄간격 조절"
          >
            <option value="default">줄간격</option>
            <option value="1.4">140% (좁게)</option>
            <option value="1.6">160% (보통)</option>
            <option value="1.8">180% (기본 추천)</option>
            <option value="2.0">200% (넓게)</option>
            <option value="2.2">220% (여유롭게)</option>
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
                '#2563EB', '#805AD5', '#9F7AEA', '#E9D8FD'
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
              title="형광펜 하이라이트"
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

          {/* 정렬 (좌 / 중 / 우 / 양쪽 정렬) */}
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="왼쪽 정렬">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M2 3.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5z"/></svg>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="가운데 정렬">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4 3.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-2 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm2 3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-2 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z"/></svg>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="오른쪽 정렬">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M6 3.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-4 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm4 3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-4 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z"/></svg>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="양쪽 정렬">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M2 3.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z"/></svg>
          </ToolBtn>

          <Divider />

          {/* 목록 */}
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="글머리 기호 목록">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5 11.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm-3 1a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2z"/></svg>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="번호 매기기 목록">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5 11.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM1 12a1 1 0 112 0 1 1 0 01-2 0zm0-4a1 1 0 112 0 1 1 0 01-2 0zm0-4a1 1 0 112 0 1 1 0 01-2 0z"/></svg>
          </ToolBtn>

          <Divider />

          {/* 서식 초기화 (복사/붙여넣기 한 외부 서식 깔끔히 제거) */}
          <ToolBtn
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            active={false}
            title="서식 초기화 (외부에서 복사해온 글꼴·크기·색상 제거)"
          >
            <span className="text-[11px] font-extrabold text-gray-500">T✕</span>
          </ToolBtn>

          {/* 실행취소 / 다시실행 */}
          <ToolBtn onClick={() => editor.chain().focus().undo().run()} active={false} title="실행취소 (Ctrl+Z)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 00-4-4H4"/></svg>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} active={false} title="다시실행 (Ctrl+Y)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 014-4h12"/></svg>
          </ToolBtn>
        </div>
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

      {/* ── HTML 적용 알림 배너 ──────────────────── */}
      {htmlNotice && (
        <div className="mx-4 mt-3 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs">
          <span>{htmlNotice}</span>
          <button type="button" onClick={() => setHtmlNotice('')} className="text-emerald-600 hover:text-emerald-900 font-black ml-3">✕</button>
        </div>
      )}

      {/* ── 에디터 본문 & HTML/코드 입력 영역 & PC/모바일 실시간 미리보기 ──────────────────────── */}
      {previewMode === 'HTML' ? (
        <div className="p-4 sm:p-6 bg-[#0F172A] text-white space-y-4 min-h-[560px]">
          {/* 상단 안내 및 원클릭 액션 바 */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#1E293B] border border-[#C5A059]/40 rounded-xl p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#C5A059] text-[#0F172A] text-[11px] font-black uppercase">HTML / 코드 입력 영역</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#E5C158]">
                  만들어진 HTML 코드를 복사해 홈페이지 편집기의 HTML/코드 입력 영역에 그대로 붙여넣으시면 됩니다.
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                외부에서 제작된 HTML 코드(표, 박스 디자인, 인라인 CSS, &lt;style&gt; 태그 포함)가 태그 손실 없이 100% 원형 그대로 반영됩니다.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="px-3.5 py-2 rounded-lg bg-[#C5A059] hover:bg-[#D4AF6A] text-[#0F172A] text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <span>📋</span>
                <span>클립보드 HTML 바로 붙여넣기</span>
              </button>
              <button
                type="button"
                onClick={() => setSplitHtmlPreview(prev => !prev)}
                className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  splitHtmlPreview
                    ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                    : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {splitHtmlPreview ? '👁️ 우측 실시간 미리보기 켜짐' : '👁️ 우측 실시간 미리보기 켜기'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('입력된 HTML 코드를 모두 비우시겠습니까?')) {
                    setHtmlSource('');
                    onChange('');
                    editor.commands.setContent('', { emitUpdate: false });
                  }
                }}
                className="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-red-200 text-xs font-bold transition-all cursor-pointer"
              >
                🧹 코드 비우기
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('EDIT')}
                className="px-3.5 py-2 rounded-lg bg-white text-[#0F172A] hover:bg-slate-100 text-xs font-black transition-all cursor-pointer shadow-sm"
              >
                ✅ 적용 후 편집 화면 보기 ➔
              </button>
            </div>
          </div>

          {/* 코드 입력창 & 실시간 렌더링 분할 뷰 */}
          <div className={`grid grid-cols-1 ${splitHtmlPreview ? 'lg:grid-cols-2' : ''} gap-4`}>
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-700 border-b-0 rounded-t-xl text-[11px] text-slate-400 font-mono">
                <span>&lt;/&gt; HTML SOURCE CODE (여기에 Ctrl+V 로 붙여넣으세요)</span>
                <span>{htmlSource.length.toLocaleString()} bytes</span>
              </div>
              <textarea
                ref={htmlTextareaRef}
                value={htmlSource === '<p></p>' ? '' : htmlSource}
                onChange={(e) => applyRawHtml(e.target.value)}
                onPaste={(e) => {
                  const pasted = e.clipboardData?.getData('text/plain');
                  if (pasted && (pasted.includes('```') || /<!DOCTYPE|<html|<body/i.test(pasted))) {
                    e.preventDefault();
                    applyRawHtml(pasted, '✅ HTML 코드가 홈페이지 규격에 맞게 자동 정리되어 적용되었습니다!');
                  }
                }}
                placeholder={`<!-- 만들어진 HTML 코드를 복사해 이 영역에 그대로 붙여넣으시면 됩니다 (Ctrl+V) -->\n<div style="padding: 24px; border-radius: 16px; background: #FAF9F6;">\n  <h2>제목을 입력하세요</h2>\n  <p>본문 내용을 입력하세요.</p>\n</div>`}
                spellCheck={false}
                className="w-full min-h-[460px] p-4 bg-slate-950 text-emerald-300 font-mono text-xs sm:text-[13px] leading-relaxed border border-slate-700 rounded-b-xl focus:outline-none focus:border-[#C5A059] resize-y"
              />
            </div>

            {splitHtmlPreview && (
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border border-slate-700 border-b-0 rounded-t-xl text-[11px] text-slate-300 font-bold">
                  <span>🖥️ 실시간 홈페이지 렌더링 미리보기</span>
                  <span className="text-[#E5C158]">실제 게시글과 100% 동일</span>
                </div>
                <div className="w-full min-h-[460px] max-h-[620px] overflow-y-auto p-6 bg-white text-[#2C3E50] border border-slate-700 rounded-b-xl">
                  {htmlSource && htmlSource !== '<p></p>' ? (
                    <div
                      className="prose-content"
                      dangerouslySetInnerHTML={{
                        __html: htmlSource.replace(/<p(\s[^>]*)?><\/p>/gi, '<p$1><br /></p>'),
                      }}
                    />
                  ) : (
                    <div className="h-full min-h-[380px] flex items-center justify-center text-gray-400 text-xs font-medium text-center">
                      왼쪽 HTML/코드 입력 영역에 HTML 코드를 붙여넣으면<br />이곳에 실제 홈페이지 화면이 즉시 표시됩니다.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : previewMode === 'EDIT' ? (
        isComplexHtml ? (
          <div>
            {/* 고급 HTML 디자인 보존 비주얼 직접 편집 안내 바 */}
            <div className="px-5 py-2.5 bg-amber-50/90 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <span className="px-2 py-0.5 rounded bg-[#A67C52] text-white text-[10px] font-black">HTML 디자인 보존 모드</span>
                <span>붙여넣으신 HTML 코드의 레이아웃·표·스타일을 깨뜨리지 않고 아래 화면에서 글자를 직접 클릭해 수정할 수 있습니다.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode('HTML')}
                  className="px-2.5 py-1 rounded-md bg-[#0F172A] text-[#E5C158] font-bold text-[11px] hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  &lt;/&gt; HTML 코드 직접 보기/수정
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('현재 HTML 코드를 비우고 기본 텍스트 에디터로 초기화하시겠습니까?')) {
                      setHtmlSource('');
                      onChange('');
                      editor.commands.setContent('', { emitUpdate: false });
                    }
                  }}
                  className="px-2.5 py-1 rounded-md bg-white border border-amber-300 text-amber-800 font-bold text-[11px] hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  초기화
                </button>
              </div>
            </div>
            <div
              ref={visualHtmlRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const updated = (e.currentTarget as HTMLDivElement).innerHTML;
                setHtmlSource(updated);
                onChange(updated);
              }}
              className="prose-content min-h-[550px] pt-8 px-6 pb-16 focus:outline-none"
            />
          </div>
        ) : (
          <EditorContent editor={editor} />
        )
      ) : (
        <div className="bg-gray-100/80 py-8 px-4 min-h-[550px] flex justify-center">
          <div
            className={`bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8 transition-all ${
              previewMode === 'MOBILE' ? 'w-[390px] max-w-full' : 'w-full max-w-4xl'
            }`}
          >
            <div className="mb-4 pb-3 border-b border-gray-100 flex items-center justify-between text-xs text-gray-400 font-bold">
              <span>{previewMode === 'MOBILE' ? '📱 모바일 화면 미리보기 (390px 기준)' : '🖥️ PC 상세 화면 미리보기'}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewMode('HTML')}
                  className="text-[#0F172A] hover:underline"
                >
                  &lt;/&gt; HTML 코드 입력으로 이동
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('EDIT')}
                  className="text-[#A67C52] hover:underline"
                >
                  편집 화면으로 돌아가기 ➔
                </button>
              </div>
            </div>
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{
                __html: ((isComplexHtml ? htmlSource : editor.getHTML()) || '').replace(/<p(\s[^>]*)?><\/p>/gi, '<p$1><br /></p>'),
              }}
            />
          </div>
        </div>
      )}

        {/* ── 버블 메뉴 (플로팅 툴바) ──────────────────────── */}
      {editor && (
        <BubbleMenuComponent editor={editor} tippyOptions={{ duration: 100, maxWidth: 520, placement: 'top' }} className="bg-white border border-gray-200 shadow-2xl rounded-xl px-2.5 py-1.5 flex flex-wrap items-center gap-1.5 z-50">
          {/* 버블 메뉴 내 빠른 서체 변경 */}
          <select
            value={(editor.getAttributes('textStyle')?.fontFamily as string) || 'default'}
            onChange={(e) => {
              const fam = e.target.value;
              if (fam === 'default') (editor.commands as any).unsetFontFamily();
              else (editor.commands as any).setFontFamily(fam);
              editor.commands.focus();
            }}
            className="h-7 px-1.5 text-[11px] font-bold border border-gray-200 rounded-md text-[#2C3E50] bg-white max-w-[120px]"
            title="선택 영역 서체 변경"
          >
            <option value="default">기본 서체</option>
            {RECOMMENDED_FONTS.map((f) => (
              <option key={f.value} value={f.value}>{f.label.split(' ')[0]}</option>
            ))}
          </select>

          <Divider />

          {/* 텍스트 스타일 */}
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="굵게">
            <strong>B</strong>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="기울임">
            <em>I</em>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="밑줄">
            <span className="underline">U</span>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="취소선">
            <span className="line-through">S</span>
          </ToolBtn>

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

          {/* 목록 & 인용구 */}
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="비순서 목록">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5 11.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm-3 1a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2z"/></svg>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="순서 목록">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5 11.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM1 12a1 1 0 112 0 1 1 0 01-2 0zm0-4a1 1 0 112 0 1 1 0 01-2 0zm0-4a1 1 0 112 0 1 1 0 01-2 0z"/></svg>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="인용구">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/></svg>
          </ToolBtn>

          <Divider />
          <ToolBtn onClick={handleLink} active={editor.isActive('link')} title="링크 삽입">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </ToolBtn>
        </BubbleMenuComponent>
      )}

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

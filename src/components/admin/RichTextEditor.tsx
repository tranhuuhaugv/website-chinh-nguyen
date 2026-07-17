"use client";

import { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Autoformat,
  BlockQuote,
  Bold,
  Essentials,
  Heading,
  Image as CkImage,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload as CkImageUpload,
  Indent,
  Italic,
  Link,
  List,
  Paragraph,
  PasteFromOffice,
  Table,
  TableToolbar,
  TextTransformation,
  Underline,
  type EditorConfig,
  type FileLoader,
  type UploadAdapter,
  type UploadResponse,
} from "ckeditor5";
import coreTranslations from "ckeditor5/translations/vi.js";
import "ckeditor5/ckeditor5.css";

// Soạn nội dung (mô tả sản phẩm / bài viết) bằng CKEditor 5.
// Lưu ra HTML. Controlled: nhận `value` (HTML) và báo thay đổi qua `onChange`.
//
// CKEditor đụng tới `window` -> component này phải được nạp bằng dynamic import
// ssr:false (xem RichTextEditorLoader).

/** Đẩy ảnh CKEditor lên VPS qua đúng API sẵn có (/api/upload, chỉ admin). */
class UploadToVps implements UploadAdapter {
  constructor(private loader: FileLoader) {}

  async upload(): Promise<UploadResponse> {
    const file = await this.loader.file;
    if (!file) throw new Error("Không đọc được file");

    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = (await res.json().catch(() => null)) as
      | { url?: string; error?: string }
      | null;

    if (!res.ok || !json?.url) {
      const loi: Record<string, string> = {
        bad_type: "Chỉ nhận ảnh jpg/png/webp/gif/avif",
        too_large: "Ảnh nặng quá 8MB",
      };
      throw new Error(loi[json?.error ?? ""] ?? "Không tải được ảnh lên");
    }
    return { default: json.url };
  }

  abort() {
    // Không huỷ giữa chừng — ảnh đã nén sẵn nên upload rất nhanh.
  }
}

export function RichTextEditor({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (html: string) => void;
}) {
  // CKEditor tự dựng DOM riêng -> chỉ nạp `value` lần đầu, không đẩy lại mỗi
  // lần gõ (sẽ nhảy con trỏ về đầu).
  const banDau = useRef(value ?? "");
  const [sanSang, setSanSang] = useState(false);

  useEffect(() => setSanSang(true), []);
  if (!sanSang) {
    return (
      <div className="rounded-xl border border-line bg-bg px-3 py-6 text-center text-[13px] text-muted">
        Đang tải trình soạn thảo…
      </div>
    );
  }

  const config: EditorConfig = {
    licenseKey: "GPL",
    translations: [coreTranslations],
    plugins: [
      Essentials,
      Paragraph,
      Heading,
      Bold,
      Italic,
      Underline,
      Link,
      List,
      Indent,
      BlockQuote,
      CkImage,
      CkImageUpload,
      ImageToolbar,
      ImageCaption,
      ImageStyle,
      ImageResize,
      Table,
      TableToolbar,
      Autoformat,
      TextTransformation,
      PasteFromOffice,
    ],
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "bulletedList",
        "numberedList",
        "outdent",
        "indent",
        "|",
        "link",
        "uploadImage",
        "insertTable",
        "blockQuote",
      ],
      // Form admin đã tràn hết bề ngang -> bày hết nút ra, khỏi giấu sau "..."
      shouldNotGroupWhenFull: true,
    },
    heading: {
      options: [
        { model: "paragraph", title: "Đoạn văn", class: "ck-heading_paragraph" },
        {
          model: "heading2",
          view: "h2",
          title: "Tiêu đề lớn",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Tiêu đề nhỏ",
          class: "ck-heading_heading3",
        },
      ],
    },
    image: {
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
      ],
    },
    table: { contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"] },
    language: "vi",
  };

  return (
    <div className="admin-ckeditor">
      <CKEditor
        editor={ClassicEditor}
        config={config}
        data={banDau.current}
        onReady={(editor) => {
          editor.plugins.get("FileRepository").createUploadAdapter = (
            loader: FileLoader,
          ) => new UploadToVps(loader);
        }}
        onChange={(_, editor) => onChange?.(editor.getData())}
      />
    </div>
  );
}

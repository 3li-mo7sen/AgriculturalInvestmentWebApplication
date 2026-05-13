// Client-side file parsing for chat attachments.
// Images are returned as data URLs; documents are extracted to plain text.

export type ParsedAttachment = {
  id: string;
  name: string;
  size: number;
  mime: string;
  kind: "image" | "document";
  // For images
  dataUrl?: string;
  // For documents
  text?: string;
};

const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const DOC_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export function isAccepted(file: File): boolean {
  if (IMAGE_TYPES.includes(file.type)) return true;
  if (DOC_TYPES.includes(file.type)) return true;
  // Fallback by extension
  const n = file.name.toLowerCase();
  return /\.(png|jpe?g|webp|pdf|docx|txt)$/.test(n);
}

export function validate(file: File): string | null {
  if (!isAccepted(file)) return `Unsupported file: ${file.name}`;
  if (file.size > MAX_BYTES) return `${file.name} is larger than 10MB`;
  return null;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsText(file);
  });
}

async function readPdfText(file: File): Promise<string> {
  const pdfjs: any = await import("pdfjs-dist");
  // Worker via CDN matching installed version
  const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const pages: string[] = [];
  const max = Math.min(doc.numPages, 30);
  for (let i = 1; i <= max; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((it: any) => it.str).join(" ");
    pages.push(text);
  }
  return pages.join("\n\n").slice(0, 40000);
}

async function readDocxText(file: File): Promise<string> {
  // @ts-expect-error no types for browser entry
  const mammoth: any = await import("mammoth/mammoth.browser");
  const buf = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buf });
  return (result.value as string).slice(0, 40000);
}

export async function parseFile(file: File): Promise<ParsedAttachment> {
  const id = crypto.randomUUID();
  const base = { id, name: file.name, size: file.size, mime: file.type };
  if (IMAGE_TYPES.includes(file.type) || /\.(png|jpe?g|webp)$/i.test(file.name)) {
    const dataUrl = await readAsDataUrl(file);
    return { ...base, kind: "image", dataUrl };
  }
  if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
    const text = await readPdfText(file);
    return { ...base, kind: "document", text };
  }
  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    /\.docx$/i.test(file.name)
  ) {
    const text = await readDocxText(file);
    return { ...base, kind: "document", text };
  }
  // txt fallback
  const text = await readAsText(file);
  return { ...base, kind: "document", text: text.slice(0, 40000) };
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

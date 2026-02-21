import { NextResponse } from 'next/server';
import { Docling } from 'docling-sdk';

export type OCRPostRequest = {
  image_binary: Blob;
};

export type OCRPostReturn = {
  status: 'success' | 'error';
  message: string;
  text_data?: Array<{
    text: string;
    bounding_box: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
};

type DoclingBBox = {
  l: number;
  t: number;
  r: number;
  b: number;
  coord_origin?: 'TOPLEFT' | 'BOTTOMLEFT' | string;
};

type DoclingProv = {
  page_no?: number;
  bbox?: DoclingBBox;
};

type DoclingTextItem = {
  text?: string;
  prov?: DoclingProv[];
};

type DoclingPage = {
  size?: {
    width?: number;
    height?: number;
  };
};

type DoclingDocument = {
  pages?: Record<string, DoclingPage>;
  texts?: DoclingTextItem[];
};

type DoclingFileResult = {
  document?: {
    json_content?: DoclingDocument;
  };
};

type DoclingResponse = {
  status?: 'success' | 'partial_success' | 'failure' | string;
  document?: {
    json_content?: DoclingDocument;
  };
  output?: {
    files?: DoclingFileResult[];
  };
};

function normalizeBBoxToTopLeft(
  bbox: DoclingBBox,
  pageHeight?: number,
): { x0: number; y0: number; x1: number; y1: number } {
  const x0 = Math.min(bbox.l, bbox.r);
  const x1 = Math.max(bbox.l, bbox.r);

  if (bbox.coord_origin === 'BOTTOMLEFT' && typeof pageHeight === 'number') {
    const yTop = pageHeight - bbox.t;
    const yBottom = pageHeight - bbox.b;
    return {
      x0,
      y0: Math.min(yTop, yBottom),
      y1: Math.max(yTop, yBottom),
      x1,
    };
  }

  return {
    x0,
    y0: Math.min(bbox.t, bbox.b),
    y1: Math.max(bbox.t, bbox.b),
    x1,
  };
}

function getPageHeight(doc: DoclingDocument, pageNo?: number): number | undefined {
  if (!doc.pages || typeof pageNo !== 'number') return undefined;

  const page = doc.pages[String(pageNo)];
  if (!page?.size?.height || Number.isNaN(page.size.height)) return undefined;
  return page.size.height;
}

function extractDoclingDocument(payload: DoclingResponse): DoclingDocument | undefined {
  if (payload.document?.json_content) return payload.document.json_content;
  return payload.output?.files?.[0]?.document?.json_content;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!(imageFile instanceof Blob)) {
      return NextResponse.json<OCRPostReturn>(
        { status: 'error', message: 'Image file is not a blob' },
        { status: 400 },
      );
    }

    const doclingUrl = process.env.DOCLING_URL || 'http://localhost:5001';
    const doclingApiKey = process.env.DOCLING_API_KEY;

    const docling = new Docling({
      api: {
        baseUrl: doclingUrl,
        timeout: 30000,
        ...(doclingApiKey ? { apiKey: doclingApiKey } : {}),
      },
    });

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const payload = (await (docling as any).convertFile({
      files: imageBuffer,
      filename: 'upload-image',
      to_formats: ['json'],
      from_formats: ['image'],
      do_ocr: true,
    })) as DoclingResponse;

    const doc = extractDoclingDocument(payload);

    if (!doc?.texts || !Array.isArray(doc.texts)) {
      return NextResponse.json<OCRPostReturn>(
        { status: 'error', message: 'Docling response missing text content' },
        { status: 500 },
      );
    }

    const text_data: OCRPostReturn['text_data'] = [];

    for (const item of doc.texts) {
      const text = item.text?.trim();
      if (!text) continue;

      for (const prov of item.prov || []) {
        if (!prov.bbox) continue;

        const pageHeight = getPageHeight(doc, prov.page_no);
        const box = normalizeBBoxToTopLeft(prov.bbox, pageHeight);

        text_data.push({
          text,
          bounding_box: box,
        });
      }
    }

    return NextResponse.json<OCRPostReturn>({
      status: 'success',
      message: '',
      text_data,
    });
  } catch (e: any) {
    console.log('api/ocr/route2 post error');
    console.log('Error Start--------------------------------');
    console.log((e?.message || String(e)).slice(0, 400));
    console.log('Error End--------------------------------');

    return NextResponse.json<OCRPostReturn>(
      { status: 'error', message: 'There was an issue detecting text in the image (Docling route)' },
      { status: 500 },
    );
  }
}

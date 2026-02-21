import { DefaultAPIRet, verifyBody } from "@/lib/api";
import { ocr_config } from "@/lib/config";
import { NextResponse } from "next/server";
import { createWorker } from 'tesseract.js';

export type OCRPostRequest = {
  image_binary: Blob;
}

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
}

type PostFullRequest = {
  image_binary: Blob;
}

export async function POST(request: Request) {
  let worker = null;

  try {
    // Data
    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!(imageFile instanceof Blob)) return NextResponse.json<OCRPostReturn>({status: 'error', message: 'Image file is not a blob'}, {status: 400});

    const arrayBuffer = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    
    // OCR
    worker = await createWorker('eng', 1, {});
    const { data } = await worker.recognize(imageBuffer, {}, { blocks: true }); // You can also use: tsv: true (alternative flat format)
    
    // Formatting & Processing
    const text_data: OCRPostReturn['text_data'] = [];
    if (data.blocks && Array.isArray(data.blocks)) {
      for (const block of data.blocks || []) {
        for (const paragraph of block.paragraphs || []) {
          for (const line of paragraph.lines || []) {
            for (const word of line.words || []) {
              if (word.text?.trim()) {
                const { bbox, confidence, text } = word;

                if (confidence < ocr_config.confidence_threshold) continue;

                text_data.push({
                  text: text.trim(),
                  bounding_box: {
                    x0: bbox.x0,
                    y0: bbox.y0,
                    x1: bbox.x1,
                    y1: bbox.y1,
                  },
                });
              }
            }
          }
        }
      }
    }

    // Cleanup
    await worker.terminate();
    worker = null;

    return NextResponse.json<OCRPostReturn>({
      status: 'success',
      message: '',
      text_data
    });
  } catch (e: any) {
    await worker?.terminate();
    worker = null;

    console.log('api/ocr/post error')
    console.log('Error Start--------------------------------');
    console.log(e.message.slice(0, 400));
    console.log('Error End--------------------------------');
    
    return NextResponse.json<OCRPostReturn>({status: 'error', message: 'There was an issue detecting text in the image'}, {status: 500});
  }
}
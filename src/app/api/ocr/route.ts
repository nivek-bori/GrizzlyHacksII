import { config } from "@/lib/config";
import { NextResponse } from "next/server";
import path from "path";
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
    worker = await createWorker('eng', 1, {
      workerPath: path.resolve(process.cwd(), 'node_modules/tesseract.js/src/worker-script/node/index.js'),
      corePath: path.resolve(process.cwd(), 'node_modules/tesseract.js-core/tesseract-core.wasm.js'),
      langPath: path.resolve(process.cwd(), `node_modules/@tesseract.js-data/eng/${config.ocr.tesseract_version}`),
      workerBlobURL: false,
    });
    const startTime = Date.now();
    const { data } = await worker.recognize(imageBuffer, {}, { blocks: true });
    const endTime = Date.now();
    console.log(`OCR timing: ${endTime - startTime}ms`);
    
    // Formatting & Processing
    const text_data: OCRPostReturn['text_data'] = [];
    if (data.blocks && Array.isArray(data.blocks)) {
      for (const block of data.blocks || []) {
        for (const paragraph of block.paragraphs || []) {
          for (const line of paragraph.lines || []) {
            for (const word of line.words || []) {
              if (word.text?.trim()) {
                const { bbox, confidence, text } = word;

                if (Number(confidence) < Number(config.ocr.confidence_threshold)) continue;

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
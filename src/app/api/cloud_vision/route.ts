import { verifyBody } from "@/lib/api";
import { CloudVisionTextDetection, DefaultAPIReturn, TesseractTextDetection } from "@/types/types";
import { NextResponse } from "next/server";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { config } from "@/lib/config";

export const runtime = "nodejs";

export type CloudVisionPostRequest = {
  image_binary: Blob;
};

export type CloudVisionPostReturn = DefaultAPIReturn & {
  text_data?: Array<CloudVisionTextDetection>;
};

function getVisionClient() {
  const raw = config.ocr.cloud_vision_sa_json;

  if (raw) {
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const decoded = Buffer.from(raw, "base64").toString("utf-8");
      parsed = JSON.parse(decoded);
    }

    return new ImageAnnotatorClient({
      credentials: {
        client_email: parsed.client_email,
        private_key: parsed.private_key,
      },
      projectId: parsed.project_id,
    });
  }

  return new ImageAnnotatorClient();
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const imageBinary = form.get("image");
    const seperateLevel = form.get("seperate_level") as 'word' | 'line' | undefined;
    if (!imageBinary || !(imageBinary instanceof Blob)) return NextResponse.json<CloudVisionPostReturn>({ status: "error", message: "Image binary is not a blob" }, { status: 400 });

    const arrayBuffer = await imageBinary.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const client = getVisionClient();
    const [result] = await client.documentTextDetection({ image: { content: buffer } });

    const annotation = result.fullTextAnnotation;
    const pages = annotation?.pages ?? [];

    const text_data: CloudVisionTextDetection[] = [];
    for (const page of pages) {
      const imgW = page.width ?? 0;
      const imgH = page.height ?? 0;

      for (const block of page.blocks ?? []) {
        for (const para of block.paragraphs ?? []) {
          if (seperateLevel === 'line') {
            const text = (para.words ?? []).map((word) => (word.symbols ?? []).map((s) => s.text ?? "").join("")).join(" ").trim();
            if (!text || /^[\s\p{P}\p{S}]+$/u.test(text)) continue;
            if (!para.boundingBox?.vertices?.length) continue;
            text_data.push({
              text,
              bounding_box: {
                x0: Math.min(imgW, Math.max(0, para.boundingBox.vertices[0].x ?? 0)),
                y0: Math.min(imgH, Math.max(0, para.boundingBox.vertices[0].y ?? 0)),
                x1: Math.min(imgW, Math.max(0, para.boundingBox.vertices[1].x ?? 0)),
                y1: Math.min(imgH, Math.max(0, para.boundingBox.vertices[1].y ?? 0)),
                x2: Math.min(imgW, Math.max(0, para.boundingBox.vertices[2].x ?? 0)),
                y2: Math.min(imgH, Math.max(0, para.boundingBox.vertices[2].y ?? 0)),
                x3: Math.min(imgW, Math.max(0, para.boundingBox.vertices[3].x ?? 0)),
                y3: Math.min(imgH, Math.max(0, para.boundingBox.vertices[3].y ?? 0)),
              },
            });
          } else {
            for (const word of para.words ?? []) {
              const text = (word.symbols ?? []).map((s) => s.text ?? "").join("");
              if (!text || /^[\s\p{P}\p{S}]+$/u.test(text.trim())) continue;

              if (!word.boundingBox?.vertices?.length) continue;

              text_data.push({
                text,
                bounding_box: {
                  x0: Math.min(imgW, Math.max(0, word.boundingBox?.vertices?.[0]?.x ?? 0)),
                  y0: Math.min(imgH, Math.max(0, word.boundingBox?.vertices?.[0]?.y ?? 0)),
                  x1: Math.min(imgW, Math.max(0, word.boundingBox?.vertices?.[1]?.x ?? 0)),
                  y1: Math.min(imgH, Math.max(0, word.boundingBox?.vertices?.[1]?.y ?? 0)),
                  x2: Math.min(imgW, Math.max(0, word.boundingBox?.vertices?.[2]?.x ?? 0)),
                  y2: Math.min(imgH, Math.max(0, word.boundingBox?.vertices?.[2]?.y ?? 0)),
                  x3: Math.min(imgW, Math.max(0, word.boundingBox?.vertices?.[3]?.x ?? 0)),
                  y3: Math.min(imgH, Math.max(0, word.boundingBox?.vertices?.[3]?.y ?? 0)),
                },
              });
            }
          }
        }
      }
    }

    if (text_data.length === 0 && result.textAnnotations?.length) {
      for (let i = 1; i < result.textAnnotations.length; i++) {
        const ta = result.textAnnotations[i];
        const text = ta.description ?? "";
        const verts = ta.boundingPoly?.vertices ?? [];

        if (!text || !verts.length) continue;

        text_data.push({
          text,
          bounding_box: {
            x0: verts[0].x ?? 0,
            y0: verts[0].y ?? 0,
            x1: verts[1].x ?? 0,
            y1: verts[1].y ?? 0,
            x2: verts[2].x ?? 0,
            y2: verts[2].y ?? 0,
            x3: verts[3].x ?? 0,
            y3: verts[3].y ?? 0,
          },
        });
      }
    }

    return NextResponse.json<CloudVisionPostReturn>({status: "success", message: "", text_data });
  } catch (e: any) {
    console.log("api/cloud_vision post error", e?.message ?? e);
    return NextResponse.json<CloudVisionPostReturn>({ status: "error", message: "There was an issue detecting text in the image" }, { status: 500 });
  }
}
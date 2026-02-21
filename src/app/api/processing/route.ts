import { DefaultAPIRet, verifyBody } from "@/lib/api";
import { NextResponse } from "next/server";

type OCRPostRequest = {
  image: string;
  font_name: string;
}

type PostFullRequest = {
  image: string;
  font_name: string;
}

export async function POST(request: Request) {
  try {
    // Data
    const body = await request.json() as OCRPostRequest;

    const props: PostFullRequest = { image: body.image, font_name: body.font_name };
    const props_error = verifyBody<PostFullRequest>(props, 'api/processing/post error');
    if (props_error) return props_error;

    const { image: image_data, font_name } = props;
    const image: Buffer = Buffer.from(image_data, 'base64');

		// Logic
    // (1) OCR
    // (2) Boudning box priority by smallest
    // (3) Return bounding boxes & data
    
		return NextResponse.json<DefaultAPIRet>({status: 'success', message: ''});
  } catch (e: any) {
    console.log('api/processing/post error');
    console.log('Error Start--------------------------------');
    console.log(e.message.slice(0, 400));
    console.log('Error End--------------------------------');
    return NextResponse.json<DefaultAPIRet>({status: 'error', message: 'There was an issue processing the image'}, {status: 500});
  }
}
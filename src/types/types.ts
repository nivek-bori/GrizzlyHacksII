export type DefaultAPIReturn = {
  status: 'success' | 'error';
  message: string;
}

export type TesseractTextDetection = {
  text: string;
  bounding_box: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export type CloudVisionTextDetection = {
  text: string;
  bounding_box: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3: number;
    y3: number;
  };
}
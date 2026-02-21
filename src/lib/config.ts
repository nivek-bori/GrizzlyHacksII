// formatted env variables
export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'TODO',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    route: process.env.NEXT_PUBLIC_DEFAULT_ROUTE || '',
    url_route: (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + (process.env.NEXT_PUBLIC_DEFAULT_ROUTE || ''),
  },
  ocr: {
    confidence_threshold: process.env.NEXT_PUBLIC_TESSERACT_CONFIDENCE_THRESHOLD || 0.3,
    tesseract_version: process.env.NEXT_PUBLIC_TESSERACT_VERSION || '4.0.0',
  }
};
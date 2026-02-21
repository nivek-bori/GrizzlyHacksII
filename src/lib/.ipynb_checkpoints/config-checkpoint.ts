// formatted env variables
export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'TODO',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    route: process.env.NEXT_PUBLIC_DEFAULT_ROUTE || '',
    url_route: (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + (process.env.NEXT_PUBLIC_DEFAULT_ROUTE || ''),
  },
};

export const ocr_config = {
  confidence_threshold: 0.3,
};
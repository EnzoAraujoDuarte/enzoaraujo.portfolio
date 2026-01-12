// Normalize backend URL - remove trailing slash to avoid double slashes
const rawUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';
export const BACKEND_URL = rawUrl.replace(/\/+$/, ''); // Remove trailing slashes

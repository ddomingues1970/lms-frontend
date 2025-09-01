import { environment } from '../../../environments/environment';

// Remove barras finais e evita duplicar /api
const base = environment.apiBaseUrl.replace(/\/+$/, '');
export const API_BASE = base.endsWith('/api') ? base : `${base}/api`;

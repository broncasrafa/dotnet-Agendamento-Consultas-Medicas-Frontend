import { HttpContextToken } from '@angular/common/http';

export const DISABLE_GLOBAL_LOADING = new HttpContextToken<boolean>(() => false);

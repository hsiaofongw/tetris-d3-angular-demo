import { InjectionToken } from "@angular/core";

// fullPath = server + path
export type ApiConfig = { server: string; path: string };
export const API_CONFIG = new InjectionToken<ApiConfig>(
  'Auth Backend Config'
);

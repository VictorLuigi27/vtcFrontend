// src/global.d.ts
declare global {
  interface Window {
    google: typeof google;
  }
}

declare let google: typeof google;

export {};

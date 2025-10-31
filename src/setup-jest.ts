import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// Mock de Ionic Native plugins si es necesario
Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    display: 'none',
    appearance: ['-webkit-appearance']
  })
});

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});

Object.defineProperty(document.body.style, 'transform', {
  value: () => ({
    enumerable: true,
    configurable: true
  })
});

// Mock console.warn to avoid noise in tests
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  // Silenciar warnings específicos que no queremos ver en tests
  if (args[0]?.includes?.('NG0912') || args[0]?.includes?.('Component should')) {
    return;
  }
  originalWarn(...args);
}; 
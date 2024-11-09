import { afterAll, afterEach, beforeAll, vi } from "vitest";
import '@testing-library/jest-dom/vitest'
import ResizeObserver from 'resize-observer-polyfill'
import { server } from "./mocks/server";

beforeAll(()=> server.listen())
afterEach(()=> server.resetHandlers());
afterAll(()=> server.close())

global.ResizeObserver = ResizeObserver;

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();


Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // For backward compatibility
    removeListener: vi.fn(), // For backward compatibility
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
});
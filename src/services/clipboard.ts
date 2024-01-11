import { playClickSound } from "./sounds";

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

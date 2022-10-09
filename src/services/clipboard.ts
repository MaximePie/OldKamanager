
export function copyToClipboard(text: string) {
  console.log("Copied " + text);
  navigator.clipboard.writeText(text)
}
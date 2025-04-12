export function encodeBase64(input: string): string {
  const buffer = Buffer.from(input, "utf-8")
  return buffer.toString("base64")
}

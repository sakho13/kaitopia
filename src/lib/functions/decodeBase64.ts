export function decodeBase64(input: string): string {
  const buffer = Buffer.from(input, "base64")
  return buffer.toString("utf-8")
}

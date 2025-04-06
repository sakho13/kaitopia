export function joincn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

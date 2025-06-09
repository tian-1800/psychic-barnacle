function capitalize(input: string): string {
  if (!input) return input;
  return input
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default capitalize;

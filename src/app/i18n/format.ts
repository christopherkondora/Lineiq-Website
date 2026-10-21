/**
 * Fills the `{name}` slots of a dictionary string. A slot with no value stays
 * as written, so a missing value shows up on the page instead of vanishing.
 */
export function format(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (slot, name: string) =>
    name in values ? String(values[name]) : slot
  );
}

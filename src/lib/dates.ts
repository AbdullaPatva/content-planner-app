export const dayKey = (d: Date | string) =>
    typeof d === 'string' ? d.slice(0, 10) : d.toISOString().slice(0, 10)
  
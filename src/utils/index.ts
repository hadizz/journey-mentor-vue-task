export const formatFields = (params: Record<string, boolean>) => {
  return Object.entries(params)
    .filter(([_, value]) => value)
    .map(([key]) => key)
    .join(',')
}

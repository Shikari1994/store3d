export const useClientId = (): string => {
  const params = new URLSearchParams(window.location.search)
  return params.get('clientId') ?? 'demo'
}

// Stub implementation - returns coordinates as address string
// Replace with actual geocoding service if needed
export default async function getAddressFromLatLng(
  lat: number,
  lng: number
): Promise<string> {
  // Return coordinates as fallback
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

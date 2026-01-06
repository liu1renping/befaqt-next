// Reverse geocoding using OpenStreetMap Nominatim API (free, no API key required)
// Note: Nominatim has usage policies - max 1 request per second recommended

export default async function getAddressFromLatLng(
  lat: number,
  lng: number
): Promise<string> {
  // Skip if coordinates are invalid
  if (!lat || !lng || lat === 0 || lng === 0) {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }

  try {
    // Use Nominatim reverse geocoding API
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "BeFAQT-App/1.0", // Required by Nominatim usage policy
        "Accept-Language": "en",
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.address) {
      const addr = data.address;
      // Build a readable address string
      const addressParts: string[] = [];

      // Add street address
      if (addr.road) {
        if (addr.house_number) {
          addressParts.push(`${addr.house_number} ${addr.road}`);
        } else {
          addressParts.push(addr.road);
        }
      }

      // Add suburb/city
      if (addr.suburb || addr.village || addr.town || addr.city) {
        addressParts.push(
          addr.suburb || addr.village || addr.town || addr.city
        );
      }

      // Add state/region
      if (addr.state || addr.region) {
        addressParts.push(addr.state || addr.region);
      }

      // Add country
      if (addr.country) {
        addressParts.push(addr.country);
      }

      // Add postcode if available
      if (addr.postcode) {
        const postcodeIndex =
          addressParts.length > 0 ? addressParts.length - 1 : 0;
        addressParts[postcodeIndex] =
          `${addressParts[postcodeIndex]} ${addr.postcode}`;
      }

      return addressParts.length > 0
        ? addressParts.join(", ")
        : data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }

    // Fallback to display_name if address object is not structured as expected
    if (data.display_name) {
      return data.display_name;
    }

    // Final fallback to coordinates
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.warn("Geocoding error:", error);
    // Return coordinates as fallback on error
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

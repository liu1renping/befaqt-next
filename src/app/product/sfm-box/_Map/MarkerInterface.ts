export default interface MarkerInterface {
  location: LocInterface;
  title: string;
  label: string;
  iconUrl?: string; // Optional custom icon URL
  iconSize?: [number, number]; // Optional custom icon size [width, height]
  iconAnchor?: [number, number]; // Optional custom icon anchor point
}

export interface LocInterface {
  lat: number;
  lng: number;
}

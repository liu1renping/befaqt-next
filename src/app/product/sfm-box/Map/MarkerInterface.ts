export default interface MarkerInterface {
  location: LocInterface;
  title: string;
  label: string;
}

export interface LocInterface {
  lat: number;
  lng: number;
}

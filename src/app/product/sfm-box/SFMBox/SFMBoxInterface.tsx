export default interface SFMBoxInterface {
  boxID: string;
  fisher: FisherInterface;
  catchProv: CatchProvInterface;
  iotResult: IoTDataInterface;
  imageProc: ImageProcInterface[];
  e_nose: E_NoseInterface[];
  freshness: FreshnessInterface[];
}

export interface FisherInterface {
  traderID: string;
  traderName: string;
  companyName: string;
  boat: string;
  address: string;
}

export interface CatchProvInterface {
  time: string;
  boat: string;
  latitude: number;
  longitude: number;
  locationCodeLat: string;
  locationCodeLong: string;
  method: string;
  img: string;
  species: string;
  size: string;
  note: string;
  txHash: string;
}

export interface IoTDataInterface {
  operator: string;
  iotScore: number;
  confidence: number;
  time: string;
  latitude: number;
  longitude: number;
  iotTracking: IoTTrackingIntrface[];
}

export interface IoTTrackingIntrface {
  time: string;
  latitude: number;
  longitude: number;
  iotID: string;
  temperature: number;
  txHash: string;
}

export interface ImageProcInterface {
  operator: string;
  imgScore: number;
  time: string;
  latitude: number;
  longitude: number;
  txHash: string;
  overallResult: {
    fish: number;
    confidence: number;
    eye: number;
    skin: number;
  };
  resultPerImage: ImageProcPerImgInterface[];
}

interface ImageProcPerImgInterface {
  image: string;
  fish: number;
  confidence: number;
  eye: number;
  skin: number;
}

export interface E_NoseInterface {
  operator: string;
  noseScore: number;
  confidence: number;
  time: string;
  latitude: number;
  longitude: number;
  resultPerTest: E_NoseResultInterface[];
}

interface E_NoseResultInterface {
  noseScore: number;
  confidence: number;
  sensingData: string;
}

export interface FreshnessInterface {
  freshnessIndex: number;
  time: string;
  conf_iot: number;
  conf_img: number;
  conf_enose: number;
  txHash: string;
}

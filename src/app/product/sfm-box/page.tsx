import { Metadata } from "next";
import SFMBox from "./SFMBox";

export const metadata: Metadata = {
  title: "SFM Box - IoT Tracking",
  description: "Sydney Fish Market Box with IoT tracking technology",
  alternates: {
    canonical: "/product/sfm-box",
  },
};

export default function SFMBoxPage() {
  return (
    <main className="main-page">
      <div className="w-full max-w-7xl mx-auto">
        <SFMBox />
      </div>
    </main>
  );
}

import Image from "next/image";
import { Metadata } from "next";

import { PROJECT_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Technology",
  description: `About ${PROJECT_NAME}`,
  alternates: {
    canonical: "/about/tech",
  },
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}

const AboutSection = ({
  title,
  children,
  imageSrc,
  imageAlt,
  reverse = false,
}: SectionProps) => (
  <section
    className={`flex flex-col ${
      reverse ? "md:flex-row-reverse" : "md:flex-row"
    } items-center gap-3 md:gap-5 last:mb-0`}
  >
    <div className="w-full md:w-1/2">
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.05] duration-500">
        {imageSrc.includes("youtube.com/embed") ? (
          <iframe
            src={imageSrc}
            title={imageAlt}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : imageSrc.endsWith(".mp4") ? (
          <video
            src={imageSrc}
            className="w-full h-full object-cover"
            controls
            playsInline
            muted
            autoPlay
            loop
          />
        ) : (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>
    </div>
    <div className="w-full md:w-1/2 flex flex-col">
      <h2 className="text-xl md:text-3xl font-bold">{title}</h2>
      <div className="space-y-2 leading-relaxed">{children}</div>
    </div>
  </section>
);

export default function AboutTechPage() {
  return (
    <main className="main-page">
      {/* Hero Section */}
      <div className="max-w-4xl text-center mb-5">
        <h1 className="page-title">About {PROJECT_NAME} Technologies</h1>
        <p className="text-lg md:text-xl font-light max-w-2xl mx-auto italic">
          &ldquo;Blockchain enabled Fish provenance And Quality Tracking&rdquo;
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        {/* Technologies */}
        <AboutSection
          title="Technologies"
          imageSrc="https://www.youtube.com/embed/hHGJ7YGpBWI?si=3YEa8Nt-HtfhYF7j"
          imageAlt="BeFAQT YouTube"
        >
          <p>
            Working with Sydney Fish Market, UTS research team in Global Big
            Data Technologies Centre developed a Blockchain enabled Fish
            provenance And Quality Tracking (BeFAQT) System to overcome the fish
            supply chain challenges. BeFAQT combines IoT, Image Processing,
            E-nose, Blockchain system and mobile Apps in an original and
            innovative way to address issues in the fish supply chain.
          </p>
          <p>
            The developed Blockchain, IoT, and AI technologies are being
            trialled within Sydney Fish Market supply chains. Initial results
            show that BeFAQT system delivered authentic fish catch provenance
            and trusted supply chain tracking. It also provided a comprehensive
            fish freshness index by integrating measurements from IoT, sensors,
            E-eye, and E-nose. These provenance, tracking, and freshness data
            are secured by Blockchain, fed into Sydney Fish Market Online
            Trading platform, and shared with traders and consumers.
          </p>
        </AboutSection>

        {/* Blockchain enabled Online Trading Platform */}
        <AboutSection
          title="Blockchain enabled Online Trading Platform"
          imageSrc="/images/pic_visit_fisherman.png"
          imageAlt="about project"
          reverse
        >
          <p>
            The UTS research team proposed to develop a Blockchain enabled Fish
            provenance And Quality Tracking (BeFAQT) system to overcome the fish
            supply chain challenges. In this project, the BeFAQT team developed
            a wide range of technologies, including Internet of Things (IoT),
            e-eye, e-nose, blockchain enabled mobile App and online platform.
            The developed technologies have been trialled within the fishing
            industry. In particular, the IoT, Blockchain platform and App
            technologies have been trialled with fishermen to secure fish catch
            origin and supply chain tracking. The e-eye and e-nose technologies
            have been trialled for freshness assessments in Sydney Fish Market,
            where thousands of fish samples are collected and analysed. The
            BeFAQT system is being integrated in Sydney Fish Market’s online
            trading platform to deliver blockchain secured provenance and
            quality tracking data to the buyers.
          </p>
        </AboutSection>

        {/* Internet of Things (IoT) */}
        <AboutSection
          title="Internet of Things (IoT)"
          imageSrc="/images/pic_fishrecord.png"
          imageAlt="about project"
        >
          <p>
            The BeFAQT system enables the online buyers to achieve better than
            onsite inspection experiences, in that they can not only have the
            see, feel and smell experience, but also have access to
            comprehensive information in seafood provenance, supply chain
            tracking, and quality assessment. With BeFAQT system, online buyers
            can have early access to catch list, including authenticated fish
            photo, species, and sizes, with trusted origin, visible condition
            tracking, and objective quality assessment. The developed BeFAQT
            technologies support Sydney Fish Market online trading platform to
            achieve simplified process, transparent and trusted supply chain,
            shorter time to market and wider market access.
          </p>
          <p>
            BeFAQT provides a provable way for the fishers to demonstrate
            provenance such as location of catch and proof of cold chain so that
            better quality product can be rewarded with higher prices. The
            technologies can potentially reduce paperwork with automated catch
            recording of species and sizes to the Sydney Fish Market online
            platform. With BeFAQT system, the catch provenance is shared
            immediately in the online trading platform, where the buyers can
            start bidding on a fish, e.g. Kingfish, whilst the fisherman is
            still at sea.
          </p>
          <p>
            According to Bryan Skepper, Chair of NSW Seafood Industry Council,
            “the BeFAQT system has huge potential. Once successfully
            commercialised, the developed technologies can be extended
            throughout the fishing industry in Australia, and potentially
            exported to other countries, benefiting the entire fishing industry.
            The developed technologies can be extended to other food supply
            chains, such as meat, fruit and vegetables.”
          </p>
        </AboutSection>
      </div>
    </main>
  );
}

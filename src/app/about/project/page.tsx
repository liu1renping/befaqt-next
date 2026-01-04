import Image from "next/image";
import { Metadata } from "next";

import { PROJECT_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Project",
  description: `About ${PROJECT_NAME}`,
  alternates: {
    canonical: "/about/project",
  },
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  imageAspectRatio?: string;
}

const AboutSection = ({
  title,
  children,
  imageSrc,
  imageAlt,
  reverse = false,
  imageAspectRatio = "aspect-[16/9]",
}: SectionProps) => (
  <section
    className={`flex flex-col ${
      reverse ? "md:flex-row-reverse" : "md:flex-row"
    } items-center gap-3 md:gap-5 last:mb-0`}
  >
    <div className="w-full md:w-1/2">
      <div
        className={`relative ${imageAspectRatio} rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.05] duration-500`}
      >
        {imageSrc.endsWith(".mp4") ? (
          <video
            src={imageSrc}
            className="w-full h-full object-cover"
            controls
            playsInline
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

export default function AboutProjectPage() {
  return (
    <main className="main-page">
      {/* Hero Section */}
      <div className="max-w-4xl text-center mb-5">
        <h1 className="page-title">About {PROJECT_NAME}</h1>
        <p className="text-lg md:text-xl font-light max-w-2xl mx-auto italic">
          &ldquo;Blockchain enabled Fish provenance And Quality Tracking&rdquo;
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        {/* Background and Objectives */}
        <AboutSection
          title="Background and Objectives"
          imageSrc="/videos/BeFAQTvideoABCnews.mp4"
          imageAlt="BeFAQT"
        >
          <p>
            Seafood auctions start from 5:30am every weekday at Sydney Fish
            Market, where buyers inspect the produce before their bidding.
            Sydney Fish Market had been planning to develop an online version of
            its famous seafood auction. The challenge then was how to provide
            the same onsite inspection experience (see, feel, and smell) to the
            online buyers. In 2018, the Food Agility CRC organised two workshops
            attended by representatives from Sydney Fish Market, UTS research
            teams, Fisheries Research and Development Corporation (FRDC),
            Fishermen’s Co-operatives, NSW Department of Primary Industries
            (DPI), and WWF. The workshops identified a number of challenges,
            including the lack of fish origin and quality information within
            fish supply chains, as important constraints to innovation and
            growth in the seafood industry.
          </p>
        </AboutSection>

        {/* Technologies and Trials */}
        <AboutSection
          title="Technologies and Trials"
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

        {/* Benefits and Impacts */}
        <AboutSection
          title="Benefits and Impacts"
          imageSrc="/images/pic_fishrecord.png"
          imageAlt="about project"
          imageAspectRatio="aspect-[8/9]"
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

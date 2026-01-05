import Image from "next/image";
import { Metadata } from "next";

import { COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Technology",
  description: `About ${COMPANY_NAME}`,
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
        <h1 className="page-title">{COMPANY_NAME} - Technologies</h1>
        <p className="text-lg md:text-xl font-light max-w-2xl mx-auto italic">
          &ldquo;Blockchain enabled Fish provenance And Quality Tracking&rdquo;
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        {/* Seafood Traceability */}
        <AboutSection
          title="Seafood Traceability"
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
          title="Online Trading Platform"
          imageSrc="/images/pic_home16x9.jpg"
          imageAlt="Online Trading Platform"
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
          imageSrc="/images/pic_sfm-box1.jpg"
          imageAlt="about project"
        >
          <p>
            the UTS team has developed new 5G / NB-IoT devices that are mounted
            on Sydney Fish Market fish boxes, which are used by fishermen across
            NSW to store and transport fish produce. The instrumented fish boxes
            record the locations and temperature conditions onboard the fishing
            boats at the origin and across the fish supply chain.
          </p>
          <p>
            The developed IoT + Blockchain technologies achieve much more than
            the existing data logger technology in terms of information
            reliability, trust data sharing, supply chain coverage, and
            real-time data delivery, which enable prompt actions. Utilising 5G
            NB-IoT technology, these devices can achieve seamless connectivity
            for domestic and international supply chain tracking. Smart
            buffering algorithms are designed to cope with the limited mobile
            coverage in the ocean and in cool rooms. Energy efficient firmware
            is implemented to prolong IoT device lifetime, permitting the
            tracking of the fish boxes from catch origin to Sydney Fish Market.
          </p>
          <p>
            In this way, the temperature and location of every individual Sydney
            Fish Market box can be obtained in real-time and then secured in
            Blockchain by Smart Contract.
          </p>
        </AboutSection>

        {/* E-eye */}
        <AboutSection
          title="E-eye"
          imageSrc="/images/pic_imgproc.png"
          imageAlt="about project"
          reverse
        >
          <p>
            The UTS team has built a robust computer vision platform to
            automatically and unbiasedly extract essential pixel-based elements
            known as “image features” of objects in the image/video. Advanced
            machine learning is then applied to build AI models for fish
            freshness assessment, size estimation and species recognition.
          </p>
          <p>
            This is the first time multi-sensor (IoT sensors, E-eye, and E-nose)
            technologies have been combined to address fish freshness assessment
            in an industrial environment. Novel designs and Artificial
            Intelligence (AI) methodologies are created in each of the
            technologies to address practical conditions in the fish supply
            chains.{" "}
          </p>
        </AboutSection>

        {/* E-nose */}
        <AboutSection
          title="E-nose"
          imageSrc="/images/pic_enose.png"
          imageAlt="about project"
        >
          <p>
            The UTS team has also developed machine olfactory technologies to
            assess fish freshness. The e-nose system includes an airflow intake
            system and control logics to carry out the automatic odour analysis.
            Novel non-parametric kernel based modelling and Hidden Markov Model
            are developed for data processing and classification.
          </p>
        </AboutSection>

        {/* Fisherman App */}
        <AboutSection
          title="Fisherman App"
          imageSrc="/images/pic_fisherapp.png"
          imageAlt="about project"
          reverse
        >
          <p>
            The Blockchain-secured Fisherman App records and certifies fish
            catch time, location, photo, and the company. The fish species
            recognition and size estimation developed in the E-eye system is
            being integrated in the App to achieve automated catch reporting.
            Traders and consumers can also use the Blockchain App to verify fish
            provenance and quality tracking information.
          </p>
        </AboutSection>
      </div>
    </main>
  );
}

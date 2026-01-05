import { COMPANY_EMAIL, COMPANY_NAME } from "@/lib/constants";
import Image from "next/image";

const teamMembers = [
  {
    name: "Prof. Ren Ping Liu",
    role: "Project Leader",
    image: "/images/photo_ren.jpeg",
  },
  {
    name: "Dr. Xu Wang",
    role: "Blockchain Stream Lead",
    image: "/images/photo_xu.jpeg",
  },
  {
    name: "Prof. Jian Zhang",
    role: "E-eye Stream Lead",
    image: "/images/photo_jian.jpeg",
  },
  {
    name: "A/Prof. Steven Su",
    role: "E-nose Stream Lead",
    image: "/images/photo_steven.jpeg",
  },
  {
    name: "Dr. Ying He",
    role: "IoT Stream Lead",
    image: "/images/photo_ying.jpeg",
  },
  {
    name: "A./Prof. Qiang Wu",
    role: "Advisor",
    image: "/images/photo_qiang.jpeg",
  },
  {
    name: "Prof. Eryk Dutkiewicz",
    role: "Advisor",
    image: "/images/photo_eryk.jpeg",
  },
  {
    name: "Peter Loneragan",
    role: "Project Manager",
    image: "/images/photo_peter.jpeg",
  },
  {
    name: "Saber Yu",
    role: "Blockchain Developer",
    image: "/images/photo_saber.jpeg",
  },
  {
    name: "Dr. Zongjian Zhang",
    role: "E-eye Developer",
    image: "/images/photo_zongjian.jpeg",
  },
  {
    name: "Wentian Zhang",
    role: "IoT Developer",
    image: "/images/photo_wentian.jpeg",
  },
  {
    name: "Taoping Liu",
    role: "e-nose Developer",
    image: "/images/photo_taoping.jpeg",
  },
];
export default function TeamPage() {
  return (
    <main className="main-page">
      <h1 className="page-title">{COMPANY_NAME} - Team</h1>
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-xl font-bold text-sky-500 text-center mb-4">
          🎉 BeFAQT team won the{" "}
          <a
            href="https://aiia.com.au/iaward/2020-nsw-iawards-winners/"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            NSW iAwards 2020
          </a>
          ! <span className="inline-block scale-x-[-1]">🎉</span>
        </div>

        <Image
          src="/images/photo_BeFAQTiAwardTeam16x9sm.jpg"
          alt="BeFAQT iAwards Team"
          width={1000}
          height={1000}
          title="BeFAQT - NSW iAwards 2020 Team"
          aria-label="BeFAQT - NSW iAwards 2020 Team"
          className="rounded-xl object-cover w-full h-auto mb-4"
        />

        <h2 className="text-2xl font-bold text-center">Project Team</h2>
        <p className="text-lg mb-4">
          The BeFAQT team comprises researchers, developers, PhD students, and
          managers from UTS and Sydney Fish Market.
        </p>
        {/* Placeholder for team members */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 mb-4">
          {teamMembers.map((member) => (
            <div key={member.name} className="border p-4 rounded shadow">
              <div className="w-full h-auto bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={100}
                  height={100}
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-center">
                {member.name}
              </h3>
              <p className="text-gray-600 text-center">{member.role}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-center">Sydney Fish Market</h2>
        <p className="text-lg mb-4">
          Erik Poole and Nick Paton from the Sydney Fish Market.
        </p>

        <h2 className="text-2xl font-bold text-center">List of Publications</h2>
        <ol className="list-decimal list-inside">
          <li>
            Xu Wang, Guangsheng Yu, Ren Ping Liu, Jian Zhang, Qiang Wu, Steven
            W. Su, etc, Blockchain-Enabled Fish Provenance and Quality Tracking
            System, IEEE Internet of Things Journal, June 2022
          </li>
          <li>
            Guangsheng Yu, Xuan Zha, Xu Wang, Wei Ni, Kan Yu, J. Andrew Zhang,
            Ren Ping Liu, A Unified Analytical model for proof-of-X schemes,
            Computers & Security,2020
          </li>
          <li>
            Guangsheng Yu, Xuan Zha, Xu Wang, Wei Ni, Kan Yu, Ping Yu, J.
            Andrew, Ren Ping Liu, Y. Jay Guo, Enabling Attribute Revocation for
            Fine-Grained Access Control in Blockchain-IoT Systems, IEEE
            Transactions on Engineering Management, Feb. 2020.
          </li>
          <li>
            Guangsheng Yu, Xu Wang, Kan Yu, Wei Ni, J. Andrew Zhang, Ren Ping
            Liu, Survey: Sharding in Blockchains, IEEE Access, 2020
          </li>
          <li>
            Xu Wang, Ping Yu, Guangsheng Yu, Xuan Zha, Wei Ni, Ren Ping Liu, Y.
            Jay Guo, A High-Performance Hybrid Blockchain System for Traceable
            IoT Applications, International Conference on Network and System
            Security, December 2019.
          </li>
          <li>
            Wentian Zhang et al. A novel data pre-processing method for odour
            detection and identification system. Sensors and Actuators A:
            Physical, 287:113–120, 2019.
          </li>
          <li>
            Taoping Liu et al. A novel multi-odour identification by electronic
            nose using non-parametric modelling-based feature extraction and
            time-series classification. Sensors and Actuators B: Chemical, 2019.
          </li>
          <li>
            Huaxi Huang et al. Compare More Nuanced: Pairwise Alignment Bilinear
            Network for Few-Shot Fine-Grained Learning, IEEE International
            Conference on Multimedia and Expo, ICME 2019, pp.91-96.
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-center">Contact Us</h2>
        <p className="text-lg mb-4">
          If you have any questions or would like to get in touch with the
          BeFAQT team, please email us at{" "}
          <a href={COMPANY_EMAIL} className="link">
            {COMPANY_EMAIL}
          </a>
        </p>
      </div>
    </main>
  );
}

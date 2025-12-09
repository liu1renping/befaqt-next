export default function TechPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Technology</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Our technology stack includes advanced IoT sensors, E-eye and E-nose
          for freshness detection, and a secure Blockchain platform for data
          integrity.
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Internet of Things (IoT)</li>
          <li>Blockchain Data Sharing</li>
          <li>E-eye & E-nose Sensors</li>
          <li>Fisherman Applications</li>
        </ul>
      </div>
    </div>
  );
}


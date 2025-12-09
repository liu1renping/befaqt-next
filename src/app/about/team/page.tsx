export default function TeamPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Our Team</h1>
      <p className="text-lg mb-4">
        Meet the dedicated team working on verifying fish catch origin and
        automating freshness assessments.
      </p>
      {/* Placeholder for team members */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border p-4 rounded shadow">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 mx-auto"></div>
            <h3 className="text-xl font-semibold text-center">
              Team Member {i}
            </h3>
            <p className="text-gray-600 text-center">Role / Title</p>
          </div>
        ))}
      </div>
    </div>
  );
}

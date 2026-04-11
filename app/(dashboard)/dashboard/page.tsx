export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold">Hello, John Doe</h1>
        <p className="text-gray-500">Company Performance</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card title="Total Employees" value="200" change="+1%" />
        <Card title="Attendance Rate" value="80%" change="-10%" />
        <Card title="Expenses" value="30 Mil" change="+30%" />
        <Card title="Hiring Applicant" value="12" change="+10" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="font-semibold mb-4">Attendance</h2>

        <table className="w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Status</th>
              <th>Periode</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td>Jainudin</td>
              <td>Business Development</td>
              <td className="text-green-600">Approve</td>
              <td>2 Days</td>
              <td>Sick Leave</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

function Card({ title, value, change }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-green-500">{change}</div>
    </div>
  );
}
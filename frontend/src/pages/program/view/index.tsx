import { useEffect, useState } from "react";

export function ViewProgramPage({ OnyxSDK }: { OnyxSDK: any }) {
  const { DashboardShell } = OnyxSDK.ui;
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      const program = await OnyxSDK.api.get(
        `/neuron/bugbounty/program/get?id=${id}`
      );
      setProgram(program);
      setLoading(false);
    };

    fetchProgram();
  }, [id]);

  return (
    <DashboardShell heading="View Program" text="View a program">
      <div className="p-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="p-4">
            <h1 className="text-xl font-bold">{program.name}</h1>
            <p>
              <a
                href={program.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {program.url}
              </a>
            </p>
            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Scope
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {program.scope.map((scope) => (
                    <tr key={scope.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {scope.scope}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {scope.scopeType}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

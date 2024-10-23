import { constructMetadata } from "@onyx/core/utils/metadata";
import { authOptions } from "@onyx/core/auth";
import { prisma } from "@onyx/db";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  DashboardShell,
  DashboardHeader,
} from "@onyx/ui";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export const metadata = constructMetadata({
  title: "View Program",
});

export default async function ViewProgramPage({ id }: { id: string }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const program = await prisma["bugbounty"].program.findUnique({
    where: {
      id: id,
    },
    include: {
      scope: true,
    },
  });

  if (!program) redirect("/dashboard/program");

  return (
    <DashboardShell>
      <DashboardHeader
        heading="View Program"
        text="View a program"
      ></DashboardHeader>
      <Card className="pt-4">
        <CardContent>
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
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

import { notFound } from "next/navigation";

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  if (!slug?.length) return notFound();

  const joinedSlug = slug.join(" / ");

  return (
    <div>
      <h1 className="text-2xl font-bold capitalize">
        {joinedSlug.replace(/-/g, " ")}
      </h1>

      <p className="text-gray-500 mt-2">
        Halaman module: {joinedSlug}
      </p>
    </div>
  );
}
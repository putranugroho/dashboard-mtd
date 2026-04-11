import { notFound } from "next/navigation";

export default function DynamicPage({ params }: any) {
    const slug = params.slug?.join(" / ");

    if (!slug) return notFound();

    return (
        <div>
            <h1 className="text-2xl font-bold capitalize">
                {slug.replace(/-/g, " ")}
            </h1>

            <p className="text-gray-500 mt-2">
                Halaman module: {slug}
            </p>
        </div>
    );
}
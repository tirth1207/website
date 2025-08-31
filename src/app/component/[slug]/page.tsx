import { Components } from "@/data/component";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return Components.map((component) => ({
    slug: component.name.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: Props) {
  const component = Components.find(
    (c) => c.name.toLowerCase() === params.slug
  );
  if (!component) return {};
  return {
    title: component.name,
    description: component.description,
  };
}

export default function ComponentPage({ params }: Props) {
  const component = Components.find(
    (c) => c.name.toLowerCase() === params.slug
  );

  if (!component) {
    notFound();
  }

  return (
    <section className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        {component.icon && (
          <span className="inline-block align-middle">
            {/* @ts-ignore */}
            <component.icon className="w-6 h-6" />
          </span>
        )}
        {component.name}
      </h1>
      <p className="text-muted-foreground mb-4">{component.description}</p>
      {component.github && (
        <a
          href={component.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm mb-4 inline-block"
        >
          View on GitHub
        </a>
      )}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-1">Usage</h2>
        <pre className="bg-muted rounded p-3 overflow-x-auto text-sm">
          {component.usage}
        </pre>
      </div>
      {component.props && component.props.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-1">Props</h2>
          <table className="w-full text-sm border">
            <thead>
              <tr>
                <th className="text-left p-2 border-b">Name</th>
                <th className="text-left p-2 border-b">Type</th>
                <th className="text-left p-2 border-b">Required</th>
                <th className="text-left p-2 border-b">Default</th>
                <th className="text-left p-2 border-b">Description</th>
              </tr>
            </thead>
            <tbody>
              {component.props.map((prop) => (
                <tr key={prop.name}>
                  <td className="p-2 border-b">{prop.name}</td>
                  <td className="p-2 border-b">{prop.type}</td>
                  <td className="p-2 border-b">
                    {prop.required ? "Yes" : "No"}
                  </td>
                  <td className="p-2 border-b">
                    {prop.default !== undefined ? String(prop.default) : "-"}
                  </td>
                  <td className="p-2 border-b">{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {component.example && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-1">Example</h2>
          <pre className="bg-muted rounded p-3 overflow-x-auto text-sm mb-2">
            {component.example.code}
          </pre>
          {component.example.preview && (
            <div
              className="border rounded p-3 bg-background"
              dangerouslySetInnerHTML={{ __html: component.example.preview }}
            />
          )}
        </div>
      )}
      {component.tags && component.tags.length > 0 && (
        <div className="mb-2">
          <h2 className="font-semibold text-lg mb-1">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {component.tags.map((tag) => (
              <span
                key={tag}
                className="bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

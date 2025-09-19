import Link from "next/link"
import { Components } from "@/data/component"

export default function HomePage() {
  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter text-center">Component Library</h1>
      <div className="flex flex-col space-y-1 mb-4">
        {Components.map((component, id) => (
          <Link
            key={component.slug}
            className="flex flex-col space-y-1 mb-4 border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
            href={`/component/${component.slug}`}
          >
            <div className="w-full flex flex-col">
              <p className="tracking-tight font-semibold text-lg">{component.name}</p>
              <p className="h-8 text-xs text-muted-foreground line-clamp-2">
                {component.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

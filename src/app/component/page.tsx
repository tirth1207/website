import BlurFade from "@/components/magicui/blur-fade";
import { Components } from "@/data/component";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "My thoughts on software development, life, and more.",
};

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage() {

  return (
    <section>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-medium text-2xl mb-8 tracking-tighter">Components</h1>
      </BlurFade>
      {Components.map((component, idx) => (
        <BlurFade delay={BLUR_FADE_DELAY * 2 + idx * 0.05} key={component.name}>
          <Link
            className="flex flex-col space-y-1 mb-4"
            href={`/component/${component.slug}`}
          >
            <div className="w-full flex flex-col">
              <p className="tracking-tight">{component.name}</p>
              <p className="h-6 text-xs text-muted-foreground">
                {component.description}
              </p>
            </div>
          </Link>
        </BlurFade>
      ))}
    </section>
    
  );
}

import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

type ComponentMetadata = {
  title: string;
  slug: string;
  description: string;
  cli: string;
  github: string;
  docs: string;
  tags: string[];
};

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

export async function markdownToHTML(markdown: string) {
  const p = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      // https://rehype-pretty.pages.dev/#usage
      theme: {
        light: "min-light",
        dark: "min-dark",
      },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown);

  return p.toString();
}

export async function getComponent(slug: string) {
  const filePath = path.join(process.cwd(), "content", "components", `${slug}.mdx`);
  console.log('Looking for MDX file at:', filePath);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`MDX file not found: ${filePath}`);
  }
  
  let source = fs.readFileSync(filePath, "utf-8");
  const { content: rawContent, data: metadata } = matter(source);
  const content = await markdownToHTML(rawContent);
  return {
    source: content,
    rawContent: rawContent, // Keep raw content for extraction
    metadata: metadata as ComponentMetadata,
    slug,
  };
}

async function getAllComponents(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return Promise.all(
    mdxFiles.map(async (file) => {
      let slug = path.basename(file, path.extname(file));
      let { metadata, source } = await getComponent(slug);
      return {
        metadata,
        slug,
        source,
      };
    })
  );
}

export async function getComponentPosts() {
  return getAllComponents(path.join(process.cwd(), "content", "components"));
}

// Helper function to extract usage code from MDX content
export function extractUsageFromMDX(content: string): string {
  // Match the usage section with tsx code block
  const usageMatch = content.match(/## Usage\s*\n\s*```tsx\s*\n([\s\S]*?)\n\s*```/);
  if (usageMatch) {
    return usageMatch[1].trim();
  }
  
  // Fallback: try to match any tsx code block after "Usage"
  const fallbackMatch = content.match(/Usage\s*\n\s*```tsx\s*\n([\s\S]*?)\n\s*```/);
  return fallbackMatch ? fallbackMatch[1].trim() : '';
}

// Helper function to extract props from MDX content
export function extractPropsFromMDX(content: string): Array<{
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}> {
  // Find the props table section
  const propsSectionMatch = content.match(/## Props\s*\n([\s\S]*?)(?=## |$)/);
  if (!propsSectionMatch) return [];
  
  const propsSection = propsSectionMatch[1];
  const tableMatch = propsSection.match(/\|[\s\S]*?\|/g);
  if (!tableMatch) return [];
  
  const tableRows = tableMatch.filter(line => line.includes('|') && !line.includes('---'));
  const props: Array<{
    name: string;
    type: string;
    required: boolean;
    default?: string;
    description: string;
  }> = [];
  
  for (let i = 1; i < tableRows.length; i++) {
    const cells = tableRows[i].split('|').map(cell => cell.trim()).filter(cell => cell);
    if (cells.length >= 5) {
      props.push({
        name: cells[0],
        type: cells[1],
        required: cells[2] === '✅',
        default: cells[3] === '—' ? undefined : cells[3],
        description: cells[4],
      });
    }
  }
  
  return props;
}

// Helper function to extract examples from MDX content
export function extractExamplesFromMDX(content: string): Array<{
  title: string;
  code: string;
}> {
  const examples: Array<{ title: string; code: string }> = [];
  
  // Find the examples section
  const examplesSectionMatch = content.match(/## Examples\s*\n([\s\S]*?)(?=## |$)/);
  if (!examplesSectionMatch) return [];
  
  const examplesSection = examplesSectionMatch[1];
  
  // Match all code blocks with titles in the examples section
  const exampleMatches = examplesSection.match(/### (.*?)\s*\n\s*```tsx\s*\n([\s\S]*?)\n\s*```/g);
  
  if (exampleMatches) {
    exampleMatches.forEach(match => {
      const titleMatch = match.match(/### (.*?)\s*\n/);
      const codeMatch = match.match(/```tsx\s*\n([\s\S]*?)\n\s*```/);
      
      if (titleMatch && codeMatch) {
        examples.push({
          title: titleMatch[1],
          code: codeMatch[1].trim(),
        });
      }
    });
  }
  
  return examples;
}

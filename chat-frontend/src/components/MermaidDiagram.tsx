'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

// Initialize mermaid with config
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
  },
  sequence: {
    useMaxWidth: true,
  },
  themeVariables: {
    primaryColor: '#7c3aed',
    primaryTextColor: '#1f2937',
    primaryBorderColor: '#6d28d9',
    lineColor: '#6b7280',
    secondaryColor: '#f3e8ff',
    tertiaryColor: '#faf5ff',
  },
});

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!chart || !containerRef.current) return;

      try {
        // Generate unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // Render the diagram
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        setSvg(renderedSvg);
        setError(null);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError('Failed to render diagram');
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    // Fallback to showing the code if rendering fails
    return (
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 my-3 overflow-x-auto text-xs sm:text-sm">
        <code className="block font-mono whitespace-pre leading-relaxed">
          {chart}
        </code>
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-diagram my-4 overflow-x-auto bg-white rounded-lg p-4 border border-gray-200"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

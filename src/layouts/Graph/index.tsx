import { useEffect, useRef, type FC } from "react";
import cytoscape from "cytoscape";
// @ts-ignore
import cola from "cytoscape-cola";
// @ts-ignore
import fcose from "cytoscape-fcose";

cytoscape.use(cola);
cytoscape.use(fcose);

export const Graph: FC<{
  nodes: { id: string; name: string; parent?: string; kind: string }[];
  edges: { source: string; target: string; kind: string }[];
}> = ({ nodes, edges }) => {
  const ref = useRef<HTMLDivElement>(null);
  const cy = useRef<cytoscape.Core | null>(null);

  console.log({ nodes, edges });

  useEffect(() => {
    if (!ref.current) return;

    cy.current = cytoscape({
      container: ref.current,
      elements: [
        ...nodes.map((node) => ({
          data: { id: node.id, name: node.name, parent: node.parent },
          classes: [node.kind],
        })),
        ...edges.map((edge) => ({
          data: { source: edge.source, target: edge.target },
          classes: [edge.kind],
        })),
      ],
      style: [
        {
          selector: "node",
          style: {
            label: "data(name)",
            "text-halign": "center",
            "text-valign": "center",
          },
        },
        {
          selector: "edge",
          style: {
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },
        {
          selector: ".resource",
          style: { "background-color": "lime" },
        },
        {
          selector: ".machine",
          style: { shape: "rectangle", "background-color": "gold" },
        },
        {
          selector: ".input",
          style: { "line-color": "red", "target-arrow-color": "red" },
        },
        {
          selector: ".output",
          style: { "line-color": "blue", "target-arrow-color": "blue" },
        },
        {
          selector: ".costs",
          style: {
            "line-color": "red",
            "line-style": "dashed",
            "target-arrow-color": "red",
          },
        },
      ],
    });

    const _cy = cy.current;
    if (!_cy) return;

    /*
    _cy
      .nodes()
      .filter((n) => n.degree(false) === 0)
      .style("display", "none");*/
    _cy
      .layout({
        name: "fcose",
        animate: false,
        quality: "default",
        nodeSeparation: 300,
        numIter: 5000,
      } as any)
      .run();
    _cy
      .layout({
        name: "cola",
        animate: true,
        randomize: false,
        maxSimulationTime: 20000,
        avoidOverlap: true,
      } as any)
      .run();

    _cy.fit();

    return () => _cy.destroy();
  }, [nodes, edges]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (cy.current) {
        cy.current.resize();
        cy.current.fit();
      }
    });
    if (ref.current) resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, []);

  return <div ref={ref} />;
};

import { useEffect, useRef, type FC } from "react";
import cytoscape from "cytoscape";
// @ts-ignore
import cola from "cytoscape-cola";
// @ts-ignore
import fcose from "cytoscape-fcose";

import {
  resource_list,
  machine_list,
  normalized_recipe_list,
} from "../../lib/recipes";

cytoscape.use(cola);
cytoscape.use(fcose);

export const Graph: FC<{ recipes: number[] }> = ({ recipes }) => {
  const ref = useRef<HTMLDivElement>(null);
  const cy = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    cy.current = cytoscape({
      container: ref.current,

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

    for (const i of recipes) {
      const recipe = `recipe-${i}`;
      const r = normalized_recipe_list[i];

      _cy.add({
        data: { id: recipe, name: machine_list[r.machine].name },
        classes: ["machine"],
      });

      const key_guard = (key: string): key is keyof typeof resource_list => {
        return key in resource_list;
      };
      const addResource = (key: string) => {
        if (!_cy.hasElementWithId(key)) {
          if (key_guard(key))
            _cy.add({
              data: { id: key, name: resource_list[key].name },
              classes: ["resource"],
            });
        }
      };

      for (const src of Object.keys(r.input)) {
        addResource(src);
        _cy.add({ data: { source: src, target: recipe }, classes: ["input"] });
      }

      for (const dst of Object.keys(r.output)) {
        addResource(dst);
        _cy.add({ data: { source: recipe, target: dst }, classes: ["output"] });
      }

      for (const src of Object.keys(r.fixed_costs)) {
        if (src !== "Power") {
          addResource(src);
          _cy.add({
            data: { source: src, target: recipe },
            classes: ["costs"],
          });
        }
      }
    }

    _cy
      .nodes()
      .filter((n) => n.degree(false) === 0)
      .style("display", "none");
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
        maxSimulationTime: 2000,
        avoidOverlap: true,
      } as any)
      .run();

    _cy.fit();

    return () => _cy.destroy();
  }, [recipes]);

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

import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import { onUnmounted, type Ref, ref } from "vue";
import type { CategoryDef, GraphEdge, GraphNode } from "./types";

// Assign an initial x target per category so clusters form spatially
function categoryX(categoryId: string, width: number): number {
  const map: Record<string, number> = {
    parties: -0.3,
    workflow: -0.15,
    contract: 0.05,
    risk: 0.25,
    claims: 0.4,
  };
  return (map[categoryId] ?? 0) * width;
}

function categoryY(categoryId: string, height: number): number {
  const map: Record<string, number> = {
    parties: -0.2,
    workflow: 0.25,
    contract: -0.15,
    risk: 0.2,
    claims: -0.3,
  };
  return (map[categoryId] ?? 0) * height;
}

export function useForceSimulation(
  nodeData: GraphNode[],
  edgeData: GraphEdge[],
  _categories: CategoryDef[],
  width: Ref<number>,
  height: Ref<number>,
) {
  const nodes = ref<GraphNode[]>([...nodeData]);
  const edges = ref<GraphEdge[]>([...edgeData]);
  const isStable = ref(false);

  let simulation: Simulation<
    GraphNode & SimulationNodeDatum,
    SimulationLinkDatum<GraphNode & SimulationNodeDatum>
  > | null = null;

  function init() {
    stop();

    const w = width.value;
    const h = height.value;

    // Set initial positions based on category clustering
    nodes.value.forEach((n) => {
      n.x = w / 2 + categoryX(n.category, w) + (Math.random() - 0.5) * 60;
      n.y = h / 2 + categoryY(n.category, h) + (Math.random() - 0.5) * 60;
    });

    simulation = forceSimulation<GraphNode & SimulationNodeDatum>(
      nodes.value as (GraphNode & SimulationNodeDatum)[],
    )
      .force(
        "link",
        forceLink<
          GraphNode & SimulationNodeDatum,
          SimulationLinkDatum<GraphNode & SimulationNodeDatum>
        >(edges.value as SimulationLinkDatum<GraphNode & SimulationNodeDatum>[])
          .id((d: GraphNode & SimulationNodeDatum) => d.id)
          .distance(180)
          .strength(0.3),
      )
      .force("charge", forceManyBody().strength(-800))
      .force("center", forceCenter(w / 2, h / 2).strength(0.05))
      .force("collide", forceCollide<GraphNode & SimulationNodeDatum>().radius(70))
      .force(
        "x",
        forceX<GraphNode & SimulationNodeDatum>(
          (d: GraphNode & SimulationNodeDatum) => w / 2 + categoryX(d.category, w),
        ).strength(0.08),
      )
      .force(
        "y",
        forceY<GraphNode & SimulationNodeDatum>(
          (d: GraphNode & SimulationNodeDatum) => h / 2 + categoryY(d.category, h),
        ).strength(0.08),
      )
      .alphaDecay(0.02)
      .on("tick", () => {
        // Trigger Vue reactivity
        nodes.value = [...nodes.value];
        edges.value = [...edges.value];
      })
      .on("end", () => {
        isStable.value = true;
      });
  }

  function reheat() {
    if (simulation) {
      isStable.value = false;
      simulation.alpha(0.3).restart();
    }
  }

  function stop() {
    if (simulation) {
      simulation.stop();
      simulation = null;
    }
  }

  function dragStart(node: GraphNode) {
    if (simulation) {
      simulation.alphaTarget(0.1).restart();
    }
    node.fx = node.x;
    node.fy = node.y;
  }

  function dragged(node: GraphNode, x: number, y: number) {
    node.fx = x;
    node.fy = y;
  }

  function dragEnd(node: GraphNode) {
    if (simulation) {
      simulation.alphaTarget(0);
    }
    node.fx = null;
    node.fy = null;
  }

  onUnmounted(() => stop());

  return { nodes, edges, isStable, init, reheat, stop, dragStart, dragged, dragEnd };
}

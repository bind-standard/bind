<script setup lang="ts">
import { useData, useRouter } from "vitepress";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { categories, edges as rawEdges, nodes as rawNodes } from "./concept-explorer/graph-data";
import type { GraphEdge, GraphNode } from "./concept-explorer/types";
import { useForceSimulation } from "./concept-explorer/use-force-simulation";
import { useZoom } from "./concept-explorer/use-zoom";

const { isDark } = useData();
const router = useRouter();

// Container / sizing
const containerRef = ref<HTMLDivElement | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);
const width = ref(800);
const height = ref(500);

// Category filter
const activeCategories = ref<Set<string>>(new Set(categories.map((c) => c.id)));

function toggleCategory(id: string) {
  const next = new Set(activeCategories.value);
  if (next.has(id)) {
    if (next.size > 1) next.delete(id);
  } else {
    next.add(id);
  }
  activeCategories.value = next;
}

// Filter nodes/edges by active categories
const filteredNodes = computed(() =>
  rawNodes.filter((n) => activeCategories.value.has(n.category)),
);
const filteredEdges = computed(() => {
  const activeIds = new Set(filteredNodes.value.map((n) => n.id));
  return rawEdges.filter((e) => {
    const src = typeof e.source === "string" ? e.source : e.source.id;
    const tgt = typeof e.target === "string" ? e.target : e.target.id;
    return activeIds.has(src) && activeIds.has(tgt);
  });
});

// Force simulation
const {
  nodes,
  edges,
  init: initSim,
  dragStart,
  dragged,
  dragEnd,
} = useForceSimulation(filteredNodes.value, filteredEdges.value, categories, width, height);

// Re-init simulation when category filter changes
watch(
  () => [...activeCategories.value],
  () => {
    const activeIds = new Set(filteredNodes.value.map((n) => n.id));
    // Copy positions from current nodes to new filtered set
    const posMap = new Map<string, { x: number; y: number }>();
    nodes.value.forEach((n) => {
      if (n.x != null && n.y != null) posMap.set(n.id, { x: n.x, y: n.y });
    });

    const newNodes = rawNodes
      .filter((n) => activeIds.has(n.id))
      .map((n) => {
        const pos = posMap.get(n.id);
        return { ...n, x: pos?.x, y: pos?.y };
      });
    const newEdges = rawEdges.filter((e) => {
      const src = typeof e.source === "string" ? e.source : e.source.id;
      const tgt = typeof e.target === "string" ? e.target : e.target.id;
      return activeIds.has(src) && activeIds.has(tgt);
    });

    nodes.value = newNodes;
    edges.value = newEdges.map((e) => ({ ...e }));
    nextTick(() => initSim());
  },
);

// Zoom
const { transform, init: initZoom, zoomIn, zoomOut, resetZoom } = useZoom(svgRef);

// Hover state
const hoveredNode = ref<GraphNode | null>(null);
const hoveredEdge = ref<GraphEdge | null>(null);
const tooltipX = ref(0);
const tooltipY = ref(0);

function onNodeEnter(node: GraphNode, event: MouseEvent) {
  hoveredNode.value = node;
  hoveredEdge.value = null;
  tooltipX.value = event.clientX;
  tooltipY.value = event.clientY;
}

function onNodeLeave() {
  hoveredNode.value = null;
}

function onEdgeEnter(edge: GraphEdge, event: MouseEvent) {
  hoveredEdge.value = edge;
  hoveredNode.value = null;
  tooltipX.value = event.clientX;
  tooltipY.value = event.clientY;
}

function onEdgeLeave() {
  hoveredEdge.value = null;
}

function onNodeMove(event: MouseEvent) {
  tooltipX.value = event.clientX;
  tooltipY.value = event.clientY;
}

// Is a node or its edges highlighted?
function isNodeHighlighted(nodeId: string): boolean {
  if (!hoveredNode.value && !hoveredEdge.value) return false;
  if (hoveredNode.value) return hoveredNode.value.id === nodeId;
  if (hoveredEdge.value) {
    const src =
      typeof hoveredEdge.value.source === "string"
        ? hoveredEdge.value.source
        : hoveredEdge.value.source.id;
    const tgt =
      typeof hoveredEdge.value.target === "string"
        ? hoveredEdge.value.target
        : hoveredEdge.value.target.id;
    return src === nodeId || tgt === nodeId;
  }
  return false;
}

function isEdgeHighlighted(edge: GraphEdge): boolean {
  if (!hoveredNode.value && !hoveredEdge.value) return false;
  const src = typeof edge.source === "string" ? edge.source : edge.source.id;
  const tgt = typeof edge.target === "string" ? edge.target : edge.target.id;
  if (hoveredNode.value) return src === hoveredNode.value.id || tgt === hoveredNode.value.id;
  if (hoveredEdge.value) return edge === hoveredEdge.value;
  return false;
}

function isNodeDimmed(nodeId: string): boolean {
  if (!hoveredNode.value && !hoveredEdge.value) return false;
  return !isNodeHighlighted(nodeId);
}

function isEdgeDimmed(edge: GraphEdge): boolean {
  if (!hoveredNode.value && !hoveredEdge.value) return false;
  return !isEdgeHighlighted(edge);
}

// Category color helpers
function nodeColor(node: GraphNode): string {
  const cat = categories.find((c) => c.id === node.category);
  if (!cat) return "#888";
  return isDark.value ? cat.color.dark : cat.color.light;
}

function nodeBgColor(node: GraphNode): string {
  const cat = categories.find((c) => c.id === node.category);
  if (!cat) return "#eee";
  return isDark.value ? cat.bgColor.dark : cat.bgColor.light;
}

// Edge coordinate helpers
function edgeX1(edge: GraphEdge): number {
  return typeof edge.source === "string" ? 0 : (edge.source.x ?? 0);
}
function edgeY1(edge: GraphEdge): number {
  return typeof edge.source === "string" ? 0 : (edge.source.y ?? 0);
}
function edgeX2(edge: GraphEdge): number {
  return typeof edge.target === "string" ? 0 : (edge.target.x ?? 0);
}
function edgeY2(edge: GraphEdge): number {
  return typeof edge.target === "string" ? 0 : (edge.target.y ?? 0);
}

// Self-referencing edge (e.g. Organization→Organization)
function isSelfEdge(edge: GraphEdge): boolean {
  const src = typeof edge.source === "string" ? edge.source : edge.source.id;
  const tgt = typeof edge.target === "string" ? edge.target : edge.target.id;
  return src === tgt;
}

function selfEdgePath(edge: GraphEdge): string {
  const x = edgeX1(edge);
  const y = edgeY1(edge);
  const r = 40;
  return `M ${x + 36} ${y - 12} C ${x + 36 + r} ${y - 12 - r}, ${x + 36 + r} ${y + 12 + r}, ${x + 36} ${y + 12}`;
}

// Arrowhead offset — stop arrow before node circle boundary
function arrowEdgeX2(edge: GraphEdge): number {
  if (isSelfEdge(edge)) return edgeX2(edge);
  const x1 = edgeX1(edge);
  const y1 = edgeY1(edge);
  const x2 = edgeX2(edge);
  const y2 = edgeY2(edge);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return x2;
  return x2 - (dx / dist) * 40;
}

function arrowEdgeY2(edge: GraphEdge): number {
  if (isSelfEdge(edge)) return edgeY2(edge);
  const x1 = edgeX1(edge);
  const y1 = edgeY1(edge);
  const x2 = edgeX2(edge);
  const y2 = edgeY2(edge);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return y2;
  return y2 - (dy / dist) * 40;
}

// Click → navigate to resource detail
function onNodeClick(node: GraphNode) {
  router.go(`/resources/${node.id}`);
}

// Drag handling with pointer events
let dragTarget: GraphNode | null = null;

function onPointerDown(node: GraphNode, event: PointerEvent) {
  // Only left button
  if (event.button !== 0) return;
  dragTarget = node;
  dragStart(node);
  (event.currentTarget as Element).setPointerCapture(event.pointerId);
  event.preventDefault();
  event.stopPropagation();
}

function onPointerMove(event: PointerEvent) {
  if (!dragTarget || !svgRef.value) return;
  // Convert screen coords to SVG coords accounting for zoom
  const pt = svgRef.value.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  const ctm = svgRef.value.getScreenCTM();
  if (ctm) {
    const svgPt = pt.matrixTransform(ctm.inverse());
    // Undo the zoom transform
    const x = (svgPt.x - transform.value.x) / transform.value.k;
    const y = (svgPt.y - transform.value.y) / transform.value.k;
    dragged(dragTarget, x, y);
  }
  event.preventDefault();
}

function onPointerUp() {
  if (dragTarget) {
    dragEnd(dragTarget);
    dragTarget = null;
  }
}

// Keyboard navigation
const focusedNodeIndex = ref(-1);

function onKeyDown(event: KeyboardEvent) {
  const len = nodes.value.length;
  if (len === 0) return;

  if (event.key === "Tab") {
    event.preventDefault();
    if (event.shiftKey) {
      focusedNodeIndex.value = focusedNodeIndex.value <= 0 ? len - 1 : focusedNodeIndex.value - 1;
    } else {
      focusedNodeIndex.value = focusedNodeIndex.value >= len - 1 ? 0 : focusedNodeIndex.value + 1;
    }
    hoveredNode.value = nodes.value[focusedNodeIndex.value];
    hoveredEdge.value = null;
  } else if (event.key === "Enter" && focusedNodeIndex.value >= 0) {
    onNodeClick(nodes.value[focusedNodeIndex.value]);
  } else if (event.key === "Escape") {
    focusedNodeIndex.value = -1;
    hoveredNode.value = null;
    hoveredEdge.value = null;
  }
}

// ResizeObserver
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect();
    width.value = rect.width;
    height.value = Math.max(500, Math.min(rect.width * 0.7, 800));

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        width.value = w;
        height.value = Math.max(500, Math.min(w * 0.7, 800));
      }
    });
    resizeObserver.observe(containerRef.value);
  }

  nextTick(() => {
    initSim();
    initZoom();
  });
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <div class="concept-explorer" ref="containerRef">
    <ConceptExplorerControls
      :categories="categories"
      :activeCategories="activeCategories"
      :isDark="isDark"
      @toggleCategory="toggleCategory"
      @zoomIn="zoomIn"
      @zoomOut="zoomOut"
      @resetZoom="resetZoom"
    />

    <div class="graph-container">
      <svg
        ref="svgRef"
        :width="width"
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        class="graph-svg"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @keydown="onKeyDown"
        tabindex="0"
        role="img"
        aria-label="Interactive graph showing relationships between BIND Standard resources"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6" fill="var(--vp-c-text-3)" />
          </marker>
          <marker
            id="arrowhead-highlight"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6" fill="var(--vp-c-text-1)" />
          </marker>
        </defs>

        <g :transform="`translate(${transform.x},${transform.y}) scale(${transform.k})`">
          <!-- Edges -->
          <g class="edges-layer">
            <template v-for="(edge, i) in edges" :key="'e' + i">
              <!-- Self-referencing edge -->
              <path
                v-if="isSelfEdge(edge)"
                :d="selfEdgePath(edge)"
                fill="none"
                class="graph-edge"
                :class="{
                  'edge-highlighted': isEdgeHighlighted(edge),
                  'edge-dimmed': isEdgeDimmed(edge),
                  'edge-array': edge.isArray,
                }"
                :marker-end="isEdgeHighlighted(edge) ? 'url(#arrowhead-highlight)' : 'url(#arrowhead)'"
                @mouseenter="onEdgeEnter(edge, $event)"
                @mouseleave="onEdgeLeave"
              />
              <!-- Normal edge -->
              <line
                v-else
                :x1="edgeX1(edge)"
                :y1="edgeY1(edge)"
                :x2="arrowEdgeX2(edge)"
                :y2="arrowEdgeY2(edge)"
                class="graph-edge"
                :class="{
                  'edge-highlighted': isEdgeHighlighted(edge),
                  'edge-dimmed': isEdgeDimmed(edge),
                  'edge-array': edge.isArray,
                }"
                :marker-end="isEdgeHighlighted(edge) ? 'url(#arrowhead-highlight)' : 'url(#arrowhead)'"
                @mouseenter="onEdgeEnter(edge, $event)"
                @mouseleave="onEdgeLeave"
              />
            </template>

            <!-- Edge labels (only on hover) -->
            <template v-for="(edge, i) in edges" :key="'el' + i">
              <text
                v-if="isEdgeHighlighted(edge) && !isSelfEdge(edge)"
                :x="(edgeX1(edge) + edgeX2(edge)) / 2"
                :y="(edgeY1(edge) + edgeY2(edge)) / 2 - 6"
                class="edge-label"
                text-anchor="middle"
              >
                {{ edge.label }}
              </text>
            </template>
          </g>

          <!-- Nodes -->
          <g class="nodes-layer">
            <g
              v-for="(node, i) in nodes"
              :key="node.id"
              class="graph-node"
              :class="{
                'node-highlighted': isNodeHighlighted(node.id),
                'node-dimmed': isNodeDimmed(node.id),
                'node-focused': focusedNodeIndex === i,
              }"
              :transform="`translate(${node.x ?? 0},${node.y ?? 0})`"
              @mouseenter="onNodeEnter(node, $event)"
              @mouseleave="onNodeLeave"
              @mousemove="onNodeMove"
              @pointerdown="onPointerDown(node, $event)"
              @click.prevent="onNodeClick(node)"
              style="cursor: pointer"
              role="button"
              :aria-label="node.label + ' — ' + node.description"
              :tabindex="i + 1"
            >
              <!-- Background circle -->
              <circle
                r="36"
                :fill="nodeBgColor(node)"
                :stroke="nodeColor(node)"
                stroke-width="2.5"
                class="node-circle"
              />
              <!-- Abbreviation text -->
              <text
                dy="1"
                text-anchor="middle"
                dominant-baseline="central"
                class="node-abbrev"
                :fill="nodeColor(node)"
              >
                {{ node.abbrev }}
              </text>
              <!-- Label below -->
              <text
                dy="54"
                text-anchor="middle"
                class="node-label"
              >
                {{ node.label }}
              </text>
            </g>
          </g>
        </g>
      </svg>

      <!-- Hint text -->
      <div class="graph-hint">
        Click a node to view details. Drag to rearrange. Scroll to zoom.
      </div>
    </div>

    <ConceptExplorerTooltip
      :node="hoveredNode"
      :edge="hoveredEdge"
      :categories="categories"
      :edges="edges"
      :x="tooltipX"
      :y="tooltipY"
      :isDark="isDark"
    />
  </div>
</template>

<style scoped>
.concept-explorer {
  margin: 24px 0;
  width: 100%;
}

.graph-container {
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.graph-svg {
  display: block;
  outline: none;
}

.graph-svg:focus-visible {
  box-shadow: 0 0 0 2px var(--vp-c-brand-1);
}

/* Edges */
.graph-edge {
  stroke: var(--vp-c-divider);
  stroke-width: 1.5;
  transition: stroke 0.15s ease, opacity 0.15s ease;
}

.graph-edge.edge-array {
  stroke-width: 2.5;
}

.graph-edge.edge-highlighted {
  stroke: var(--vp-c-text-2);
  stroke-width: 2;
}

.graph-edge.edge-highlighted.edge-array {
  stroke-width: 3;
}

.graph-edge.edge-dimmed {
  opacity: 0.15;
}

.edge-label {
  font-size: 12px;
  fill: var(--vp-c-text-2);
  pointer-events: none;
  font-family: var(--vp-font-family-mono);
}

/* Nodes */
.graph-node {
  transition: opacity 0.15s ease;
}

.graph-node .node-circle {
  transition: transform 0.15s ease, stroke-width 0.15s ease;
}

.graph-node:hover .node-circle,
.graph-node.node-highlighted .node-circle,
.graph-node.node-focused .node-circle {
  stroke-width: 3.5;
  transform: scale(1.1);
}

.graph-node.node-dimmed {
  opacity: 0.3;
}

.node-abbrev {
  font-size: 18px;
  font-weight: 700;
  font-family: var(--vp-font-family-mono);
  pointer-events: none;
  user-select: none;
}

.node-label {
  font-size: 14px;
  font-weight: 500;
  fill: var(--vp-c-text-1);
  pointer-events: none;
  user-select: none;
}

.graph-hint {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: var(--vp-c-text-3);
  pointer-events: none;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .graph-hint {
    font-size: 11px;
  }
}
</style>

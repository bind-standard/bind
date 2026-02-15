<script setup lang="ts">
import type { CategoryDef, GraphEdge, GraphNode } from "./concept-explorer/types";

const props = defineProps<{
  node: GraphNode | null;
  edge: GraphEdge | null;
  categories: CategoryDef[];
  edges: GraphEdge[];
  x: number;
  y: number;
  isDark: boolean;
}>();

function categoryFor(id: string): CategoryDef | undefined {
  return props.categories.find((c) => c.id === id);
}

function connectionCount(nodeId: string): number {
  return props.edges.filter((e) => {
    const src = typeof e.source === "string" ? e.source : e.source.id;
    const tgt = typeof e.target === "string" ? e.target : e.target.id;
    return src === nodeId || tgt === nodeId;
  }).length;
}

function nodeColor(node: GraphNode): string {
  const cat = categoryFor(node.category);
  if (!cat) return "#888";
  return props.isDark ? cat.color.dark : cat.color.light;
}
</script>

<template>
  <div
    v-if="node || edge"
    class="explorer-tooltip"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    <template v-if="node">
      <div class="tooltip-header">
        <span class="tooltip-dot" :style="{ background: nodeColor(node) }"></span>
        <strong>{{ node.label }}</strong>
      </div>
      <p class="tooltip-desc">{{ node.description }}</p>
      <div class="tooltip-meta">
        {{ connectionCount(node.id) }} connections
      </div>
    </template>
    <template v-else-if="edge">
      <div class="tooltip-header">
        <strong>{{ typeof edge.source === "string" ? edge.source : edge.source.label }}</strong>
        <span class="tooltip-arrow">&rarr;</span>
        <strong>{{ typeof edge.target === "string" ? edge.target : edge.target.label }}</strong>
      </div>
      <p class="tooltip-desc">{{ edge.label }}</p>
      <div v-if="edge.isArray" class="tooltip-meta">array reference</div>
    </template>
  </div>
</template>

<style scoped>
.explorer-tooltip {
  position: fixed;
  z-index: 100;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 16px;
  max-width: 280px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  pointer-events: none;
  font-size: 13px;
  line-height: 1.5;
  transform: translate(-50%, calc(-100% - 12px));
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.tooltip-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tooltip-arrow {
  color: var(--vp-c-text-3);
  font-size: 14px;
}

.tooltip-desc {
  color: var(--vp-c-text-2);
  margin: 0 0 4px 0;
}

.tooltip-meta {
  color: var(--vp-c-text-3);
  font-size: 12px;
}
</style>

<script setup lang="ts">
import type { CategoryDef } from "./concept-explorer/types";

defineProps<{
  categories: CategoryDef[];
  activeCategories: Set<string>;
  isDark: boolean;
}>();

const emit = defineEmits<{
  toggleCategory: [id: string];
  zoomIn: [];
  zoomOut: [];
  resetZoom: [];
}>();

function catColor(cat: CategoryDef, isDark: boolean): string {
  return isDark ? cat.color.dark : cat.color.light;
}
</script>

<template>
  <div class="explorer-controls">
    <div class="control-group">
      <span class="control-label">Categories</span>
      <div class="category-toggles">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="category-btn"
          :class="{ active: activeCategories.has(cat.id) }"
          :style="{
            '--cat-color': catColor(cat, isDark),
            borderColor: activeCategories.has(cat.id) ? catColor(cat, isDark) : 'var(--vp-c-divider)',
          }"
          @click="emit('toggleCategory', cat.id)"
          :aria-pressed="activeCategories.has(cat.id)"
          :aria-label="'Toggle ' + cat.label"
        >
          <span
            class="cat-dot"
            :style="{ background: activeCategories.has(cat.id) ? catColor(cat, isDark) : 'var(--vp-c-text-3)' }"
          ></span>
          {{ cat.label }}
        </button>
      </div>
    </div>
    <div class="control-group zoom-controls">
      <button class="zoom-btn" @click="emit('zoomIn')" aria-label="Zoom in" title="Zoom in">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
      <button class="zoom-btn" @click="emit('zoomOut')" aria-label="Zoom out" title="Zoom out">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
      <button class="zoom-btn" @click="emit('resetZoom')" aria-label="Reset zoom" title="Reset zoom">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="3" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.explorer-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.category-toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.category-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.category-btn:hover {
  background: var(--vp-c-bg-soft);
}

.category-btn.active {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.cat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: background 0.15s ease;
}

.zoom-controls {
  gap: 4px;
}

.zoom-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s ease;
}

.zoom-btn:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

@media (max-width: 640px) {
  .explorer-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  .zoom-controls {
    align-self: flex-end;
  }
}
</style>

<script setup lang="ts">
import { ref, computed } from "vue";

interface TreeNode {
  name: string;
  card: string;
  type: string;
  typeUrl?: string;
  description: string;
  children?: TreeNode[];
  required?: boolean;
  isArray?: boolean;
}

const props = defineProps<{
  data: TreeNode[];
  rootName?: string;
  rootDescription?: string;
}>();

// Track collapsed state by path
const collapsed = ref<Set<string>>(new Set());

function toggleCollapse(path: string) {
  if (collapsed.value.has(path)) {
    collapsed.value.delete(path);
  } else {
    collapsed.value.add(path);
  }
  // Trigger reactivity
  collapsed.value = new Set(collapsed.value);
}

function isCollapsed(path: string): boolean {
  return collapsed.value.has(path);
}

// Flatten tree into visible rows
interface FlatRow {
  node: TreeNode;
  depth: number;
  path: string;
  hasChildren: boolean;
  isLast: boolean;
  parentIsLast: boolean[];
}

function flattenTree(
  nodes: TreeNode[],
  depth: number,
  parentPath: string,
  parentIsLast: boolean[]
): FlatRow[] {
  const rows: FlatRow[] = [];
  nodes.forEach((node, i) => {
    const isLast = i === nodes.length - 1;
    const path = parentPath ? `${parentPath}.${node.name}` : node.name;
    const hasChildren = !!(node.children && node.children.length > 0);
    rows.push({ node, depth, path, hasChildren, isLast, parentIsLast: [...parentIsLast] });
    if (hasChildren && !isCollapsed(path)) {
      rows.push(...flattenTree(node.children!, depth + 1, path, [...parentIsLast, isLast]));
    }
  });
  return rows;
}

const flatRows = computed(() => flattenTree(props.data, 0, "", []));
</script>

<template>
  <div class="structure-tree">
    <table>
      <thead>
        <tr>
          <th class="col-name">Name</th>
          <th class="col-card">Card.</th>
          <th class="col-type">Type</th>
          <th class="col-desc">Description</th>
        </tr>
      </thead>
      <tbody>
        <!-- Root row -->
        <tr v-if="rootName" class="row-root">
          <td class="col-name">
            <span class="tree-icon icon-resource">R</span>
            <strong>{{ rootName }}</strong>
          </td>
          <td class="col-card"></td>
          <td class="col-type"></td>
          <td class="col-desc root-desc">{{ rootDescription }}</td>
        </tr>
        <!-- Data rows -->
        <tr
          v-for="row in flatRows"
          :key="row.path"
          :class="{
            'row-required': row.node.required,
            'row-expandable': row.hasChildren,
          }"
        >
          <td class="col-name">
            <span class="tree-indent" :style="{ width: (row.depth + (rootName ? 1 : 0)) * 20 + 'px' }">
              <!-- Tree guide lines -->
              <span
                v-for="(pIsLast, lvl) in row.parentIsLast"
                :key="lvl"
                class="tree-guide"
                :class="{ 'guide-blank': pIsLast }"
              ></span>
              <span class="tree-connector" :class="{ 'connector-last': row.isLast }"></span>
            </span>
            <span
              v-if="row.hasChildren"
              class="tree-toggle"
              @click="toggleCollapse(row.path)"
              :title="isCollapsed(row.path) ? 'Expand' : 'Collapse'"
            >
              <svg v-if="isCollapsed(row.path)" width="10" height="10" viewBox="0 0 10 10"><path d="M3 1 L8 5 L3 9" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
              <svg v-else width="10" height="10" viewBox="0 0 10 10"><path d="M1 3 L5 8 L9 3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
            </span>
            <span v-else class="tree-leaf"></span>
            <span
              class="tree-icon"
              :class="{
                'icon-object': row.hasChildren,
                'icon-array': row.node.isArray,
                'icon-primitive': !row.hasChildren && !row.node.isArray,
              }"
            >
              <template v-if="row.hasChildren">&#9662;</template>
              <template v-else-if="row.node.isArray">[ ]</template>
              <template v-else>&#9679;</template>
            </span>
            <span class="prop-name" :class="{ 'prop-required': row.node.required }">
              {{ row.node.name }}
            </span>
          </td>
          <td class="col-card">
            <span class="card-badge" :class="{ 'card-required': row.node.required }">
              {{ row.node.card }}
            </span>
          </td>
          <td class="col-type">
            <a v-if="row.node.typeUrl" :href="row.node.typeUrl" class="type-link">{{ row.node.type }}</a>
            <code v-else-if="row.node.type.includes('|')" class="type-enum" v-html="row.node.type"></code>
            <code v-else class="type-code">{{ row.node.type }}</code>
          </td>
          <td class="col-desc">{{ row.node.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.structure-tree {
  overflow-x: auto;
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  line-height: 1.5;
}

thead {
  background: var(--vp-c-bg-soft);
  position: sticky;
  top: 0;
  z-index: 1;
}

th {
  text-align: left;
  padding: 10px 12px;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--vp-c-text-2);
  border-bottom: 2px solid var(--vp-c-divider);
}

td {
  padding: 6px 12px;
  border-bottom: 1px solid var(--vp-c-divider-light);
  vertical-align: top;
}

tr:last-child td {
  border-bottom: none;
}

/* Column widths */
.col-name { min-width: 200px; white-space: nowrap; }
.col-card { width: 70px; text-align: center; white-space: nowrap; }
.col-type { min-width: 140px; white-space: nowrap; }
.col-desc { min-width: 200px; color: var(--vp-c-text-2); }
.root-desc { font-style: italic; }

/* Row states */
tr:hover td {
  background: var(--vp-c-bg-soft);
}
.row-root td {
  background: var(--vp-c-bg-soft);
  padding: 10px 12px;
}

/* Tree structure */
.tree-indent {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.tree-guide {
  display: inline-block;
  width: 20px;
  height: 100%;
  border-left: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}
.tree-guide.guide-blank {
  border-left: none;
}

.tree-connector {
  display: inline-block;
  width: 12px;
  height: 1px;
  background: var(--vp-c-divider);
  vertical-align: middle;
  flex-shrink: 0;
  margin-right: 2px;
}

/* Toggle button */
.tree-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: var(--vp-c-text-3);
  border-radius: 3px;
  flex-shrink: 0;
  margin-right: 2px;
}
.tree-toggle:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.tree-leaf {
  display: inline-block;
  width: 16px;
  flex-shrink: 0;
  margin-right: 2px;
}

/* Type icons */
.tree-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  font-size: 8px;
  border-radius: 3px;
  margin-right: 6px;
  flex-shrink: 0;
  font-weight: 700;
}
.icon-resource {
  background: var(--vp-c-brand-1);
  color: white;
  font-size: 10px;
  border-radius: 4px;
  margin-right: 8px;
}
.icon-object {
  color: #e8912d;
  font-size: 10px;
}
.icon-array {
  color: #2d8fe8;
  font-size: 9px;
  font-family: monospace;
}
.icon-primitive {
  color: var(--vp-c-text-3);
  font-size: 6px;
}

/* Property names */
.prop-name {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  color: var(--vp-c-text-1);
}
.prop-required {
  font-weight: 600;
}

/* Cardinality badge */
.card-badge {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-2);
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
}
.card-required {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

/* Types */
.type-link {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.type-link:hover {
  text-decoration: underline;
}
.type-code {
  font-size: 12px;
  padding: 1px 5px;
  background: var(--vp-c-bg-soft);
  border-radius: 3px;
  color: var(--vp-c-text-1);
}
.type-enum {
  font-size: 12px;
  padding: 1px 5px;
  background: var(--vp-c-bg-soft);
  border-radius: 3px;
  color: var(--vp-c-text-2);
  white-space: normal;
}
</style>

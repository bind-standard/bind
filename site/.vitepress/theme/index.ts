import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import ConceptExplorer from "./ConceptExplorer.vue";
import Footer from "./Footer.vue";
import StructureTree from "./StructureTree.vue";

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "doc-after": () => h(Footer),
      "layout-bottom": () => h(Footer),
    });
  },
  enhanceApp({ app }) {
    app.component("StructureTree", StructureTree);
    app.component("ConceptExplorer", ConceptExplorer);
  },
};

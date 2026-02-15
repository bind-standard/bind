import DefaultTheme from "vitepress/theme";
import StructureTree from "./StructureTree.vue";
import ConceptExplorer from "./ConceptExplorer.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("StructureTree", StructureTree);
    app.component("ConceptExplorer", ConceptExplorer);
  },
};

import DefaultTheme from "vitepress/theme";
import ConceptExplorer from "./ConceptExplorer.vue";
import StructureTree from "./StructureTree.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("StructureTree", StructureTree);
    app.component("ConceptExplorer", ConceptExplorer);
  },
};

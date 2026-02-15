import DefaultTheme from "vitepress/theme";
import StructureTree from "./StructureTree.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("StructureTree", StructureTree);
  },
};

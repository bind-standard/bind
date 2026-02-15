import { ref, type Ref, onUnmounted } from "vue";
import { zoom, zoomIdentity, type ZoomBehavior } from "d3-zoom";
import { select } from "d3-selection";

export function useZoom(svgRef: Ref<SVGSVGElement | null>) {
  const transform = ref({ x: 0, y: 0, k: 1 });
  let zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> | null = null;

  function init() {
    if (!svgRef.value) return;

    zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        transform.value = {
          x: event.transform.x,
          y: event.transform.y,
          k: event.transform.k,
        };
      });

    select(svgRef.value).call(zoomBehavior);
  }

  function zoomIn() {
    if (!svgRef.value || !zoomBehavior) return;
    select(svgRef.value)
      .transition()
      .duration(300)
      .call(zoomBehavior.scaleBy, 1.3);
  }

  function zoomOut() {
    if (!svgRef.value || !zoomBehavior) return;
    select(svgRef.value)
      .transition()
      .duration(300)
      .call(zoomBehavior.scaleBy, 0.7);
  }

  function resetZoom() {
    if (!svgRef.value || !zoomBehavior) return;
    select(svgRef.value)
      .transition()
      .duration(400)
      .call(zoomBehavior.transform, zoomIdentity);
  }

  function destroy() {
    if (svgRef.value) {
      select(svgRef.value).on(".zoom", null);
    }
    zoomBehavior = null;
  }

  onUnmounted(() => destroy());

  return { transform, init, zoomIn, zoomOut, resetZoom, destroy };
}

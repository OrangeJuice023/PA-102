import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { SECOND_BRAIN_SLUG } from "./topics"
import style from "./styles/second-brain.scss"

// Large whole-site graph on the Second Brain page. Rendering is done by
// Quartz's graph script (it draws into every .graph-container), so the Graph
// component must stay in the layout. Node colors by type are set in
// quartz/components/scripts/graph.inline.ts (search "PA 102 change").
const graphConfig = {
  drag: true,
  zoom: true,
  depth: -1,
  scale: 1,
  repelForce: 1.2,
  centerForce: 0.3,
  linkDistance: 70,
  fontSize: 0.8,
  opacityScale: 4,
  showTags: false,
  removeTags: [],
  focusOnHover: true,
  enableRadial: true,
}

const SecondBrainGraph: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (fileData.slug !== SECOND_BRAIN_SLUG) return null
  return (
    <section class="second-brain-map" aria-label="Map of topic and concept notes">
      <div class="graph-container second-brain-graph" data-cfg={JSON.stringify(graphConfig)}></div>
      <ul class="graph-legend">
        <li>
          <span class="legend-dot topic" aria-hidden="true"></span>Topic notes
        </li>
        <li>
          <span class="legend-dot concept" aria-hidden="true"></span>Concept notes
        </li>
        <li>
          <span class="legend-dot oct3" aria-hidden="true"></span>OCT 3 - RAW NOTES
        </li>
      </ul>
      <p class="graph-hint">
        Drag to move, scroll or pinch to zoom, hover to highlight connections, click a dot to
        open the note.
      </p>
    </section>
  )
}

SecondBrainGraph.css = style

export default (() => SecondBrainGraph) satisfies QuartzComponentConstructor

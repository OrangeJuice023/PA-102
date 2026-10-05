import { QuartzComponent, QuartzComponentConstructor } from "../types"

// Replaces Quartz's "Created with Quartz" footer: the site has no footer.
const NoFooter: QuartzComponent = () => null

export default (() => NoFooter) satisfies QuartzComponentConstructor

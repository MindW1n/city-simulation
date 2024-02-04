import Graph from "./math/graph"
import Link from "./primitives/link"
import Point from "./primitives/point"
import Viewport from "./viewport"
interface GraphEditorProps {
	canvas: HTMLCanvasElement
	context: CanvasRenderingContext2D
	graph: Graph
	fps: number
}
export default class GraphEditor {
	canvas: HTMLCanvasElement
	context: CanvasRenderingContext2D
	viewport: Viewport
	graph: Graph
	fps: number
	selected: Point | undefined
	hovered: Point | undefined
	mouse: Point | undefined
	dragging: boolean
	#mainCycle: number | undefined
	constructor(props: GraphEditorProps) {
		this.canvas = props.canvas
		this.context = props.context
		this.graph = props.graph
		this.fps = props.fps
		this.dragging = false
		this.viewport = new Viewport(this.canvas, this.context)
		this.viewport.run()
	}
	run() {
		if(this.#mainCycle) throw new Error("Graph editor is already running")
		this.canvas.addEventListener("mousedown", this.#mousedownListener.bind(this))
		document.addEventListener("keydown", this.#keydownListener.bind(this))
		this.canvas.addEventListener("mousemove", this.#mousemoveListener.bind(this))
		this.canvas.addEventListener("contextmenu", event => event.preventDefault())
		this.canvas.addEventListener("mouseup", () => this.dragging = false)
		this.#mainCycle = setInterval(() => this.#refresh(), 1000 / this.fps) as unknown as number
	}
	#refresh() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.context.save()
		this.context.scale(1 / this.viewport.zoom, 1 / this.viewport.zoom)
		this.graph.draw(this.context)
		if(this.selected) {
			const next = this.hovered ? this.hovered : this.mouse
			new Link(this.selected, next as Point).draw({context: this.context, dash: [20, 8]})
			this.selected.draw({context: this.context, color: "red", radius: 11})
		}
		if(this.hovered) this.hovered.draw({context: this.context, color: "yellow", radius: 6})
		else this.mouse?.draw({context: this.context})
		this.context.restore()
	}
	#mousedownListener(event: MouseEvent) {
		if(event.button == 2) {
			if(this.selected) {this.selected = undefined; return}
			if(this.hovered) {this.graph.remove(this.hovered); this.hovered = undefined; return}
		}
		if(event.button == 0) {
			this.dragging = true
			this.mouse = this.viewport.getMouse(event)
			const existing = this.graph.find(this.mouse)
			if(existing) {this.#select(existing as Point); return}
			try {this.graph.add(this.mouse)}
			catch(e) {return}
			this.#select(this.mouse)
		}
	}
	#select(p: Point) {
		if(this.selected) {
			try{this.graph.add(new Link(this.selected, p))}
			catch(e) {}
		}
		this.selected = p; this.hovered = p
	}
	#mousemoveListener(event: MouseEvent) {
		this.mouse = this.viewport.getMouse(event)
		if(this.dragging && this.selected) {
			({x: this.selected.x, y: this.selected.y} = this.viewport.getMouse(event))
		}
		const existing = this.graph.find(this.mouse) as Point
		if(existing) this.hovered = existing
		else this.hovered = undefined
	}
	#keydownListener(event: KeyboardEvent) {
		if(event.key != "Escape") return
		this.selected = undefined
	}
	stop() {
		if(!this.#mainCycle) throw new Error("Graph editor wasn't running when attempted to be stopped")
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
		clearInterval(this.#mainCycle)
		this.canvas.removeEventListener("mousedown", this.#mousedownListener.bind(this))
		document.removeEventListener("keydown", this.#keydownListener.bind(this))
		this.canvas.removeEventListener("mousemove", this.#mousemoveListener.bind(this))
		this.canvas.removeEventListener("contextmenu", event => event.preventDefault())
		this.canvas.removeEventListener("mouseup", () => this.dragging = false)
	}
}
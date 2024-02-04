import Point from "./primitives/point"
interface Dragging {start: Point, end: Point, offset: Point, active: boolean}
export default class Viewport {
	canvas: HTMLCanvasElement
	context: CanvasRenderingContext2D
	dragging: Dragging
	zoom: number
	constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.canvas = canvas; this.context = context; this.zoom = 1;
		this.dragging = {start: new Point(0, 0), end: new Point(0, 0), offset: new Point(0, 0), active: false}
	}
	run() {
		this.canvas.addEventListener("wheel", this.#mousewheelListener.bind(this))
		document.addEventListener("keydown", this.#keydownListener.bind(this))
		document.addEventListener("keyup", this.#keyupListener.bind(this))
	}
	getMouse = (event: MouseEvent) => new Point(event.offsetX * this.zoom, event.offsetY * this.zoom)
	#mousewheelListener(event: WheelEvent) {
		const direction = Math.sign(event.deltaY)
		const step = .05
		this.zoom = Math.max(1, Math.min(5, this.zoom + direction * step))
	}
	#keydownListener(event: KeyboardEvent) {
		if(event.key != "Control") return
		this.dragging.active = true
	}
	#keyupListener(event: KeyboardEvent) {
		if(event.key != "Control") return
		this.dragging.active = false
	}
	stop() {
		this.canvas.removeEventListener("wheel", this.#mousewheelListener.bind(this))
		document.removeEventListener("keydown", this.#keydownListener.bind(this))
		document.removeEventListener("keyup", this.#keyupListener.bind(this))
	}
}
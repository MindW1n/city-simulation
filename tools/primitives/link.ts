import Point from "./point"
interface linkDrawProps {
	context: CanvasRenderingContext2D, width?: number, color?: string, dash?: number[]}
export default class Link {
	p1: Point
	p2: Point
	constructor(p1: Point, p2: Point) {this.p1 = p1; this.p2 = p2}
	draw({context, width = 2, color = "black", dash = []}: linkDrawProps) {
		context.beginPath()
		context.lineWidth = width
		context.strokeStyle = color
		context.setLineDash(dash)
		context.moveTo(this.p1.x, this.p1.y)
		context.lineTo(this.p2.x, this.p2.y)
		context.stroke()
	}
	equals(link: Link) {
		return this.p1.equals(link.p1) && this.p2.equals(link.p2)
			|| this.p1.equals(link.p2) && this.p2.equals(link.p1)
	}
}
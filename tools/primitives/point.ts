import {getDistance} from "@/tools/math/geometry"
interface pointDrawProps{
	context: CanvasRenderingContext2D,
	color?: string,
	radius?: number
}
export default class Point {
	x: number
	y: number
	constructor(x: number, y: number) {this.x = x; this.y = y}
	draw({context, color = "black", radius = 10}: pointDrawProps) {
		context.beginPath()
		context.fillStyle = color
		context.arc(this.x, this.y, radius, 0, Math.PI * 2)
		context.fill()
	}
	equals = (p: Point) => getDistance(this, p) < 20
}
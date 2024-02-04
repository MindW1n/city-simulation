import Link from "../primitives/link"
import Point from "../primitives/point"
export default class Graph {
	links: Link[]
	points: Point[]
	constructor(points: Point[] = [], links: Link[] = []) {this.points = points; this.links = links}
	draw(context: CanvasRenderingContext2D) {
		this.links.forEach(link => link.draw({context}))
		this.points.forEach(point => point.draw({context}))
	}
	add(object: Point | Link) {
		if(this.find(object)) throw new Error(
			"The object you're trying to add already appears to be in the graph"
		)
		if(object instanceof Point) this.points.push(object)
		else if(object instanceof Link) this.links.push(object)
		else throw new Error("Invalid type of object to add into the graph")
	}
	remove(object: Point | Link) {
		if(object instanceof Point) {
			this.points.splice(this.points.indexOf(object), 1)
			this.links = this.links.filter(l => l.p1 != object && l.p2 != object)
		}
		else if(object instanceof Link) this.links.splice(this.links.indexOf(object), 1)
		else throw new Error("Invelid type of object to remove from the graph")
	}
	find(object: Point | Link) {
		if(object instanceof Point) return this.points.find(p => p.equals(object))
		if(object instanceof Link) return this.links.find(l => l.equals(object))
		else throw new Error("Invalid type of object to find in the graph")
	}
}
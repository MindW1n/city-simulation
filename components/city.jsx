"use client"
import React, {useEffect} from "react"
import Graph from "@/tools/math/graph"
import GraphEditor from "@/tools/graph-editor"
export default function City() {
	useEffect(() => {
		let canvas = document.getElementById("canvas")
		canvas.width = window.innerWidth; canvas.height = window.innerHeight
		const editor = new GraphEditor({canvas, context: canvas.getContext("2d"), graph: new Graph(), fps: 60})
		editor.run()
		window.addEventListener("resize", () => {
			canvas.width = window.innerWidth; canvas.height = window.innerHeight
		})
	}, [])
	return <canvas id="canvas" className="bg-green-500 w-screen h-screen" />
}
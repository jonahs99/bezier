let control_points, t

/* setup is called once at the beginning of the session */

function setup() {

	// set the background color
	canvas.style.background = '#e0ddee'

	// TODO: Initialize something!

	t = 0

	control_points = []
	for (let i = 0; i < 8; i++) {
		control_points.push({
			x: 200 * i - 400 + Math.sin(i) * 100,
			y: Math.sin(3 * i) * 500
		})
	}

	context.setTransform(1, 0, 0, 1, 0, 0)
	context.clearRect(0, 0, canvas.width, canvas.height)
	context.translate(canvas.width / 2, canvas.height / 2)

	context.fillStyle = '#ff7777'
	for (const pt of control_points) {
		context.beginPath()
		context.arc(pt.x, pt.y, 8, 0, Math.PI * 2)
		//context.fill()
	}

	context.globalAlpha = 0.2
}

/* draw is called once each frame */

function draw(delta) {
	context.setTransform(1, 0, 0, 1, 0, 0)
	context.translate(canvas.width / 2, canvas.height / 2)

	if (t < 1)
		draw_bezier(control_points, t)

	t += 0.01
	if (t > 2) {
		setup()
	}
}

function draw_bezier(pts, t) {
	const n = pts.length

	const clr = ([
		'green', 'red', 'blue'
	])[n % 3]

	let pt

	if (n === 1) {
		pt = pts[0]
	} else {
		const a = draw_bezier(pts.slice(0, pts.length - 1), t)
		const b = draw_bezier(pts.slice(1), t)
		pt = lerp([a, b], t)

		if (n > 2) {
			context.strokeStyle = clr
			context.lineWidth = 0.2

			context.beginPath()
			// context.arc(pt.x, pt.y, 3, 0, Math.PI * 2)
			context.moveTo(a.x, a.y)
			context.lineTo(b.x, b.y)
			context.stroke()
		}
	}

	return pt
}

function lerp(pts, t) {
	return {
		x: (1 - t) * pts[0].x + t * pts[1].x,
		y: (1 - t) * pts[0].y + t * pts[1].y
	}
}

/* boilerplate */

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

/* the main loop */

let last_time

function loop() {
	requestAnimationFrame(loop)	

	const now = Date.now()
	const delta = now - last_time
	last_time = now
	draw(delta)
}

function resize() {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
}

window.addEventListener('load', () => {
	resize()

	setup()

	last_time = Date.now()

	requestAnimationFrame(loop)
})

window.addEventListener('resize', resize)

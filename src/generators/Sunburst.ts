import * as d3 from 'd3'
import { defaultColorScheme } from './Colors'
import { sunburstChartProps } from '../chart.types'
import { getSVGInContext } from './SVG'

export const generateSunBurst = ({ id, data, options }: sunburstChartProps) => {
	let { svg, bounds } = getSVGInContext({ id })
	let { group, type } = options
	const width = bounds.width,
		height = bounds.height,
		maxRadius = Math.min(width, height) / 2 - 5

	const formatNumber = d3.format(',d')

	const x = d3
		.scaleLinear()
		.range([0, 2 * Math.PI])
		.clamp(true)

	const y = d3.scaleSqrt().range([maxRadius * 0.1, maxRadius])

	const color = d3.scaleOrdinal([...defaultColorScheme])

	const partition = d3.partition()

	const arc: d3.Arc<any, any> = d3
		.arc()
		.startAngle((d: any) => x(d.x0))
		.endAngle((d: any) => x(d.x1))
		.innerRadius((d: any) => Math.max(0, y(d.y0)))
		.outerRadius((d: any) => Math.max(0, y(d.y1)))

	const middleArcLine = (d: any) => {
		const halfPi = Math.PI / 2
		const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi]
		const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2)

		const middleAngle = (angles[1] + angles[0]) / 2
		const invertDirection = middleAngle > 0 && middleAngle < Math.PI
		if (invertDirection) {
			angles.reverse()
		}

		const path = d3.path()
		path.arc(0, 0, r, angles[0], angles[1], invertDirection)
		return path.toString()
	}

	const textFits = (d: any) => {
		const CHAR_SPACE = 6

		const deltaAngle = x(d.x1) - x(d.x0)
		const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2)
		const perimeter = r * deltaAngle

		return d.data[group].length * CHAR_SPACE < perimeter
	}

	svg.on('click', () => focusOn()).attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
	let root = d3.hierarchy(data)
	root.sum((d) => d[type])

	const slice = svg.selectAll('g.slice').data(partition(root).descendants())

	slice.exit().remove()

	const newSlice = slice
		.enter()
		.append('g')
		.attr('class', 'slice')
		.on('click', (event, d) => {
			event.stopPropagation()
			focusOn(d)
		})

	newSlice.append('title').text((d: any) => d.data[group] + '\n' + formatNumber(d.value))

	newSlice
		.append('path')
		.attr('class', 'main-arc')
		.style('fill', (d: any) => color((d.children ? d : d.parent).data[group]))
		.attr('d', arc)

	newSlice
		.append('path')
		.attr('class', 'hidden-arc')
		.attr('id', (_, i) => `hiddenArc${i}`)
		.attr('d', middleArcLine)

	const text = newSlice.append('text').attr('display', (d) => (textFits(d) ? null : 'none'))

	// Add white contour
	text.append('textPath')
		.attr('startOffset', '50%')
		.attr('xlink:href', (_, i) => `#hiddenArc${i}`)
		.text((d: any) => d.data[group])
		.style('fill', 'none')
		.style('stroke', '#fff')
		.style('stroke-width', 5)
		.style('stroke-linejoin', 'round')

	text.append('textPath')
		.attr('startOffset', '50%')
		.attr('xlink:href', (_, i) => `#hiddenArc${i}`)
		.text((d: any) => d.data[group])

	const focusOn = (d = { x0: 0, x1: 1, y0: 0, y1: 1 }) => {
		const transition: any = svg
			.transition()
			.duration(750)
			.tween('scale', () => {
				const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
					yd = d3.interpolate(y.domain(), [d.y0, 1])
				return (t: any) => {
					x.domain(xd(t))
					y.domain(yd(t))
				}
			})

		transition.selectAll('path.main-arc').attrTween('d', (d: any) => () => arc(d))

		transition.selectAll('path.hidden-arc').attrTween('d', (d: any) => () => middleArcLine(d))

		transition.selectAll('text').attrTween('display', (d: any) => () => textFits(d) ? null : 'none')

		const moveStackToFront = (elD: {}) => {
			svg.selectAll('.slice')
				.filter((d) => d === elD)
				.each((d: any) => {
					// this.parentNode.appendChild(this)
					if (d.parent) {
						moveStackToFront(d.parent)
					}
				})
		}

		moveStackToFront(d)
	}
}

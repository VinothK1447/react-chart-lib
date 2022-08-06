import * as d3 from 'd3'
import { svgUtilsProps } from '../chart.types'
import { defaultColorScheme } from './Colors'
import { getSVGInContext } from './SVG'
import Utilities from '../utils/Utilities'

export const createTooltip = (id: string) => {
	let tooltip = d3.select(`#${id}`).append('div').attr('id', `${id}-tooltip`).style('opacity', 0).attr('class', 'chart-tooltip')
	tooltip.append('p').attr('id', 'value')
}

export const renderTooltip = (show: boolean, event?: any, id?: string, value?: string) => {
	if (show) {
		d3.select(`#${id}-tooltip`)
			.style('opacity', 1)
			.style('left', `${event.offsetX}px`)
			.style('top', `${event.offsetY}px`)
			.select('#value')
			.text(value || '')
	} else {
		d3.select(`#${id}-tooltip`).style('opacity', 0).style('top', 'initial').style('left', 'initial')
	}
}

export const renderAreaLineTooltip = ({ id, data, options, dataNest, xAxisScale, yAxisScale }: svgUtilsProps) => {
	let { svg, bounds } = getSVGInContext({ id })
	let tmp: any = data || dataNest
	var mouseG = svg.append('g').attr('class', 'mouse-over-effects').attr('transform', `translate(0, 0)`)
	mouseG.append('path').attr('class', 'mouse-line').style('opacity', '0')

	var lines = document.querySelectorAll('.line')

	var mousePerLine = mouseG.selectAll('.mouse-per-line').data(tmp).enter().append('g').attr('class', 'mouse-per-line')
	mousePerLine
		.append('circle')
		.attr('r', 5)
		.style('stroke', (d, i) => defaultColorScheme[i])
		.style('fill', (d, i) => defaultColorScheme[i])
		.style('stroke-width', '1px')
		.style('opacity', '0')

	mousePerLine
		.append('text')
		.attr('transform', 'translate(10,5)')
		.style('stroke', (d, i) => defaultColorScheme[i])
		.style('fill', (d, i) => defaultColorScheme[i])

	mouseG
		.append('svg:rect')
		.attr('x', 0)
		.attr('width', bounds.width)
		.attr('height', bounds.height)
		.attr('fill', 'none')
		.attr('pointer-events', 'all')
		.on('mouseout', () => {
			d3.select('.mouse-line').style('opacity', '0')
			d3.selectAll('.mouse-per-line circle').style('opacity', '0')
			d3.selectAll('.mouse-per-line text').style('opacity', '0')
		})
		.on('mouseover', () => {
			d3.select('.mouse-line').style('opacity', '1')
			d3.selectAll('.mouse-per-line circle').style('opacity', '1')
			d3.selectAll('.mouse-per-line text').style('opacity', '1')
		})
		.on('mousemove', (event) => {
			var mouse = d3.pointer(event)
			d3.select('.mouse-line').attr('d', () => {
				var d = 'M' + mouse[0] + ',' + bounds.height
				d += ' ' + mouse[0] + ',' + 0
				return d
			})
			d3.selectAll('.mouse-per-line').attr('transform', function (d: any, i) {
				// let bisect = d3.bisector((d: any) => d[primaryDomain]).right
				// var idx = bisect(d[primaryDomain] || d.value, xDate)
				var beginning = 0,
					selectedLine: any = lines.length === 1 ? lines[0] : lines[i],
					end = selectedLine.getTotalLength(),
					target = null,
					pos

				while (true) {
					target = Math.floor((beginning + end) / 2)
					pos = selectedLine.getPointAtLength(target)
					if ((target === end || target === beginning) && pos.x !== mouse[0]) {
						break
					}
					if (pos.x > mouse[0]) end = target
					else if (pos.x < mouse[0]) beginning = target
					else break
				}
				let hoverY = yAxisScale.invert(pos.y)
				let hoverText = `${Utilities.curateValue({ value: hoverY, formatter: { formatType: 'number', format: '.2f' } })}`

				//@ts-ignore
				d3.select(this).select('text').text(hoverText)

				return `translate(${mouse[0]}, ${pos.y})`
			})
		})
}

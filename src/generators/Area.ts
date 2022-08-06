import * as d3 from 'd3'
import Utilities from '../utils/Utilities'
import { areaChartProps, areaOnlyProps, areaTooltipProps } from '../chart.types'
import { xAxisScale, yAxisScale, getXAxisScale, getYAxisScale } from './Axes'
import { getSVGInContext } from './SVG'
import { generateLine } from './Line'
import { renderAreaLineTooltip } from './Tooltip'
import { defaultColorScheme } from './Colors'
import { generateLegend } from './Legend'

export const generateArea = ({ height, options }: areaOnlyProps) => {
	let primaryDomain: any = options.xAxis.domain
	let secondaryDomain: any = options.yAxis.domain
	return d3
		.area()
		.x((d) => xAxisScale(d[primaryDomain]))
		.y0(height)
		.y1((d) => yAxisScale(d[secondaryDomain]))
}
export const generateAreaAndLine = ({ id, data, options }: areaTooltipProps) => {
	let { svg, bounds } = getSVGInContext({ id })
	let { height } = bounds
	let area: any = generateArea({ height, options })
	let valueline: any = generateLine({ id, data, options })
	let color = defaultColorScheme[0]
	Utilities.generateDefs(id, color)
	svg.append('path').data([data]).attr('d', area).attr('class', 'area').attr('stroke', 'url(#linear-gradient)').attr('fill', 'url(#linear-gradient)')
	svg.append('path').data([data]).attr('d', valueline).attr('class', 'line').style('stroke', color)

	if (options.showTooltip) {
		const xAxisScale = getXAxisScale()
		const yAxisScale = getYAxisScale()
		renderAreaLineTooltip({ id, data, xAxisScale, yAxisScale })
	}
}

export const generateStackedArea = ({ id, data, options }: areaChartProps) => {
	let { svg, bounds } = getSVGInContext({ id })
	let { legend, xAxis, interactive } = options
	let primaryDomain = xAxis?.domain
	let isInteractive = interactive
	let tmpData: any = data
	let keys = tmpData.map((obj: any) => Object.keys(obj).filter((key) => key !== primaryDomain))[0]

	let stackedData = d3.stack().keys(keys)(tmpData)
	let area: any = d3
		.area()
		.x((d: any, i) => xAxisScale(d.data[primaryDomain]))
		.y0((d) => yAxisScale(d[0]))
		.y1((d) => yAxisScale(d[1]))

	let areaChart = svg
		.selectAll('mylayers')
		.data(stackedData)
		.enter()
		.append('path')
		.attr('class', (d) => `myArea ${d.key}`)
		.style('fill', (d, i) => defaultColorScheme[i])
		.attr('d', area)

	if (isInteractive) {
		let idleTimeout: any
		const size = 20
		const idled = () => (idleTimeout = null)

		const updateChart = (event: any) => {
			let extent = event.selection

			if (!extent) {
				if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350))
				xAxisScale.domain(d3.extent(data, (d: any) => d[primaryDomain]))
			} else {
				xAxisScale.domain([xAxisScale.invert(extent[0]), xAxisScale.invert(extent[1])])
				areaChart.select('.brush').call(brush.move, null)
			}

			xAxisScale.transition().duration(1000).call(d3.axisBottom(xAxisScale).ticks(5))
			areaChart.selectAll('path').transition().duration(1000).attr('d', area)
		}
		const highlight = (event: any, d: any) => {
			d3.selectAll('.myArea').style('opacity', 0.1)
			d3.select('.' + d).style('opacity', 1)
		}
		const noHighlight = (d: any) => {
			d3.selectAll('.myArea').style('opacity', 1)
		}

		let clip: any = svg.append('defs').append('svg:clipPath').attr('id', 'clip').append('svg:rect').attr('width', bounds.width).attr('height', bounds.height).attr('x', 0).attr('y', 0)
		let brush: any = d3
			.brushX()
			.extent([
				[0, 0],
				[bounds.width, bounds.height]
			])
			.on('end', updateChart)
		areaChart.append('g').attr('clip-path', 'url(#clip)').append('g').attr('class', 'brush').call(brush)
		svg.selectAll('myrect')
			.data(keys)
			.enter()
			.append('rect')
			.attr('x', bounds.width * 0.92)
			.attr('y', (d, i) => 10 + i * (bounds.y + 5))
			.attr('width', size)
			.attr('height', size)
			.style('fill', (d, i) => defaultColorScheme[i])
			.on('mouseover', highlight)
			.on('mouseleave', noHighlight)

		// Add one dot in the legend for each name.
		svg.selectAll('mylabels')
			.data(keys)
			.enter()
			.append('text')
			.attr('x', bounds.width * 0.95)
			.attr('y', (d, i) => 10 + i * (bounds.y + 5) + size / 2)
			.style('fill', (d, i) => defaultColorScheme[i])
			.text((d: any) => d)
			.attr('text-anchor', 'left')
			.style('alignment-baseline', 'middle')
			.on('mouseover', highlight)
			.on('mouseleave', noHighlight)
	} else {
		if (legend?.show) {
			generateLegend({ id, data: keys, options, type: 'area' })
		}
	}
}

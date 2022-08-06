import * as d3 from 'd3'
import { areaChartProps, lineChartProps } from '../chart.types'
import { getSVGInContext } from './SVG'
import { xAxisScale, yAxisScale } from './Axes'
import { generateLegend } from './Legend'
import { renderAreaLineTooltip } from './Tooltip'
import { defaultColorScheme } from './Colors'

export const generateLines = ({ id, data, options }: lineChartProps) => {
	let { svg, bounds } = getSVGInContext({ id })
	let { group = '' } = options
	let tmpData: any = data
	let dataNest: any = Array.from(
		d3.group(tmpData, (d: any) => d[group]),
		([key, value]) => ({ key, value })
	)
	const multiLineChart = svg.append('g').attr('id', 'data-group').attr('transform', `translate(0, 0)`)
	dataNest.forEach((d: any, i: any) => {
		let valueline = generateLine({ id, data, options })
		multiLineChart.append('path').attr('class', 'line').attr('d', valueline(d.value)).style('stroke', defaultColorScheme[i])
	})
	if (options?.showTooltip) {
		renderAreaLineTooltip({ id, dataNest, options, xAxisScale, yAxisScale })
	}
	if (options?.legend?.show) {
		generateLegend({ id, dataNest, options, type: 'line' })
	} else {
		svg.select('#data-group').attr('width', bounds.width).attr('height', bounds.height)
	}
}

export const generateLine = ({ id, data, options }: lineChartProps | areaChartProps) => {
	let primaryDomain: any = options.xAxis.domain
	let secondaryDomain: any = options.yAxis.domain
	return d3
		.line()
		.x((d) => xAxisScale(d[primaryDomain]))
		.y((d) => yAxisScale(d[secondaryDomain]))
}

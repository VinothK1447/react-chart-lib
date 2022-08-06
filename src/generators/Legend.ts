import * as d3 from 'd3'
import { margin } from '../utils/Constants'
import { defaultColorScheme } from './Colors'
import { getSVGInContext } from './SVG'

export const generateLegend = ({ id, data, options, radius = 0, dataNest, type }: any) => {
	let { svg, bounds } = getSVGInContext({ id })
	let legendPosition = options.legend.position
	let labelHeight = 18
	let labelDotRadius = 8
	let offset = 25
	let dataLen = 0
	let legendOrientation = options.legend.orient || (legendPosition.includes('top') || legendPosition.includes('bottom') ? 'horizontal' : 'vertical')
	let tmpData: any = data || dataNest
	let dataDomain = options?.legend?.label ? options.legend.label[0] : ''
	let dataType = options?.legend?.label ? options.legend.label[1] : ''
	const legendGrp = svg.append('g').attr('class', 'legend-group')
	const arcGroup = svg.select('#data-group')
	let legendItem: any = legendGrp.selectAll('.legend-group').data(tmpData).enter().append('g').attr('class', 'legend-item')
	let legendNode: any = d3.select('.legend-group').node()
	let legendGroupProps: any

	if (legendOrientation === 'horizontal') {
		legendItem
			.append('circle')
			.attr('r', labelDotRadius)
			.attr('class', 'legend-circle')
			.attr('fill', (d: any, i: any) => defaultColorScheme[i])
		legendItem
			.append('text')
			.text((d: any) => {
				return dataType ? `${d[dataDomain]} ${d[dataType]}` : d[dataDomain] ? `${d[dataDomain]}` : d
			})
			.attr('class', 'legend-text')
			.attr('x', labelHeight)
		legendItem.attr('transform', function (d: any, i: any) {
			//@ts-ignore
			let legendItemNode: any = d3.select(this).node()
			let legendItemWidth = legendItemNode.getBBox().width
			if (i === 0) {
				dataLen = legendItemWidth + offset
				return 'translate(0,0)'
			} else {
				let newdataL = dataLen
				dataLen += legendItemWidth + offset
				return `translate(${newdataL},0)`
			}
		})
	} else {
		legendItem
			.append('circle')
			.attr('cy', (d: any, i: any) => (i > 0 ? labelHeight * i * 1.8 + labelHeight : labelHeight))
			.attr('r', labelDotRadius)
			.attr('fill', (d: any, i: any) => defaultColorScheme[i])
		legendItem
			.append('text')
			.text((d: any) => {
				return dataType ? `${d[dataDomain]} ${d[dataType]}` : d[dataDomain] ? `${d[dataDomain]}` : d
			})
			.attr('class', 'legend-text')
			.attr('x', labelHeight)
			.attr('y', (d: any, i: any) => (i > 0 ? labelHeight * i * 1.8 + labelHeight : labelHeight))
	}

	legendGroupProps = legendNode.getBBox()

	switch (type) {
		case 'pie':
			switch (legendPosition) {
				case 'top-left':
					arcGroup.attr('transform', `translate(${bounds.width / 2 + 50}, ${bounds.height / 2 + 50})`)
					legendGrp.attr('transform', `translate(0, ${margin.top})`)
					break
				case 'top-center':
					arcGroup.attr('transform', `translate(${bounds.width / 2 + 50}, ${bounds.height / 2 + 50})`)
					legendGrp.attr('transform', `translate(${legendGroupProps.width / 2}, ${margin.top})`)
					break
				case 'top-right':
					arcGroup.attr('transform', `translate(${bounds.width / 2 + 50}, ${bounds.height / 2 + 50})`)
					legendGrp.attr('transform', `translate(${bounds.width - legendGroupProps.width}, ${margin.top})`)
					break
				case 'center-left':
					legendGrp.attr('transform', `translate(0, ${bounds.height / 2 - 50})`)
					arcGroup.attr('transform', `translate(${bounds.width / 2 + radius}, ${bounds.height / 2 + 50})`)
					break
				case 'center-right':
				default:
					arcGroup.attr('transform', `translate(${bounds.width / 2 - legendGroupProps.width + 50}, ${bounds.height / 2 + 50})`)
					legendGrp.attr('transform', `translate(${bounds.width / 2 + 50}, ${bounds.height / 2 - 50})`)
					break
				case 'bottom-left':
					arcGroup.attr('transform', `translate(${bounds.width / 2}, ${bounds.height / 2 - legendGroupProps.height + 25})`)
					legendGrp.attr('transform', `translate(0, ${bounds.height + margin.bottom})`)
					break
				case 'bottom-center':
					arcGroup.attr('transform', `translate(${bounds.width / 2}, ${bounds.height / 2 - legendGroupProps.height + 25})`)
					legendGrp.attr('transform', `translate(${legendGroupProps.width / 2}, ${bounds.height + margin.bottom})`)
					break
				case 'bottom-right':
					arcGroup.attr('transform', `translate(${bounds.width / 2}, ${bounds.height / 2 - legendGroupProps.height + 25})`)
					legendGrp.attr('transform', `translate(${bounds.width - legendGroupProps.width}, ${bounds.height + margin.bottom})`)
					break
			}
			break
		case 'line':
		case 'area':
		case 'bar':
			switch (legendPosition) {
				case 'top-left':
					legendGrp.attr('transform', `translate(${bounds.x}, ${margin.top})`)
					break
				case 'top-center':
					legendGrp.attr('transform', `translate(${bounds.width / 2}, ${margin.top})`)
					break
				case 'top-right':
					legendGrp.attr('transform', `translate(${bounds.width - legendGroupProps.width}, ${margin.top})`)
					break
				case 'bottom-left':
					legendGrp.attr('transform', `translate(${bounds.x}, ${bounds.height + 35})`)
					break
				case 'bottom-center':
					legendGrp.attr('transform', `translate(${bounds.width / 2 - 150}, ${bounds.height + 35})`)
					break
				case 'bottom-right':
					legendGrp.attr('transform', `translate(${bounds.width - legendGroupProps.width}, ${bounds.height + 35})`)
					break
			}
	}
}

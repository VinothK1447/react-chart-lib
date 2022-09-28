import * as d3 from 'd3'
import { defaultColorScheme } from './Colors'
import { pieChartProps } from '../chart.types'
import { generateNoDataBlock, getSVGInContext } from './SVG'
import { createTooltip, renderTooltip } from './Tooltip'
import { generateLegend } from './Legend'
import Utilities from '../utils/Utilities'

export const setupPie = (obj: pieChartProps) => {
	let { id, data, options } = obj
	let { domain = '', type = '', isDonut, arcSize, centerText, isClickable } = options
	let { svg, bounds } = getSVGInContext({ id })

	if (data && data.length) {
		let radius = Math.min(bounds.width, bounds.height) / 2
		let innerRadius
		switch (arcSize) {
			case 'sm':
			default:
				innerRadius = radius * 0.85
				break
			case 'md':
				innerRadius = radius * 0.65
				break
			case 'lg':
				innerRadius = radius * 0.35
				break
		}

		let color = d3.scaleOrdinal([...defaultColorScheme])

		let pie = d3.pie().value((d: any) => d[type])

		let path: d3.Arc<any, any> = d3
			.arc()
			.outerRadius(radius)
			.innerRadius(isDonut ? innerRadius : 0)

		let arc = svg
			.append('g')
			.attr('id', 'data-group')
			.selectAll('.arc')
			.data(pie(data))
			.enter()
			.append('path')
			.attr('d', path)
			.attr('fill', (d: any) => color(d.data[domain]))

		let centerTextValue: any
		let _adder: any = 0
		if (centerText?.show) {
			if (centerText?.value) {
				_adder = centerText?.value
			} else {
				_adder = Utilities.getSumOfObjectKey(data, type)
			}
			switch (centerText.type) {
				case 'number':
					centerTextValue = Utilities.curateValue({ value: +_adder, formatter: centerText.formatter })
					break
				case 'currency':
					centerTextValue = Utilities.formatToCurrency(_adder)
					break
				default:
					return (centerTextValue = _adder)
			}
			svg.selectAll('#data-group').append('text').attr('dy', '0').text(centerText?.label).attr('y', -10).attr('class', 'pie-center-text pie-center-text-label')
			svg.selectAll('#data-group').append('text').attr('dy', '2rem').text(centerTextValue).attr('y', -10).attr('class', 'pie-center-text pie-center-text-value')
		}

		if (options?.showTooltip) {
			createTooltip(id)
			arc.on('mousemove', (event, d: any) => {
				let tooltipValue = `${d.data[domain]} - ${d.data[type]}`
				renderTooltip(true, event, id, tooltipValue)
			}).on('mouseout', (event) => {
				renderTooltip(false, event, id)
			})
		}
		if (options?.legend?.show) {
			generateLegend({ id, data, options, radius, type: 'pie' })
		} else {
			svg.select('#data-group').attr('transform', `translate(${bounds.width / 2}, ${bounds.height / 2})`)
		}
		if (isClickable?.clickable) {
			arc.on('click', (e, d) => isClickable?.onChartItemClick && isClickable.onChartItemClick(d.data))
		}
	} else {
		generateNoDataBlock({ id })
	}
}

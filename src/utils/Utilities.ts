import { curateFnProps } from 'chart.types'
import * as d3 from 'd3'
import { getSVGInContext } from '../generators/SVG'
export default class Utilities {
	static isEmpty(value: any) {
		return value === undefined || value === null || (typeof value === 'object' && Object.keys(value).length === 0) || (typeof value === 'string' && value.trim().length === 0) || (Array.isArray(value) && value.length === 0)
	}

	// static wrap(text: any, width: number) {
	// 	text.each(function () {
	// 		//@ts-ignore
	// 		let text = d3.select(this)
	// 		let words = text.text().split(/\s+/).reverse()
	// 		let word
	// 		let line: any = []
	// 		let lineNumber = 0
	// 		let lineHeight = 1 // ems
	// 		let x = text.attr('x')
	// 		let y = text.attr('y')
	// 		let dy = parseFloat(text.attr('dy'))
	// 		let tspan: any = text
	// 			.text(null)
	// 			.append('tspan')
	// 			.attr('x', 0)
	// 			.attr('y', y)
	// 			.attr('dy', dy + 'em')
	// 		while ((word = words.pop())) {
	// 			line.push(word)
	// 			tspan.text(line.join(' '))
	// 			if (tspan.node().getComputedTextLength() > width) {
	// 				line.pop()
	// 				tspan.text(line.join(' '))
	// 				line = [word]
	// 				tspan = text
	// 					.append('tspan')
	// 					.attr('x', 0)
	// 					.attr('y', y)
	// 					.attr('dy', ++lineNumber * lineHeight + dy + 'em')
	// 					.text(word)
	// 			}
	// 		}
	// 	})
	// }

	static wrap(text: any, width: number, orient: string, wrapLength: number = 10) {
		text.each(function (el: any) {
			if (typeof el === 'string') {
				let sliced = el
				if (sliced.length > wrapLength) {
					sliced = sliced.slice(0, wrapLength)
					sliced += '...'
				}
				let _tmpArr = sliced.split(' ')
				//@ts-ignore
				let txtEl = d3.select(this)
				let lineNumber = 0
				let lineHeight = orient === 'horizontal' ? 0.25 : 1 // ems
				let x = txtEl.attr('x')
				let y = txtEl.attr('y')
				let dy = parseFloat(txtEl.attr('dy'))
				txtEl.text(null)
				_tmpArr.forEach(function (_txt, idx) {
					let tspan: any = txtEl.append('tspan').attr('x', 0).attr('y', y).text(_txt)
					if (tspan.node().getComputedTextLength() > width) {
						if (idx === 0) {
							tspan.attr('dy', dy + 'em')
						} else {
							tspan.attr('dy', ++lineNumber * lineHeight + dy + 'em')
						}
					} else {
						tspan.attr('dy', ++lineNumber * lineHeight + dy + 'em')
					}
				})
			} else {
				return el
			}
		})
	}

	static generateDefs(id: string, color: string) {
		let { svg } = getSVGInContext({ id })
		let defs = svg.append('defs')
		let gradient = defs.append('linearGradient').attr('id', 'linear-gradient').attr('x1', '0%').attr('x2', '0%').attr('y1', '0%').attr('y2', '100%')
		gradient.append('stop').attr('class', 'start').attr('offset', '0%').style('stop-color', color).style('stop-opacity', 1)
		gradient.append('stop').attr('class', 'start').attr('offset', '25%').style('stop-color', Utilities.hexToRGB(color, '75%')).style('stop-opacity', 1)
		gradient.append('stop').attr('class', 'start').attr('offset', '50%').style('stop-color', Utilities.hexToRGB(color, '50%')).style('stop-opacity', 1)
		gradient.append('stop').attr('class', 'start').attr('offset', '75%').style('stop-color', Utilities.hexToRGB(color, '25%')).style('stop-opacity', 1)
		gradient.append('stop').attr('class', 'end').attr('offset', '100%').style('stop-color', Utilities.hexToRGB(color, '1%')).style('stop-opacity', 1)
	}

	static isDate(date: any) {
		return !isNaN(new Date(date).getDate())
	}

	static curateAxis({ axisPlot, formatter }: curateFnProps) {
		if (!axisPlot) {
			return false
		}
		let formatValue: any
		switch (formatter?.formatType) {
			case 'number':
			case 'currency':
				formatValue = d3.format(formatter?.format)
				return axisPlot.tickFormat((d: any) => formatValue(d).replace('G', 'B'))
			case 'date':
				formatValue = d3.timeFormat(formatter.format)
				return axisPlot.tickFormat((d: any) => {
					let valueType = typeof d
					let tmpVal
					if (valueType === 'string') {
						tmpVal = new Date(d)
						if (Utilities.isDate(tmpVal)) {
							return formatValue(tmpVal)
						} else {
							return d
						}
					} else {
						return formatValue(d)
					}
				})
				break
			default:
				break
		}
	}

	static curateValue({ value, formatter }: curateFnProps) {
		if (value === null || value === undefined) {
			return false
		}
		let formatValue: any
		switch (formatter?.formatType) {
			case 'number':
			case 'currency':
				formatValue = d3.format(formatter?.format)
				return formatValue(+value).replace('G', 'B')
			case 'date':
				formatValue = d3.timeFormat(formatter?.format)
				return formatValue(new Date(value))
			default:
				break
		}
	}

	static hexToRGB(hex: string, alpha?: string) {
		const r = parseInt(hex.slice(1, 3), 16)
		const g = parseInt(hex.slice(3, 5), 16)
		const b = parseInt(hex.slice(5, 7), 16)

		if (alpha) {
			return `rgba(${r}, ${g}, ${b}, ${alpha})`
		}

		return `rgb(${r}, ${g}, ${b})`
	}

	static formatToCurrency(value: number, currency: string = 'USD') {
		return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0, style: 'currency', currency: currency }).format(value)
	}

	static getSumOfObjectKey(data: any, key: string) {
		let _adder: any = 0
		data.forEach((el: any) => {
			_adder += el[key]
		})
		return _adder
	}
}

import * as d3 from 'd3'
import { defaultColorScheme } from './Colors'
import { barChartProps } from '../chart.types'
import { generateNoDataBlock, getSVGInContext } from './SVG'
import { xAxisScale, yAxisScale, zAxisScale } from './Axes'
import { createTooltip, renderTooltip } from './Tooltip'
import { generateLegend } from './Legend'
import Utilities from '../utils/Utilities'
import { margin } from '../utils/Constants'

export const generateGroupedBars = ({ id, data, options, colors }: barChartProps) => {
	let { svg, bounds } = getSVGInContext({ id })
	let { xAxis, yAxis, labels, legend, isClickable } = options
	let isGrouped = options.grouped
	let colorScheme: any = colors || defaultColorScheme
	let primaryDomain: any = xAxis.domain
	let secondaryDomain: any = yAxis.domain
	let primaryDomainType: any = xAxis.type
	let isHorizontal = primaryDomainType !== 'string'
	let barData: any = data
	let subgroup: any[] = []
	let legendKeys: any[] = []
	let excludeKey = primaryDomain || secondaryDomain

	if (isGrouped) {
		barData.forEach((datum: any, idx: number) => {
			subgroup = Object.keys(datum).filter((val) => val !== (isHorizontal ? secondaryDomain : primaryDomain))
			legendKeys = Object.keys(datum).filter((val) => val !== excludeKey)
		})
	}
	if (barData && !barData.length) {
		return false
	}
	let formatterObj: any = xAxis?.formatter || yAxis?.formatter
	let groupedBar = svg
		.append('g')
		.selectAll('g')
		.data(barData)
		.enter()
		.append('g')
		.attr('transform', (d: any) => (isHorizontal ? `translate(0, ${yAxisScale(d[secondaryDomain])})` : `translate(${xAxisScale(d[primaryDomain])}, 0)`))

	let rects = groupedBar
		.selectAll('rect')
		.data((d: any) =>
			subgroup.map((key) => {
				return { key: key, value: d[key] }
			})
		)
		.enter()
		.append('g')
	let rect = rects
		.append('rect')
		.attr('data-value', (d: any) => `${d.key}: ${d.value}`)
		.attr('fill', (d: any, i) => colorScheme[i])

	zAxisScale?.paddingOuter(0.5)
	zAxisScale?.paddingInner(0.1)
	if (isHorizontal) {
		rect.attr('x', 0)
			.attr('y', (d) => zAxisScale(d.key))
			.attr('height', (d) => zAxisScale.bandwidth())
			.transition()
			.duration(800)
			.delay((d, i) => i * 100)
			.attr('width', (d) => xAxisScale(d.value))
	} else {
		rect.attr('x', (d) => zAxisScale(d.key))
			.attr('y', (d) => yAxisScale(d.value))
			.attr('width', zAxisScale.bandwidth())
			.transition()
			.duration(800)
			.delay((d, i) => i * 100)
			.attr('height', (d) => bounds.height - yAxisScale(d.value))
	}
	if (labels?.show) {
		if (labels?.pre?.show) {
			groupedBar
				.append('text')
				.text((d: any) => d[secondaryDomain])
				.attr('class', 'group-bar-text')
				.attr('x', 0)
				.attr('y', -5)
		}
		if (labels?.post?.show) {
			rects
				.append('text')
				.attr('class', 'bar-text')
				.attr('width', (d) => (isHorizontal ? yAxisScale.bandwidth() : xAxisScale.bandwidth()))
				.text((d: any): any => {
					let _text
					switch (labels?.post?.valueType) {
						case 'key':
							_text = Utilities.curateValue({ value: d.key, formatter: formatterObj })
							break
						case 'value':
						default:
							_text = Utilities.curateValue({ value: d.value, formatter: formatterObj })
							break
						case 'both':
							_text = `${d.key}: ${Utilities.curateValue({ value: d.value, formatter: formatterObj })}`
							break
					}
					return _text
				})
				.attr('x', (d: any, idx: number) => {
					let _xPos
					if (isHorizontal) {
						switch (labels?.post?.position) {
							case 'end':
							default:
								_xPos = xAxisScale(d.value) + yAxisScale.bandwidth() / 2
								break
							case 'above':
							case 'below':
							case 'alt':
								_xPos = xAxisScale(d.value) - zAxisScale.bandwidth()
								break
						}
					} else {
						_xPos = xAxisScale(d[primaryDomain]) + xAxisScale.bandwidth() / 2
					}
					return _xPos
				})
				.attr('y', (d: any, idx: number) => {
					let _yPos
					if (isHorizontal) {
						switch (labels?.post?.position) {
							case 'end':
							default:
								_yPos = zAxisScale(d.key) + zAxisScale.bandwidth() / 2
								break
							case 'above':
								_yPos = zAxisScale(d.key) - yAxisScale.bandwidth() - zAxisScale.bandwidth()
								break
							case 'below':
								_yPos = zAxisScale(d.key) + yAxisScale.bandwidth() - zAxisScale.bandwidth()
								break
							case 'alt':
								_yPos = idx % 2 === 0 ? zAxisScale.bandwidth() + yAxisScale.bandwidth() / 1.6 : zAxisScale.bandwidth() - yAxisScale.bandwidth() / 3.8
								break
						}
					} else {
						_yPos = Math.abs(yAxisScale(d[secondaryDomain]) - 10)
					}
					return _yPos
				})
		}
	}
	if (legend?.show) {
		generateLegend({ id, data: legendKeys, options, type: 'bar' })
	}

	if (options?.showTooltip) {
		createTooltip(id)
		rect.on('mouseover', (event, d: any) => {
			const tooltipValue: any = event.currentTarget.dataset.value
			renderTooltip(true, event, id, tooltipValue)
		}).on('mouseout', (event) => {
			renderTooltip(false, event, id)
		})
	}
	if (isClickable?.clickable) {
		rect.on('click', (e, d) => isClickable?.onChartItemClick && isClickable.onChartItemClick(d))
	}
}

export const generateStackedBars = ({ id, data, options }: barChartProps) => {
	let { svg, bounds } = getSVGInContext({ id })
	let { xAxis, yAxis, legend, isClickable } = options
	let isStacked = options.stack
	let primaryDomain: any = xAxis.domain
	let secondaryDomain: any = yAxis.domain
	let primaryDomainType: any = xAxis.type
	let isHorizontal = primaryDomainType === 'string'
	let stackedData: any
	let subgroup: any[] = []
	let legendKeys: any[] = []
	let excludeKey = primaryDomain || secondaryDomain
	let color: any
	if (isStacked) {
		data.forEach((datum: any) => {
			subgroup = Object.keys(datum).filter((val) => val !== (isHorizontal ? secondaryDomain : primaryDomain))
			legendKeys = Object.keys(datum).filter((val) => val !== excludeKey)
			let numArr = Object.values(datum).filter((val) => typeof val === 'number')
			let total = numArr.reduce((a: any, b: any) => a + b)
			datum.total = total
		})
		color = defaultColorScheme
		stackedData = d3.stack().keys(legendKeys)(data)
	}
	if (data && !data.length) {
		return false
	}
	let stackedBar = svg
		.append('g')
		.attr('transform', `translate(0, 0)`)
		.selectAll('g')
		.data(stackedData)
		.join('g')
		.attr('fill', (d, i) => color[i])
		.selectAll('rect')
		.data((d: any) => d)
		.join('rect')
		.attr('data-value', (d: any) => {
			let key = Object.keys(d.data).find((key) => d.data[key] === d[1] - d[0])
			return `${key} - ${d[1] - d[0]}`
		})

	if (isHorizontal) {
		stackedBar
			.attr('x', (d: any) => xAxisScale(d.data[primaryDomain]))
			.attr('y', (d: any) => yAxisScale(d[1]))
			.attr('width', (d) => xAxisScale.bandwidth())
			.transition()
			.duration(800)
			.delay((d, i) => i * 100)
			.attr('height', (d: any) => Math.abs(yAxisScale(d[1]) - yAxisScale(d[0]) || 0))
	} else {
		stackedBar
			.attr('x', (d: any) => xAxisScale(d[0]))
			.attr('y', (d: any) => yAxisScale(d.data[secondaryDomain]))
			.attr('height', (d) => yAxisScale.bandwidth())
			.transition()
			.duration(800)
			.delay((d, i) => i * 100)
			.attr('width', (d: any) => Math.abs(xAxisScale(d[1]) - xAxisScale(d[0]) || 0))
	}
	if (legend?.show) {
		generateLegend({ id, data: legendKeys, options, type: 'bar' })
	}
	if (options?.showTooltip) {
		createTooltip(id)
		stackedBar
			.on('mouseover', (event, d: any) => {
				const tooltipValue: any = event.currentTarget.dataset.value
				renderTooltip(true, event, id, tooltipValue)
			})
			.on('mouseout', (event) => {
				renderTooltip(false, event, id)
			})
	}
	if (isClickable?.clickable) {
		stackedBar.on('click', (e, d: any) => isClickable?.onChartItemClick && isClickable.onChartItemClick({ obj: d.data, key: e.currentTarget.dataset.value }))
	}
}

export const generateBars = ({ id, data, options }: barChartProps) => {
	let { svg, bounds } = getSVGInContext({ id })
	let { xAxis, yAxis, labels, dualAxes, showTooltip, isClickable } = options
	let primaryDomain: any = xAxis.domain
	let secondaryDomain: any = yAxis.domain
	let primaryDomainType: any = xAxis.type
	let secondaryDomainType: any = xAxis.type
	let orient
	if (primaryDomainType === 'string' || primaryDomainType === 'date') {
		orient = 'vertical'
	} else {
		orient = 'horizontal'
	}
	let isHorizontal = orient === 'horizontal'
	let barData: any = data
	let formatterObj: any = xAxis?.formatter || yAxis?.formatter
	if (data && !data.length) {
		return false
	}
	let bar = svg
		.selectAll('.bar')
		.data([...barData])
		.enter()
		.append('g')
	let rect = bar.append('rect').style('fill', (d, i) => defaultColorScheme[i])
	if (isHorizontal) {
		yAxisScale.paddingInner(0.3)
		if (dualAxes) {
			rect.attr('y', (d) => yAxisScale(d[secondaryDomain]))
				.attr('height', yAxisScale.bandwidth())
				.attr('x', (d) => xAxisScale(Math.min(0, d[primaryDomain])))
				.transition()
				.duration(800)
				.delay((d, i) => i * 100)
				.attr('width', (d) => {
					return d[primaryDomain] > 0 ? xAxisScale(d[primaryDomain]) - xAxisScale(0) : xAxisScale(0) - xAxisScale(d[primaryDomain])
				})
		} else {
			rect.attr('y', (d) => yAxisScale(d[secondaryDomain]))
				.attr('height', Math.abs(yAxisScale.bandwidth()))
				.attr('x', 0) //(d) => xAxisScale(d[primaryDomain]))
				.transition()
				.duration(800)
				.delay((d, i) => i * 100)
				.attr('width', (d) => xAxisScale(d[primaryDomain]))
		}
	} else {
		xAxisScale.paddingInner(0.3)
		if (dualAxes) {
			rect.attr('x', (d) => xAxisScale(d[primaryDomain]))
				.attr('y', (d) => (d[secondaryDomain] < 0 ? yAxisScale(0) : yAxisScale(d[secondaryDomain])))
				.attr('width', xAxisScale.bandwidth())
				.transition()
				.duration(800)
				.delay((d, i) => i * 100)
				.attr('height', (d) => (d[secondaryDomain] < 0 ? yAxisScale(d[secondaryDomain]) - yAxisScale(0) : yAxisScale(0) - yAxisScale(d[secondaryDomain])))
		} else {
			rect.attr('x', (d) => xAxisScale(d[primaryDomain]))
				.attr('width', xAxisScale.bandwidth())
				.transition()
				.duration(800)
				.delay((d, i) => i * 100)
				.attr('height', (d) => Math.abs(bounds.height - yAxisScale(d[secondaryDomain])))
				.attr('y', (d) => yAxisScale(d[secondaryDomain]))
		}
	}
	if (labels?.show) {
		bar.append('text')
			.attr('class', 'bar-text')
			.text((d: any): any => (isHorizontal ? Utilities.curateValue({ value: d[primaryDomain], formatter: formatterObj }) : Utilities.curateValue({ value: d[secondaryDomain], formatter: formatterObj })))
			.attr('width', (d) => (isHorizontal ? yAxisScale.bandwidth() : xAxisScale.bandwidth()))
			.attr('x', (d) => (isHorizontal ? Math.abs(xAxisScale(d[primaryDomain]) + yAxisScale.bandwidth()) : xAxisScale(d[primaryDomain]) + xAxisScale.bandwidth() / 2))
			.attr('y', (d) => (isHorizontal ? yAxisScale(d[secondaryDomain]) + yAxisScale.bandwidth() / 2 : Math.abs(yAxisScale(d[secondaryDomain]) - 10)))
	}
	if (showTooltip) {
		createTooltip(id)
		rect.on('mousemove', (event, d: any) => {
			const tooltipValue: any = isHorizontal ? `${d[secondaryDomain]} ${d[primaryDomain]}` : `${d[primaryDomain]} ${d[secondaryDomain]}`
			renderTooltip(true, event, id, tooltipValue)
		}).on('mouseout', (event) => {
			renderTooltip(false, event, id)
		})
	}
	if (isClickable?.clickable) {
		rect.on('click', (e, d) => isClickable?.onChartItemClick && isClickable.onChartItemClick(d))
	}
}

export const generateDualAxesLinedBar = ({ id, data, options }: barChartProps) => {
	let { svg, bounds } = getSVGInContext({ id })
	let { xAxis, yAxis, legend, showTooltip, line, isClickable } = options
	let primaryDomain: any = xAxis.domain
	let secondaryDomain: any = yAxis.domain
	let lineDomain: any = line?.domain
	let primaryDomainType: any = xAxis.type
	let orient
	if (primaryDomainType === 'string' || primaryDomainType === 'date') {
		orient = 'vertical'
	} else {
		orient = 'horizontal'
	}
	let isHorizontal = orient === 'horizontal'
	let formatterObj: any = xAxis?.formatter || yAxis?.formatter
	let series: any
	let seriesKeys: any[] = []
	let includeKey = isHorizontal ? primaryDomain : secondaryDomain
	let legendKeys: any[] = [...includeKey, line?.domain]
	if (data && !data.length) {
		return false
	}
	data.forEach((datum: any) => {
		seriesKeys = Object.keys(datum).filter((val) => includeKey.indexOf(val) > -1)
	})
	series = d3.stack().keys(seriesKeys).offset(d3.stackOffsetDiverging)(data)

	let bar = svg
		.append('g')
		.selectAll('g')
		.data(series, (d: any) => d.key)
		.enter()
		.append('g')
		.attr('class', 'bars')
		.attr('fill', (d: any, i) => defaultColorScheme[i])
		.selectAll('rect')
		.data((d: any) => d)
		.enter()
		.append('rect')
		.attr('class', 'bar')
	if (isHorizontal) {
		let pos = yAxisScale?.bandwidth ? yAxisScale.bandwidth() / 2 : 45

		bar.attr('x', (d: any) => (d[0] < 0 ? xAxisScale(d[0]) : xAxisScale(0)))
			.attr('y', (d: any) => yAxisScale(d.data[secondaryDomain]))
			.attr('height', yAxisScale.bandwidth())
			.attr('width', (d: any) => Math.abs(xAxisScale(d[1])) - xAxisScale(d[0]))

		if (line?.show) {
			if (line?.opts?.showCircle) {
				svg.append('g')
					.selectAll('circle')
					.data(data)
					.enter()
					.append('circle')
					.attr('class', 'data-point-circle')
					.attr('stroke', defaultColorScheme[2])
					.attr('fill', defaultColorScheme[3])
					.attr('cy', (d: any) => (yAxisScale?.bandwidth ? yAxisScale(d[secondaryDomain]) + pos : yAxisScale(d[secondaryDomain])))
					.attr('cx', (d: any) => xAxisScale(d[lineDomain]))
					.attr('r', 4)
			}
		}
	} else {
		let pos = xAxisScale?.bandwidth ? xAxisScale.bandwidth() / 2 : 45
		bar.attr('x', (d: any) => (xAxisScale?.bandwidth ? xAxisScale(d.data[primaryDomain]) : xAxisScale(d.data[primaryDomain]) - pos))
			.attr('y', (d: any) => yAxisScale(d[1]))
			.attr('height', (d: any) => Math.abs(yAxisScale(d[0])) - yAxisScale(d[1]))
			.attr('width', xAxisScale?.bandwidth ? xAxisScale.bandwidth() : 90)

		if (line?.show) {
			let barLine = d3
				.line()
				.x((d) => (xAxisScale?.bandwidth ? xAxisScale(d[primaryDomain]) + pos : xAxisScale(d[primaryDomain])))
				.y((d) => yAxisScale(d[lineDomain]))

			svg.append('g')
				.append('path')
				.datum(data)
				.attr('class', 'data-point-line')
				.attr('d', barLine)
				.attr('stroke', line?.opts?.showLine ? defaultColorScheme[2] : 'transparent')
			if (line?.opts?.showCircle) {
				svg.append('g')
					.selectAll('circle')
					.data(data)
					.enter()
					.append('circle')
					.attr('class', 'data-point-circle')
					.attr('stroke', defaultColorScheme[2])
					.attr('fill', defaultColorScheme[3])
					.attr('cx', (d: any) => (xAxisScale?.bandwidth ? xAxisScale(d[primaryDomain]) + pos : xAxisScale(d[primaryDomain])))
					.attr('cy', (d: any) => yAxisScale(d[lineDomain]))
					.attr('r', 4)
			}
		}
	}
	if (legend?.show) {
		generateLegend({ id, dataNest: legendKeys, options, type: 'bar' })
	}
	if (showTooltip) {
		createTooltip(id)
		bar.on('mousemove', (event, d: any) => {
			const tooltipValue: any = Object.keys(d.data)
				.map(
					(key) => `${key}: ${d.data[key]}
				`
				)
				?.join('')
			renderTooltip(true, event, id, tooltipValue)
		}).on('mouseout', (event) => {
			renderTooltip(false, event, id)
		})
	}
	if (isClickable?.clickable) {
		bar.on('click', (e, d: any) => isClickable?.onChartItemClick && isClickable.onChartItemClick(d.data))
	}
}

export const generateDualAxesCenterTextBars = ({ id, data, options }: barChartProps) => {
	let { svg, bounds } = getSVGInContext({ id })
	let { xAxis, yAxis, labels, dualAxes, showTooltip, isClickable } = options
	let primaryDomain: any = xAxis.domain
	let secondaryDomain: any = yAxis.domain
	let primaryDomainType: any = xAxis.type
	let secondaryDomainType: any = xAxis.type
	let xformatterObj: any = xAxis?.formatter
	let yformatterObj: any = yAxis?.formatter
	let labelArea = 80
	const getMax: any = (data: any, domain: any) => Math.max(...data.map((obj: any) => Math.max(...domain.map((key: any) => obj[key]))))

	if (data && !data.length) {
		return false
	}
	if (!primaryDomainType || !secondaryDomainType) {
		generateNoDataBlock({ id, msg: 'Cannot infer scale type from data!' })
		throw new Error('Cannot infer scale type from data!')
	}
	if ((Array.isArray(primaryDomain) && !primaryDomain.length) || primaryDomain.length > 2) {
		generateNoDataBlock({ id, msg: 'Invalid configuration supplied!' })
		throw new Error('Invalid configuration supplied!')
	}
	if (Array.isArray(primaryDomain) && primaryDomain.length && primaryDomain.length <= 2) {
		let leftPrimaryDomainType = primaryDomain[0]
		let rightPrimaryDomainType = primaryDomain[1]
		let maxValue = getMax(data, primaryDomain)

		let xFrom: any = d3
			.scaleLinear()
			.domain([0, maxValue])
			.range([bounds.width / 2, 0])
			.nice()
		let xTo: any = d3
			.scaleLinear()
			.domain([0, maxValue])
			.range([0, bounds.width / 2])
			.nice()
		let y: any = d3
			.scaleBand()
			.domain(data.map((d: any) => d[secondaryDomain]))
			.range([bounds.height, 0])

		const g = svg.append('g')
		y.paddingInner(0.9)
		y.padding(0.8)
		let leftBars = g
			.append('g')
			.selectAll('.bar')
			.data(data)
			.enter()
			.append('rect')
			.style('fill', defaultColorScheme[0])
			.attr('x', (d: any) => xFrom(Math.max(0, d[leftPrimaryDomainType])) - labelArea)
			.attr('y', (d: any) => y(d[secondaryDomain]))
			.attr('width', (d: any) => Math.abs(xFrom(d[leftPrimaryDomainType]) - xFrom(0)))
			.attr('height', (d: any) => y.bandwidth())
			.attr('data-tooltipvalue', (d: any) => `${d[secondaryDomain]} - ${d[leftPrimaryDomainType]}`)
		let rightBars = g
			.append('g')
			.selectAll('.bar')
			.data(data)
			.enter()
			.append('rect')
			.style('fill', defaultColorScheme[1])
			.attr('x', (d: any) => labelArea + xFrom(Math.min(0, d[rightPrimaryDomainType])))
			.attr('y', (d: any) => y(d[secondaryDomain]))
			.attr('width', (d: any) => Math.abs(xFrom(d[rightPrimaryDomainType]) - xFrom(0)))
			.attr('height', (d: any) => y.bandwidth())
			.attr('data-tooltipvalue', (d: any) => `${d[secondaryDomain]} - ${d[rightPrimaryDomainType]}`)

		let leftXAxisPlot: any = d3.axisBottom(xFrom)
		if (xformatterObj) {
			leftXAxisPlot = Utilities.curateAxis({ axisPlot: leftXAxisPlot, formatter: xformatterObj })
		}
		let rightXAxisPlot: any = d3.axisBottom(xTo)
		if (xformatterObj) {
			rightXAxisPlot = Utilities.curateAxis({ axisPlot: rightXAxisPlot, formatter: xformatterObj })
		}
		let centerYAxisPlot: any = d3.axisRight(y)
		if (!xAxis.showTicks) {
			leftXAxisPlot.tickSize(0)
			rightXAxisPlot.tickSize(0)
		} else {
			leftXAxisPlot.tickSize(-bounds.height + margin.top * 2)
			rightXAxisPlot.tickSize(-bounds.height + margin.top * 2)
		}
		if (xAxis?.noOfTicks) {
			leftXAxisPlot.ticks(xAxis.noOfTicks)
			rightXAxisPlot.ticks(xAxis.noOfTicks)
		}
		if (!yAxis.showTicks) {
			centerYAxisPlot.tickSize(0)
		} else {
			centerYAxisPlot.tickSize(-bounds.width)
		}

		let leftXAxis = g.append('g').attr('transform', `translate(${-labelArea}, ${bounds.height})`).call(leftXAxisPlot)

		if (xAxis?.labels?.left?.show) {
			let leftTextValue: any = xAxis?.labels?.left?.label
			let _leftSum: any
			let _lAdder: any = Utilities.getSumOfObjectKey(data, leftPrimaryDomainType)
			switch (xAxis?.labels?.left?.type) {
				case 'number':
					_leftSum = Utilities.curateValue({ value: +_lAdder, formatter: { format: '.2s', formatType: 'number' } })
					break
				case 'currency':
					_leftSum = Utilities.formatToCurrency(_lAdder)
					break
				default:
					return (_leftSum = _lAdder)
			}

			leftXAxis
				.append('text')
				.attr('y', -bounds.height)
				.attr('x', bounds.width / 2 - labelArea)
				.attr('dy', '0.8rem')
				.attr('dx', '-5rem')
				.attr('class', 'inner-axis-label')
				.text(leftTextValue)
			leftXAxis
				.append('text')
				.attr('y', -bounds.height)
				.attr('x', bounds.width / 2)
				.attr('dy', '1rem')
				.attr('dx', '-1.5rem')
				.attr('class', 'inner-axis-label-lg')
				.text(_leftSum)
		}

		let centerAxis = g
			.append('g')
			.attr('class', 'center-text')
			.attr('transform', `translate(${xFrom(0)}, 0)`)
			.call(centerYAxisPlot)
		if (yAxis?.fold) {
			d3.selectAll('.tick text').call(Utilities.wrap, 100, 'horizontal')
		}

		let rightXAxis = g
			.append('g')
			.attr('transform', `translate(${bounds.width / 2 + labelArea}, ${bounds.height})`)
			.call(rightXAxisPlot)

		if (xAxis?.labels?.right?.show) {
			let rightTextValue: any = xAxis?.labels?.right?.label
			let _rightSum: any
			let _rAdder: any = Utilities.getSumOfObjectKey(data, rightPrimaryDomainType)
			switch (xAxis?.labels?.right?.type) {
				case 'number':
					_rightSum = Utilities.curateValue({ value: +_rAdder, formatter: { format: '.2s', formatType: 'number' } })
					break
				case 'currency':
					_rightSum = Utilities.formatToCurrency(_rAdder)
					break
				default:
					return (_rightSum = _rAdder)
			}

			rightXAxis.append('text').attr('y', -bounds.height).attr('x', 0).attr('dy', '1rem').attr('dx', '1.5rem').attr('class', 'inner-axis-label-lg').text(_rightSum)

			rightXAxis.append('text').attr('y', -bounds.height).attr('x', 0).attr('dy', '0.8rem').attr('dx', '9rem').attr('class', 'inner-axis-label').text(rightTextValue)
		}

		if (!xAxis.hasOwnProperty('showDomain') || !xAxis.showDomain) {
			leftXAxis.select('.domain').remove()
			rightXAxis.select('.domain').remove()
		}

		if (!yAxis.hasOwnProperty('showDomain') || !yAxis.showDomain) {
			centerAxis.select('.domain').remove()
		}
		if (showTooltip) {
			createTooltip(id)
			leftBars
				.on('mousemove', (event, d: any) => {
					let mouseOverElem = event.target || event.currentTarget
					let mouseOverElemDataset = mouseOverElem.dataset
					const tooltipValue = mouseOverElemDataset?.tooltipvalue
					// const tooltipValue: any = Object.keys(d)
					// 	.map(
					// 		(key) => `${key}: ${d[key]}
					// 	`
					// 	)
					// 	?.join('')
					renderTooltip(true, event, id, tooltipValue)
				})
				.on('mouseout', (event) => {
					renderTooltip(false, event, id)
				})
			rightBars
				.on('mousemove', (event, d: any) => {
					let mouseOverElem = event.target || event.currentTarget
					let mouseOverElemDataset = mouseOverElem.dataset
					const tooltipValue = mouseOverElemDataset?.tooltipvalue
					// const tooltipValue: any = Object.keys(d)
					// 	.map(
					// 		(key) => `${key}: ${d[key]}
					// 	`
					// 	)
					// 	?.join('')
					renderTooltip(true, event, id, tooltipValue)
				})
				.on('mouseout', (event) => {
					renderTooltip(false, event, id)
				})
		}
		if (isClickable?.clickable) {
			leftBars.on('click', (e, d) => isClickable?.onChartItemClick && isClickable.onChartItemClick(d))
			rightBars.on('click', (e, d) => isClickable?.onChartItemClick && isClickable.onChartItemClick(d))
		}
	}
}

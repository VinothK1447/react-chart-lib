import * as d3 from 'd3'
import { generateNoDataBlock, getSVGInContext } from './SVG'
import { axisMapProps, axisScaleProps } from '../chart.types'
import Utilities from '../utils/Utilities'
import { margin } from '../utils/Constants'

let xAxisScale: any = null
let yAxisScale: any = null
let zAxisScale: any = null

export const generateAxes = ({ id, data, options, type }: any) => {
	xAxisScale = null
	yAxisScale = null
	zAxisScale = null
	let { xAxis, yAxis, grouped, stack, dualAxes } = options
	if (!Utilities.isEmpty(data) && (!Utilities.isEmpty(xAxis) || !Utilities.isEmpty(yAxis))) {
		let xAxisDomainType = xAxis?.type
		let yAxisDomainType = yAxis?.type
		let orient
		if (xAxisDomainType === 'string' || xAxisDomainType === 'date') {
			orient = 'vertical'
		} else {
			orient = 'horizontal'
		}
		if (xAxis) {
			generateAxis({ id, data, axisType: 'x', axisOpts: xAxis, orient, grouped, stack, dualAxes })
		}
		if (yAxis) {
			generateAxis({ id, data, axisType: 'y', axisOpts: yAxis, orient, grouped, stack, dualAxes })
		}
		if (grouped || stack) {
			let chosenAxisOpts = xAxis.domain ? xAxis : yAxis.domain ? yAxis : undefined
			if (chosenAxisOpts) {
				generateAxis({ id, data, axisType: 'z', axisOpts: chosenAxisOpts, orient, grouped, stack })
			}
		}
		if (xAxisScale && xAxisScale.hasOwnProperty('bandwidth') && xAxis?.fold) {
			d3.selectAll('.tick.x text').call(Utilities.wrap, xAxisScale.bandwidth(), orient, xAxis?.wrapLength)
		}
		if (yAxisScale && yAxisScale.hasOwnProperty('bandwidth') && yAxis?.fold) {
			d3.selectAll('.tick.y text').call(Utilities.wrap, yAxisScale.bandwidth(), orient, yAxis?.wrapLength)
		}
	} else {
		generateNoDataBlock({ id })
	}
}

const generateAxis = ({ id, data, axisType, axisOpts, orient, grouped, stack, dualAxes }: axisMapProps) => {
	let { domain, position, show, type, formatter, showTicks, showDomain, label } = axisOpts
	let { svg, bounds } = getSVGInContext({ id })
	let scaleType: any = null
	let extent = null
	let isNice = false
	let rangeProp = null
	let axisPlot: any = null
	let transformer: any = null
	let zScaleType: any = null
	let zRangeProp = null
	let zExtent = null
	const getMax: any = (data: any, domain: any) => Math.max(...data.map((obj: any) => Math.max(...domain.map((key: any) => obj[key]))))
	const getMin: any = (data: any, domain: any) => Math.min(...data.map((obj: any) => Math.min(...domain.map((key: any) => obj[key]))))

	if (!type) {
		generateNoDataBlock({ id, msg: 'Cannot infer scale type from data!' })
		throw new Error('Cannot infer scale type from data!')
	}
	if (axisType !== 'z') {
		let axisProp = generateAxisScale({ domain, position, type, formatter, data, axisType, showTicks, showDomain })
		scaleType = axisProp.scaleType
		extent = axisProp.extent
		isNice = axisProp.isNice
		axisPlot = axisProp.axisPlot

		if (!axisProp.extent) {
			if (Array.isArray(domain) && domain.length) {
				let max = getMax(data, domain)
				let min = getMin(data, domain)
				if (dualAxes) {
					scaleType?.domain(d3.extent([min, max]))
				} else {
					scaleType?.domain(d3.extent([0, max * 2]))
				}
			} else {
				let max: any
				if (stack) {
					data.forEach((datum: any) => {
						let numArr = Object.values(datum).filter((val) => typeof val === 'number')
						let total = numArr.reduce((a: any, b: any) => a + b)
						datum.total = total
						max = d3.max(data.map((obj: any) => Object.values(obj).filter((val) => typeof val === 'number')).flat())
					})
				} else {
					max = d3.max(data.map((obj: any) => Object.values(obj).filter((val) => typeof val === 'number')).flat())
				}
				if (stack) {
					data.forEach((datum: any) => {
						if (datum.hasOwnProperty('total')) {
							delete datum.total
						}
					})
				}
				scaleType?.domain([0, max])
			}
		} else {
			scaleType?.domain(extent)
		}
		if (axisType === 'x') {
			rangeProp = [0, bounds.width] //orient === 'horizontal' ? [bounds.y, bounds.width] : [0, bounds.width]
			xAxisScale = scaleType
			transformer = `translate(0, ${bounds.height})`
			scaleType.hasOwnProperty('padding') && scaleType.padding([0.2])
			if (label) {
				svg.append('text')
					.attr('transform', `translate(${bounds.width / 2},${bounds.height + margin.bottom})`)
					.attr('class', 'axis-label')
					.text(label)
			}
		}
		if (axisType === 'y') {
			rangeProp = [bounds.height, 0]
			yAxisScale = scaleType
			transformer = `translate(0, 0)`
			scaleType.hasOwnProperty('padding') && scaleType.padding([0.2])
			if (label) {
				svg.append('text')
					.attr('transform', 'rotate(-90)')
					.attr('y', 0 - margin.left)
					.attr('x', 0 - bounds.height / 2)
					.attr('dy', '1em')
					.attr('class', 'axis-label')
					.text(label)
			}
		}
	}
	if (axisType === 'z') {
		let axisProp = generateZAxisScale({ domain, position, type, formatter, data, axisType })
		zScaleType = axisProp.scaleType
		zExtent = axisProp.extent
		isNice = axisProp.isNice

		zRangeProp = yAxisScale.hasOwnProperty('bandwidth') ? [yAxisScale.bandwidth(), 0] : [0, xAxisScale.bandwidth()]
		zScaleType.range(zRangeProp)
		zScaleType.domain(zExtent)
		if (orient !== 'horizontal') {
			zScaleType.padding([0.5])
			zScaleType.paddingInner([0.05])
		}
		zAxisScale = zScaleType
	}

	scaleType?.range(rangeProp)

	if (show && axisType !== 'z') {
		let _tickSize = axisType === 'x' ? -bounds.height : -bounds.width
		if (!axisOpts.showTicks) {
			axisPlot.tickSize(0)
		} else {
			axisPlot.tickSize(_tickSize).tickSizeOuter(0)
		}
		if (axisOpts?.noOfTicks) {
			axisPlot.ticks(axisOpts.noOfTicks)
		}
		let axis = svg.append('g').call(axisPlot).attr('transform', transformer)
		axis.selectAll('.tick').attr('class', `tick ${axisType}`)
		if (!axisOpts.hasOwnProperty('showDomain') || !showDomain) {
			axis.select('.domain').remove()
		}
	}
	if (isNice) {
		scaleType?.nice()
	}
}

const generateAxisScale = ({ type, domain, data, position, formatter }: axisScaleProps) => {
	let scaleType: any = null
	let extent: any = null
	let isNice = false
	let axisPlot = null
	switch (type) {
		case 'number':
			scaleType = d3.scaleLinear()
			if (domain && !Array.isArray(domain)) {
				extent = d3.extent(data, (d: any) => d[domain])
			}
			isNice = true
			break
		case 'date':
			data?.forEach((datum: any) => {
				let type: any = typeof datum[domain]
				switch (type) {
					case 'number':
						datum[domain] = new Date(datum[domain], 1, 1)
						break
					case 'string':
						datum[domain] = new Date(datum[domain])
						break
					default:
						datum[domain] = datum[domain]
						break
				}
			})
			scaleType = d3.scaleTime()
			extent = d3.extent(data, (d: any) => d[domain])
			isNice = true
			break
		case 'string':
		case 'boolean':
		default:
			scaleType = d3.scaleBand()
			extent = data?.map((d: any) => d[domain])
			break
	}
	switch (position) {
		case 'top':
			axisPlot = d3.axisTop(scaleType)
			break
		case 'bottom':
			axisPlot = d3.axisBottom(scaleType)
			break
		case 'left':
			axisPlot = d3.axisLeft(scaleType)
			break
		case 'right':
			axisPlot = d3.axisRight(scaleType)
			break
	}
	if (formatter) {
		axisPlot = Utilities.curateAxis({ axisPlot, formatter })
	}
	return {
		scaleType,
		extent,
		isNice,
		axisPlot
	}
}

const generateZAxisScale = ({ type, domain, data, position, axisType }: axisScaleProps) => {
	let scaleType: any
	let extent: any
	let isNice = false
	let subgroup: string[] = []
	if (axisType === 'z') {
		data.forEach((datum: any) => {
			subgroup = Object.keys(datum).filter((val) => val !== domain)
		})
	}
	switch (type) {
		case 'number':
			scaleType = d3.scaleLinear()
			extent = d3.extent(data, (d: any) => {
				if (domain) {
					return d[domain]
				} else {
					let tmpArr: any[] = Object.values(d).filter((val) => typeof val === 'number')
					return Math.max(...tmpArr)
				}
			})
			isNice = true
			break
		case 'date':
			data?.forEach((datum: any) => {
				datum[domain] = new Date(datum[domain])
			})
			scaleType = d3.scaleTime()
			extent = d3.extent(data, (d: any) => d[domain])
			isNice = true
			break
		case 'string':
		case 'boolean':
			scaleType = d3.scaleBand()
			extent = subgroup
			break
	}
	return {
		scaleType,
		extent,
		isNice
	}
}

export const getXAxisScale = () => {
	return xAxisScale
}

export const getYAxisScale = () => {
	return yAxisScale
}

export const getZAxisScale = () => {
	return zAxisScale
}

export { xAxisScale, yAxisScale, zAxisScale }

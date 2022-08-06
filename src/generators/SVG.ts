import * as d3 from 'd3'
import { margin } from '../utils/Constants'
import { svgProps } from '../chart.types'

const NO_DATA_AVAILABLE_TEXT = 'Data not available!'

export const createSVG = (props: svgProps) => {
	const { id } = props
	let container = document.querySelector(`#${id}`) as HTMLDivElement
	const { height, width } = container.getBoundingClientRect()
	const viewBox = { x: 0, y: 0 }
	d3.select(`#${id}`)
		.append('svg')
		.attr('preserveAspectRatio', 'xMidYMid meet')
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', `${viewBox.x} ${viewBox.y} ${width + margin.left} ${height + margin.bottom}`)
}

export const getSVGInContext = ({ id }: svgProps) => {
	const container = document.querySelector(`#${id}`) as HTMLDivElement
	let svg = d3.select(`#${id}`).select('svg')
	let svgEl = container.querySelector('svg') as SVGElement
	let bounds = svgEl.getBoundingClientRect()
	// svg.attr('class', 'drop-shadow')
	return { svg, bounds }
}

export const generateNoDataBlock = ({ id, msg }: svgProps) => {
	let { svg } = getSVGInContext({ id })
	svg.append('text')
		.text(msg ? msg : NO_DATA_AVAILABLE_TEXT)
		.attr('x', '50%')
		.attr('y', '50%')
		.attr('fill', '#000')
}

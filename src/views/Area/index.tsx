import React, { useEffect, useLayoutEffect } from 'react'
import { areaChartProps } from '../../chart.types'
import { createSVG } from '../../generators/SVG'
import { generateAxes } from '../../generators/Axes'
import { generateAreaAndLine, generateStackedArea } from '../../generators/Area'
import { setColorScheme } from '../../generators/Colors'
import classNames from 'classnames'

const AreaChart = (props: areaChartProps) => {
	const { id, data, options, classes, colors, type } = props
	useLayoutEffect(() => {
		let chartContainer = document.getElementById(id)
		if (!chartContainer) {
			let rootEl = document.getElementById('root')
			let chartContainer = document.createElement('div')
			chartContainer.setAttribute('id', id)
			chartContainer.setAttribute('class', classNames('chart-container', classes))
			rootEl?.appendChild(chartContainer)
		}

		createSVG({ id })
		setColorScheme(colors || null)
		generateAxes({ id, data, options, type })
		if (options?.stacked) {
			generateStackedArea({ id, data, options })
		} else {
			generateAreaAndLine({ id, data, options })
		}
	}, [])
	useEffect(() => {
		let chartContainer = document.getElementById(id)!
		window.setTimeout(() => {
			let svgEl = chartContainer.querySelector('svg')!
			let bbox: any = svgEl.getBBox()
			svgEl.setAttribute('viewBox', bbox.x + ' ' + bbox.y + ' ' + bbox.width + ' ' + bbox.height)
		}, 100)
	}, [])

	return <></>
}

export default AreaChart

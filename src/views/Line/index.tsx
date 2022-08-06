import React, { useEffect, useLayoutEffect } from 'react'
import { lineChartProps } from '../../chart.types'
import { createSVG } from '../../generators/SVG'
import { generateAxes } from '../../generators/Axes'
import { generateLines } from '../../generators/Line'
import { setColorScheme } from '../../generators/Colors'
import classNames from 'classnames'

const LineChart = (props: lineChartProps) => {
	const { id, data, options, classes, colors } = props
	useLayoutEffect(() => {
		let chartContainer = document.getElementById(id)
		if (!chartContainer) {
			let rootEl = document.getElementById('root')
			chartContainer = document.createElement('div')
			chartContainer.setAttribute('id', id)
			chartContainer.setAttribute('class', classNames('chart-container', classes))
			rootEl?.appendChild(chartContainer)
		}

		createSVG({ id, classes })
		setColorScheme(colors || null)
		generateAxes({ id, data, options })
		generateLines({ id, data, options })
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

export default LineChart

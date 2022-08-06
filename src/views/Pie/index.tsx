import React, { useEffect, useLayoutEffect } from 'react'
import { pieChartProps } from '../../chart.types'
import { setupPie } from '../../generators/Pie'
import { createSVG } from '../../generators/SVG'
import { setColorScheme } from '../../generators/Colors'
import classNames from 'classnames'

const PieChart = (props: pieChartProps) => {
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
		setupPie({ id, data, options })
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

export default PieChart

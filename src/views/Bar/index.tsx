import React, { useLayoutEffect } from 'react'
import { generateAxes } from '../../generators/Axes'
import { generateBars, generateDualAxesLinedBar, generateGroupedBars, generateStackedBars, generateDualAxesCenterTextBars } from '../../generators/Bar'
import { createSVG } from '../../generators/SVG'
import { barChartProps } from '../../chart.types'
import { setColorScheme } from '../../generators/Colors'
import classNames from 'classnames'

const BarChart = (props: barChartProps) => {
	const { id, data, options, classes, colors, type } = props
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
		let _colors: any = colors
		if (colors && colors.length < data.length) {
			let lastDefinedValue = colors[colors.length - 1]
			do {
				_colors.push(lastDefinedValue)
			} while (_colors.length <= data.length)
		}
		setColorScheme(_colors || null)
		if (!options.centerText) {
			generateAxes({ id, data, options, type })
			if (options?.grouped) {
				generateGroupedBars({ id, data, options })
			} else if (options?.stack) {
				generateStackedBars({ id, data, options })
			} else if (options?.dualAxes && options?.line) {
				generateDualAxesLinedBar({ id, data, options })
			} else if (!options?.grouped && !options?.stack && !options?.line) {
				generateBars({ id, data, options })
			}
		}
		if (options.centerText) {
			generateDualAxesCenterTextBars({ id, data, options })
		}
	}, [])

	return <></>
}

export default BarChart

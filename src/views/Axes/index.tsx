import React, { useLayoutEffect } from 'react'
import { axesProps } from '../../chart.types'
import { createSVG } from '../../generators/SVG'
import { generateAxes } from '../../generators/Axes'
import { setColorScheme } from '../../generators/Colors'
import classNames from 'classnames'

const Axes = (props: axesProps) => {
	const { id, data, options, classes, colors } = props
	useLayoutEffect(() => {
		let chartContainer = document.getElementById(id)
		if (!chartContainer) {
			let rootEl = document.getElementById('root')
			let chartContainer = document.createElement('div')
			chartContainer.setAttribute('id', id)
			chartContainer.setAttribute('class', classNames('chart-container', classes))
			rootEl?.appendChild(chartContainer)
		}
		createSVG({ id, classes })
		setColorScheme(colors || null)
		generateAxes({ id, data, options })
	}, [])

	return <></>
}

export default Axes

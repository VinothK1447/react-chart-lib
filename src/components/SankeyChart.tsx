import React, { lazy, Suspense } from 'react'
import classNames from 'classnames'
import '../styles/index.css'
import { chartOptions } from '../chart.types'
import { setColorScheme } from '../generators/Colors'

const Sankey = lazy(() => import('../views/Sankey'))

const SankeyChart = (props: chartOptions) => {
	const { id, type, classes, options, colors } = props
	let Types: any = {
		Sankey: Sankey
	}
	let ChartType = Types[type]
	setColorScheme(colors || null)

	return (
		<Suspense fallback={'Loading...'}>
			<div id={id} className={classNames('sankey-chart-container', classes)}>
				<ChartType {...props} />
			</div>
		</Suspense>
	)
}
export default SankeyChart

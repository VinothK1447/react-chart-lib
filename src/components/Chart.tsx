import React, { lazy, Suspense } from 'react'
import '../styles/index.css'
import { chartOptions } from '../chart.types'

const AreaChart = lazy(() => import('../views/Area'))
const BarChart = lazy(() => import('../views/Bar'))
const LineChart = lazy(() => import('../views/Line'))
const PieChart = lazy(() => import('../views/Pie'))
const SunburstChart = lazy(() => import('../views/Sunburst'))

const Chart = (props: chartOptions) => {
	const { type } = props
	let Types: any = {
		Area: AreaChart,
		Bar: BarChart,
		Line: LineChart,
		Pie: PieChart,
		Sunburst: SunburstChart
	}
	let ChartType = Types[type]

	return (
		<Suspense fallback={'Loading...'}>
			<ChartType {...props} />
		</Suspense>
	)
}
export default Chart

import React, { lazy, Suspense } from 'react'
import classNames from 'classnames'
import { axesProps } from '../chart.types'

const AxesPlot = lazy(() => import('../views/Axes'))

const Axes = (props: axesProps) => {
	const { id, classes } = props

	return (
		<Suspense fallback={'Loading...'}>
			{/* <div id={id} className={classNames('chart-container', classes)}> */}
			<AxesPlot {...props} />
			{/* </div> */}
		</Suspense>
	)
}
export default Axes

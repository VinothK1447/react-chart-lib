import React, { useEffect, useState } from 'react'
import { lineBarProps } from '../chart.types'
import '../styles/index.css'
import { DARK_COLORS, defaultColorScheme, LIGHT_COLORS } from '../generators/Colors'
import Utilities from '../utils/Utilities'
import classNames from 'classnames'

const LineBar = (props: lineBarProps) => {
	const { id, data, colors, options, classes } = props
	const { domain = '', type = '', showTooltip = false, labels, wrapLength = 35 } = options
	const [widgetData, setWidgetData] = useState<Array<any>>()
	useEffect(() => {
		let _arrMax = Math.max(...data.map((el: any) => el[type]))
		data.forEach((el: any) => {
			let sliced = ''
			el.percentage = Math.round((el[type] / _arrMax) * 100)
			if (el[domain].length > wrapLength) {
				sliced += el[domain].slice(0, wrapLength)
				sliced += '...'
				el.sliced = sliced
			}
		})
		setWidgetData(data)
	}, [])
	return (
		<>
			{widgetData &&
				widgetData.map((pb: any, i: number) => (
					<div key={i} className={classNames('line-bar', classes)}>
						<div className={classNames(labels?.preLabel.preLabelClass)} title={pb[domain]}>
							{pb['sliced'] || pb[domain]}
						</div>
						<div className={classNames('line-bar-percentage')} style={{ width: `${pb['percentage']}%`, background: colors ? colors[i] : defaultColorScheme[i] }}></div>
						<div className={classNames(labels?.postLabel.postLabelClass)}>{Utilities.formatToCurrency(pb[type])}</div>
					</div>
				))}
		</>
	)
}

export default LineBar

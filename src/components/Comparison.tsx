import React, { useLayoutEffect } from 'react'
import { comparisonChartProps } from '../chart.types'
import '../styles/index.css'
import { defaultColorScheme } from '../generators/Colors'
import Utilities from '../utils/Utilities'
import classNames from 'classnames'

const Comparison = (props: comparisonChartProps) => {
	const { id, data, colors, options, classes } = props
	const { showTooltip = false, labels } = options

	useLayoutEffect(() => {
		if (document.querySelectorAll(`[class*='chart-container']`).length) {
			document.querySelectorAll(`[class*='chart-container']`).forEach((element) => {
				element.remove()
			})
		}
	}, [])

	return (
		<>
			{data &&
				data.map((comp: any, indx: number) => (
					<div id={`${id}-${indx}`} key={`${id}-${indx}`} className={classNames('comparison-container', classes)}>
						{Object.keys(comp).map((elem, idx) => (
							<div key={`${elem}-${idx}`} className={`comparison-line-container`} style={{ width: `${comp[elem].percent < 25 ? 25 : comp[elem].percent}%` }}>
								{idx === 0 && labels && labels.showLabel && (
									<div className="comparison-labels">
										<span className="comparison-label-hdr" style={{ color: colors ? colors[idx] : defaultColorScheme[idx] }}>{`${elem}:`}</span> <span className="comparison-label-val">{`${Utilities.formatToCurrency(comp[elem].value, labels?.formatter?.format)}`}</span>
										<span className="comparison-labels-delimiter-top" style={{ backgroundColor: colors ? colors[idx] : defaultColorScheme[idx] }}></span>
									</div>
								)}
								<div className="comparison-bar" style={{ backgroundColor: colors ? colors[idx] : defaultColorScheme[idx], width: `${comp[elem].percent < 25 ? 25 : comp[elem].percent}%` }} title={showTooltip ? `${elem}: ${comp[elem].value}` : ''}></div>
								{idx > 0 && labels && labels.showLabel && (
									<div className="comparison-labels">
										<span className="comparison-label-hdr" style={{ color: colors ? colors[idx] : defaultColorScheme[idx] }}>{`${elem}:`}</span> <span className="comparison-label-val">{`${Utilities.formatToCurrency(comp[elem].value, labels?.formatter?.format)}`}</span>
										<span className="comparison-labels-delimiter-bottom" style={{ backgroundColor: colors ? colors[idx] : defaultColorScheme[idx] }}></span>
									</div>
								)}
							</div>
						))}
					</div>
				))}
		</>
	)
}

export default Comparison

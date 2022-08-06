import React, { useLayoutEffect } from 'react'
import { progressBarProps } from '../chart.types'
import '../styles/index.css'
import { defaultColorScheme } from '../generators/Colors'
import Utilities from '../utils/Utilities'
import classNames from 'classnames'

const ProgressBar = (props: progressBarProps) => {
	const { id, data, colors, options, classes } = props
	const { domain = '', type = '', showTooltip = false, labels } = options
	const calculatePercentage = (obj: any) => {
		return (obj[domain] / obj[type]) * 100
	}
	useLayoutEffect(() => {
		if (document.querySelectorAll(`[class*='chart-container']`).length) {
			document.querySelectorAll(`[class*='chart-container']`).forEach((element) => {
				element.remove()
			})
		}
	}, [])

	return (
		<>
			{data.map((pb: any, i: number) => {
				let percent = calculatePercentage(pb)
				return (
					<div id={id} className={classNames('progress-container', classes)} key={`progress-bar-container-${id}-${i}`}>
						<div className="progress-labels">
							{labels && labels.showPreLabel && (
								<span>
									<span className="progress-label-hdr" style={{ color: colors ? colors[0] : defaultColorScheme[0] }}>{`${domain}:`}</span> <span className="progress-label-val">{`${Utilities.formatToCurrency(+pb[domain], labels?.formatter?.format)}`}</span>
								</span>
							)}
							{labels && labels.showPostLabel && (
								<span>
									<span className="progress-label-hdr" style={{ color: colors ? colors[1] : defaultColorScheme[1] }}>{`${type}:`}</span> <span className="progress-label-val">{`${Utilities.formatToCurrency(+pb[type], labels?.formatter?.format)}`}</span>
								</span>
							)}
						</div>
						<div className="progress-bar" style={{ backgroundColor: colors ? colors[1] : defaultColorScheme[1] }} title={showTooltip ? `${domain}: ${pb[domain]}, ${type}: ${pb[type]}` : ''}>
							<div className="filler" style={{ background: colors ? colors[0] : defaultColorScheme[0], width: `${percent}%` }}></div>
						</div>
					</div>
				)
			})}
		</>
	)
}

export default ProgressBar

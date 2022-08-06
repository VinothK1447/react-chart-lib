import React, { useEffect, useLayoutEffect } from 'react'
import { sankeyChartProps } from 'chart.types'
import SankeyUtils from '../../utils/SankeyUtils'
import { setColorScheme } from '../../generators/Colors'

const SankeyChart = (props: sankeyChartProps) => {
	const { id, data, options, colors } = props
	useLayoutEffect(() => {
		const SankeyUtil = new SankeyUtils()
		let { header } = options
		if (header && Object.keys(header).length) {
			const container = document.querySelector(`#${id}`) as HTMLDivElement
			let { title, tabsRequired } = header
			if (title) {
				container.insertAdjacentHTML('afterbegin', `<div id='titleEl' class='sankey-title'>${title}</div>`)
			}
			if (tabsRequired) {
				let titleEl = document.querySelector('#titleEl')
				let listEl = document.createElement('ul')
				listEl.setAttribute('class', 'tab-ul')
				let tabNames = data.tabs.map((obj: any) => obj.name)
				tabNames.forEach((el: string, idx: number) => {
					let liEl = document.createElement('li')
					liEl.innerHTML = el
					liEl.setAttribute('id', `${idx}`)
					liEl.setAttribute('class', SankeyUtil.selectedId === idx ? 'selected' : '')
					liEl.addEventListener('click', (ev: any) => {
						SankeyUtil.handleListElemClick(ev)
					})
					listEl.appendChild(liEl)
				})
				titleEl?.after(listEl)
			}
		}

		SankeyUtil.createSVG({ id, header })
		setColorScheme(colors || null)
		SankeyUtil.id = id
		SankeyUtil.sankeyData = data
		SankeyUtil.options = options
		SankeyUtil.generateSankeyChart()
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

export default SankeyChart

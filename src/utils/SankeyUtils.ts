import * as d3 from 'd3'
// import { sankey, sankeyLinkHorizontal } from 'd3-sankey'
import * as d3Sankey from 'd3-sankey'
import { sankeyChartProps, svgProps, svgWithHeaderProps } from 'chart.types'
import { MouseEvent } from 'react'

export default class SankeyUtils {
	selectedId: number = 0
	id: string = ''
	currentTab: any = ''
	sankeyData: any = {}
	options: any = {}
	sankeyNode: any = undefined
	svgHeight: number = 0
	svgWidth: number = 0

	private static colorSchemes = [d3.schemeCategory10, d3.schemeAccent, d3.schemeDark2, d3.schemePaired, d3.schemeSet1, d3.schemeSet2, d3.schemeTableau10]
	private static defaultColorScheme = SankeyUtils.colorSchemes[Math.round(Math.random() * 10)] || d3.schemeCategory10

	createSVG(props: svgWithHeaderProps) {
		const { id, header } = props
		const container = document.querySelector(`#${id}`) as HTMLDivElement
		let headerHeight: number = 0
		if (header && Object.keys(header).length) {
			let titleEl = document.querySelector('#titleEl') as HTMLDivElement
			let listEl = document.querySelector('.tab-ul') as HTMLUListElement
			headerHeight = titleEl.getBoundingClientRect().height + listEl.getBoundingClientRect().height
		}
		const { height, width } = container.getBoundingClientRect()
		const viewBox = { x: 0, y: 0 }
		this.svgHeight = height - headerHeight - 20
		this.svgWidth = width - 25
		return d3.select(`#${id}`).append('svg').attr('viewBox', `${viewBox.x} ${viewBox.y} ${width} ${this.svgHeight}`)
	}

	getSVGInContext({ id }: svgProps) {
		const container = document.querySelector(`#${id}`) as HTMLDivElement
		let svg = container.querySelector('svg') as SVGElement
		let bounds = svg.getBoundingClientRect()
		// d3.select(svg).attr('class', 'drop-shadow')
		return { svg, bounds }
	}

	adjustBrightness(col: string, amt: number) {
		if (!col) {
			col = '#087ee9'
		}
		var usePound = false

		if (col[0] === '#') {
			col = col.slice(1)
			usePound = true
		}

		var R = parseInt(col.substring(0, 2), 16)
		var G = parseInt(col.substring(2, 4), 16)
		var B = parseInt(col.substring(4, 6), 16)

		// to make the colour less bright than the input
		// change the following three "+" symbols to "-"
		R = R + amt
		G = G + amt
		B = B + amt

		R = R > 255 ? 255 : R < 0 ? 0 : R
		G = G > 255 ? 255 : G < 0 ? 0 : G
		B = B > 255 ? 255 : B < 0 ? 0 : B

		var RR = R.toString(16).length == 1 ? `0${R.toString(16)}` : R.toString(16)
		var GG = G.toString(16).length == 1 ? `0${G.toString(16)}` : G.toString(16)
		var BB = B.toString(16).length == 1 ? `0${B.toString(16)}` : B.toString(16)
		return usePound ? `#${RR}${GG}${BB}` : `${RR}${GG}${BB}`
	}

	handleListElemClick(ev: MouseEvent) {
		let { target } = ev
		let currLiEl = target as HTMLLIElement
		let { id } = currLiEl
		let allLiEls = currLiEl.closest('ul')?.querySelectorAll('li')
		allLiEls?.forEach((el) => {
			el.classList.remove('selected')
			if (id === el.id) {
				el.classList.add('selected')
			}
		})
		this.selectedId = +id
		this.currentTab = this.sankeyData.tabs[this.selectedId]
		this.sankeyNode = null
		this.renderSankey()
	}

	generateSankeyChart() {
		this.currentTab = this.sankeyData.tabs[this.selectedId]
		this.renderSankey()
	}

	generateDefs(node: any, gradientsData: any) {
		const def = d3.select(node).append('defs')
		const linearGradient = def
			.selectAll('.linear-gradient')
			.data(gradientsData)
			.enter()
			.append('linearGradient')
			.attr('id', (d: any) => (d.source && d.target ? `linear-gradient-link-${d.index}` : `linear-gradient-${d.index}`))
			.attr('x1', '0%')
			.attr('y1', '0%')
			.attr('x2', '100%')
			.attr('y2', '0%')

		//Set the color for the start (0%)
		linearGradient
			.append('stop')
			.attr('offset', '0%')
			.attr('stop-color', (d: any) => this.adjustBrightness(SankeyUtils.defaultColorScheme[d.index], -55))

		//Set the color for the end (100%)
		linearGradient
			.append('stop')
			.attr('offset', '100%')
			.attr('stop-color', (d: any) => this.adjustBrightness(SankeyUtils.defaultColorScheme[d.index], 55))
	}

	generateLinks(svg: any, links: any) {
		d3.select(svg)
			.selectAll('.sankey-link')
			.data(links)
			.enter()
			.append('path')
			.attr('class', 'sankey-link')
			.attr('d', (d: any) => d3Sankey.sankeyLinkHorizontal()(d))
			.style('stroke', (d: any, index: number) => `url(#linear-gradient-link-${index})`)
			.style('stroke-width', (d: any) => {
				return Math.min(d.value < 42 ? 42 : d.value, d.y0, d.y1, d.width)
			})
			.sort((a: any, b: any) => b.dy0 - a.dy0)
	}

	renderSankey() {
		let { svg, bounds } = this.getSVGInContext({ id: this.id })
		//remove everything in svg and re-create
		d3.select(svg).selectAll('*').remove()
		this.sankeyNode = svg
		const node = this.sankeyNode
		d3.select(node).attr('width', this.svgWidth).attr('height', this.svgHeight).append('g').attr('transform', `translate(${bounds.x}, ${bounds.y})`)

		const graph: any = this.currentTab
		const nodeWidth = 200
		const sankeyGraph = d3Sankey
			.sankey()
			//@ts-ignore
			.nodeId((d: any, index: number) => index)
			.nodeWidth(nodeWidth - d3Sankey.sankey().nodeWidth())
			.nodePadding(40)
			.size([this.svgWidth, this.svgHeight])

		sankeyGraph(graph)

		//define the linear gradients
		const nodesData = graph.nodes.filter((d: any) => !d.color)
		const linksData = graph.links.filter((d: any) => !d.color)
		const gradientsData = [...nodesData, ...linksData]
		this.generateDefs(node, gradientsData)
		this.generateLinks(svg, graph.links)

		var nodeG = d3
			.select(svg)
			.append('g')
			.selectAll('.node')
			.data(graph.nodes)
			.enter()
			.append('g')
			.attr('class', (d: any) => (this.options.circularNodes && this.options.circularNodes.includes(d.index) ? 'node circle' : 'node rect'))
			.attr('transform', (d: any) => `translate(${d.x0}, ${d.y0})`)
		d3.select(svg)
			.selectAll('.node.circle')
			.append('circle')
			.attr('class', 'node-elem')
			.attr('r', (d: any) => Math.pow(d3Sankey.sankey().nodeWidth(), 2) / 2)
			.attr('cx', d3Sankey.sankey().nodeWidth() / 2)
			.attr('cy', d3Sankey.sankey().nodeWidth() / 2)
			.attr('fill', (d: any) => d.color || `url(#linear-gradient-${d.index})`)
			.attr('transform', (d: any) => `translate(${bounds.x * 1.5}, ${bounds.y * 2.25})`)

		d3.select(svg)
			.selectAll('.node.rect')
			.append('rect')
			.attr('class', 'node-elem')
			.attr('x', 0)
			.attr('y', 0)
			.attr('height', (d: any, i) => (d.height = d.y1 - d.y0)) // return (d.height = d.y1 - d.y0 < 70 ? 70 : d.y1 - d.y0 > 350 ? 350 : d.y1 - d.y0)
			.attr('width', d3Sankey.sankey().nodeWidth() * 8)
			.style('fill', (d: any) => d.color || `url(#linear-gradient-${d.index})`)
			.style('rx', 6)

		if (this.options.textNodes && this.options.textNodes.length) {
			let _num: number = 0.2
			this.options.textNodes.forEach((textNode: any, i: number) => {
				nodeG
					.append('text')
					.attr('x', d3Sankey.sankey().nodeWidth() * 2)
					.attr('y', (d: any) => {
						return d.height * _num
					})
					.html((d: any) => d[textNode.key])
					.attr('class', textNode.class)
				_num += _num
			})
		}
	}
}

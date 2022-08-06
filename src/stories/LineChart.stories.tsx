import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Chart from '../components/Chart'
import { lineStub, singlelineStub } from '../stub/index'

export default {
	component: Chart,
	title: 'Components/Chart/Line',
	args: {
		parent: 'root',
		classes: 'demo-container'
	}
} as ComponentMeta<typeof Chart>

const Template: ComponentStory<typeof Chart> = (args) => <Chart {...args} />

export const Lines = Template.bind({})
Lines.args = {
	id: 'line-chart',
	type: 'Line',
	data: lineStub,
	options: {
		showTooltip: true,
		group: 'symbol',
		legend: {
			show: true,
			position: 'top-right',
			label: ['key']
		},
		xAxis: {
			formatter: {
				formatType: 'date',
				format: '%b %y'
			},
			show: true,
			position: 'bottom',
			domain: 'date',
			type: 'date',
			showTicks: true
		},
		yAxis: {
			show: true,
			position: 'left',
			domain: 'price',
			type: 'number'
		}
	}
}

export const SingleLine = Template.bind({})
SingleLine.args = {
	id: 'single-line-chart',
	type: 'Line',
	data: singlelineStub,
	options: {
		showTooltip: true,
		group: 'symbol',
		legend: {
			show: true,
			position: 'top-right',
			label: ['key']
		},
		xAxis: {
			formatter: {
				formatType: 'date',
				format: '%b %y'
			},
			show: true,
			position: 'bottom',
			domain: 'date',
			type: 'date'
		},
		yAxis: {
			show: true,
			position: 'left',
			domain: 'price',
			type: 'number'
		}
	}
}

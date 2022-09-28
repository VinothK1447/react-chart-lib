import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Chart from '../components/Chart'
import { barStub } from '../stub/index'

export default {
	component: Chart,
	title: 'Components/Chart/Bar',
	args: {
		parent: 'root',
		classes: 'demo-container'
	}
} as ComponentMeta<typeof Chart>

const Template: ComponentStory<typeof Chart> = (args) => <Chart {...args} />

export const VerticalBar = Template.bind({})
VerticalBar.args = {
	id: 'vertical-bar-chart',
	type: 'Bar',
	data: barStub,
	options: {
		showTooltip: true,
		labels: {
			show: true
		},
		xAxis: {
			show: true,
			position: 'bottom',
			domain: 'type',
			type: 'string',
			label: 'Type',
			fold: true
		},
		yAxis: {
			show: true,
			position: 'left',
			formatter: {
				formatType: 'number',
				format: '.2s'
			},
			domain: 'amount',
			type: 'number',
			label: 'Value',
			showTicks: true
		},
		isClickable: {
			clickable: true,
			onChartItemClick: (data) => {
				console.log(data)
			}
		}
	}
}

export const HorizontalBar = Template.bind({})
HorizontalBar.args = {
	id: 'horizontal-bar-chart',
	type: 'Bar',
	data: barStub,
	options: {
		showTooltip: true,
		labels: {
			show: true
		},
		xAxis: {
			show: true,
			formatter: {
				formatType: 'number',
				format: '.2s'
			},
			position: 'bottom',
			domain: 'amount',
			type: 'number',
			label: 'Value',
			showTicks: true,
			noOfTicks: 5
		},
		yAxis: {
			show: true,
			position: 'left',
			domain: 'type',
			type: 'string',
			label: 'Type',
			fold: true
		},
		isClickable: {
			clickable: true,
			onChartItemClick: (data) => {
				console.log(data)
			}
		}
	}
}

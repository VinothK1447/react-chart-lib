import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Chart from '../components/Chart'
import { groupedBarStub } from '../stub/index'

export default {
	component: Chart,
	title: 'Components/Chart/Bar',
	args: {
		parent: 'root',
		classes: 'demo-container'
	}
} as ComponentMeta<typeof Chart>

const Template: ComponentStory<typeof Chart> = (args) => <Chart {...args} />

export const VerticalStackedBar = Template.bind({})
VerticalStackedBar.args = {
	id: 'vertical-stackedBar',
	type: 'Bar',
	data: groupedBarStub,
	options: {
		stack: true,
		legend: {
			show: true,
			position: 'top-right'
		},
		xAxis: {
			show: true,
			position: 'bottom',
			domain: 'state',
			type: 'string'
		},
		yAxis: {
			show: true,
			position: 'left',
			formatter: {
				formatType: 'number',
				format: '.2s'
			},
			type: 'number'
		},
		isClickable: {
			clickable: true,
			onChartItemClick: (data) => {
				console.log(data)
			}
		}
	}
}

export const HorizontalStackedBar = Template.bind({})
HorizontalStackedBar.args = {
	id: 'horizontal-stackedBar',
	type: 'Bar',
	data: groupedBarStub,
	options: {
		stack: true,
		showTooltip: true,
		legend: {
			show: true,
			position: 'top-right'
		},
		xAxis: {
			show: true,
			position: 'bottom',
			formatter: {
				formatType: 'number',
				format: '.2s'
			},
			type: 'number'
		},
		yAxis: {
			show: true,
			position: 'left',
			domain: 'state',
			type: 'string'
		},
		isClickable: {
			clickable: true,
			onChartItemClick: (data) => {
				console.log(data)
			}
		}
	}
}

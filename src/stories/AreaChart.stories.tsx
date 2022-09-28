import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Chart from '../components/Chart'
import { areaStub, stackedAreaStub, stackedAreaStubInteractive } from '../stub/index'
import { DARK_COLORS } from '../generators/Colors'

export default {
	component: Chart,
	title: 'Components/Chart/Area',
	args: {
		parent: 'root',
		classes: 'demo-container'
	}
} as ComponentMeta<typeof Chart>

const Template: ComponentStory<typeof Chart> = (args) => <Chart {...args} />

export const SimpleArea = Template.bind({})
SimpleArea.args = {
	id: 'area-chart-container',
	type: 'Area',
	data: areaStub,
	colors: DARK_COLORS.AREA,
	options: {
		showTooltip: true,
		xAxis: {
			show: true,
			position: 'bottom',
			domain: 'year',
			type: 'date'
		},
		yAxis: {
			show: true,
			position: 'left',
			domain: 'price',
			type: 'number',
			showTicks: true,
			noOfTicks: 3
		},
		isClickable: {
			clickable: true,
			onChartItemClick: (data) => {
				console.log(data)
			}
		}
	}
}

export const StackedArea = Template.bind({})
StackedArea.args = {
	id: 'stackedarea-chart-container',
	type: 'Area',
	data: stackedAreaStub,
	colors: DARK_COLORS.BAR,
	options: {
		stacked: true,
		legend: {
			show: true,
			position: 'bottom-center'
		},
		xAxis: {
			show: true,
			position: 'bottom',
			formatter: {
				formatType: 'date',
				format: '%Y'
			},
			domain: 'year',
			type: 'date'
		},
		yAxis: {
			show: true,
			position: 'left',
			domain: ['tests', 'odis', 't20is', 't20s'],
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

export const InteractiveStackedArea = Template.bind({})
InteractiveStackedArea.args = {
	id: 'interactive-area-chart-container',
	type: 'Area',
	data: stackedAreaStubInteractive,
	options: {
		stacked: true,
		interactive: true,
		xAxis: {
			show: true,
			position: 'bottom',
			formatter: {
				formatType: 'date',
				format: '%Y'
			},
			domain: 'year',
			type: 'date'
		},
		yAxis: {
			show: true,
			position: 'left',
			domain: ['Net', 'Gross', 'Other'],
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

import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Chart from '../components/Chart'
import { dualAxesBarStub } from '../stub/index'

export default {
	component: Chart,
	title: 'Components/Chart/Bar',
	args: {
		parent: 'root',
		classes: 'demo-container'
	}
} as ComponentMeta<typeof Chart>

const Template: ComponentStory<typeof Chart> = (args) => <Chart {...args} />

export const VerticalDualAxesBar = Template.bind({})
VerticalDualAxesBar.args = {
	id: 'vertical-dualaxes-bar-chart',
	type: 'Bar',
	data: dualAxesBarStub,
	options: {
		dualAxes: true,
		xAxis: {
			show: true,
			position: 'bottom',
			domain: 'label',
			type: 'string'
		},
		yAxis: {
			show: true,
			position: 'left',
			formatter: {
				formatType: 'number',
				format: '.2s'
			},
			domain: 'value',
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

export const HorizontalDualAxesBar = Template.bind({})
HorizontalDualAxesBar.args = {
	id: 'horizontal-dualaxes-bar-chart',
	type: 'Bar',
	data: dualAxesBarStub,
	options: {
		dualAxes: true,
		xAxis: {
			show: true,
			position: 'bottom',
			formatter: {
				formatType: 'number',
				format: '.2s'
			},
			domain: 'value',
			type: 'number'
		},
		yAxis: {
			show: true,
			position: 'left',
			domain: 'label',
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

import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Chart from '../components/Chart'
import { pieStub } from '../stub/index'
import { LIGHT_COLORS } from '../generators/Colors'

export default {
	component: Chart,
	title: 'Components/Chart/Pie & Donut',
	args: {
		parent: 'root',
		classes: 'demo-container'
	}
} as ComponentMeta<typeof Chart>

const Template: ComponentStory<typeof Chart> = (args) => <Chart {...args} />

export const Donut = Template.bind({})
Donut.args = {
	id: 'donut-chart',
	type: 'Pie',
	data: pieStub,
	colors: LIGHT_COLORS.PIE,
	options: {
		showTooltip: true,
		centerText: {
			show: true,
			label: 'Total Value',
			type: 'number',
			formatter: {
				format: '.2s',
				formatType: 'number'
			}
		},
		isDonut: true,
		legend: {
			show: true,
			position: 'center-right',
			label: ['browser']
		},
		// arcSize: 'lg',
		domain: 'browser',
		type: 'percent'
	}
}

export const Pie = Template.bind({})
Pie.args = {
	id: 'pie-chart',
	type: 'Pie',
	data: pieStub,
	options: {
		showTooltip: true,
		legend: {
			show: true,
			position: 'center-right',
			label: ['browser']
		},
		domain: 'browser',
		type: 'percent'
	}
}

import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Axes from '../components/Axes'
import { areaStub } from '../stub/index'

export default {
	component: Axes,
	title: 'Components/Axes',
	args: {
		parent: 'root',
		classes: 'demo-container'
	}
} as ComponentMeta<typeof Axes>

const Template: ComponentStory<typeof Axes> = (args) => <Axes {...args} />

export const XAxis = Template.bind({})
XAxis.args = {
	id: 'x-axis',
	data: areaStub,
	options: {
		xAxis: {
			show: true,
			showDomain: true,
			position: 'bottom',
			domain: 'year',
			type: 'date'
		}
	}
}

export const YAxis = Template.bind({})
YAxis.args = {
	id: 'y-axis',
	data: areaStub,
	options: {
		yAxis: {
			show: true,
			showTicks: true,
			position: 'left',
			domain: 'year',
			type: 'date'
		}
	}
}

export const XYAxis = Template.bind({})
XYAxis.args = {
	id: 'xy-axis',
	data: areaStub,
	options: {
		stacked: true,
		interactive: true,
		xAxis: {
			show: true,
			showDomain: true,
			showTicks: true,
			position: 'bottom',
			domain: 'year',
			type: 'date'
		},
		yAxis: {
			show: true,
			showDomain: true,
			showTicks: true,
			position: 'left',
			domain: 'price',
			type: 'number'
		}
	}
}

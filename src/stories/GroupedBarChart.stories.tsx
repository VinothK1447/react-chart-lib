import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Chart from '../components/Chart'
import { groupedBarStub, groupedBarStubWithLabels } from '../stub/index'
import { LIGHT_COLORS } from '../generators/Colors'

export default {
	component: Chart,
	title: 'Components/Chart/Bar',
	args: {
		parent: 'root',
		classes: 'demo-container'
	}
} as ComponentMeta<typeof Chart>

const Template: ComponentStory<typeof Chart> = (args) => <Chart {...args} />

export const GroupedVerticalBar = Template.bind({})
GroupedVerticalBar.args = {
	id: 'grouped-verticalBar',
	type: 'Bar',
	data: groupedBarStub,
	options: {
		grouped: true,
		legend: {
			show: true,
			position: 'bottom-center'
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
		}
	}
}

export const GroupedHorizontalBar = Template.bind({})
GroupedHorizontalBar.args = {
	id: 'grouped-horizontalBar',
	type: 'Bar',
	data: groupedBarStub,
	colors: LIGHT_COLORS['BAR'],
	options: {
		showTooltip: true,
		grouped: true,
		legend: {
			show: true,
			position: 'bottom-center'
		},
		labels: {
			show: false,
			post: {
				show: true,
				valueType: 'value',
				position: 'end'
			}
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
		}
	}
}

export const GroupedHorizontalBarWithInternalLabels = Template.bind({})
GroupedHorizontalBarWithInternalLabels.args = {
	id: 'grouped-horizontalBar-with-internal-labels',
	type: 'Bar',
	data: groupedBarStubWithLabels,
	colors: LIGHT_COLORS.BAR_VARIANT9,
	options: {
		showTooltip: true,
		grouped: true,
		labels: {
			show: true,
			pre: {
				show: true,
				valueType: 'key'
			},
			post: {
				show: true,
				valueType: 'both',
				position: 'alt'
			}
		},
		xAxis: {
			show: true,
			position: 'bottom',
			formatter: {
				formatType: 'number',
				format: '.2s'
			},
			type: 'number',
			showTicks: true
		},
		yAxis: {
			show: false,
			position: 'left',
			domain: 'domain',
			type: 'string'
		}
	}
}

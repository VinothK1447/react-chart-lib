import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Chart from '../components/Chart'
import { dualAxesHorizontalLineBarStub, dualAxesLineBarStub } from '../stub/index'
import { DARK_COLORS, LIGHT_COLORS } from '../generators/Colors'

export default {
	component: Chart,
	title: 'Components/Chart/Bar',
	args: {
		parent: 'root',
		classes: 'demo-container'
	}
} as ComponentMeta<typeof Chart>

const Template: ComponentStory<typeof Chart> = (args) => <Chart {...args} />

export const VerticalDualAxesLineBar = Template.bind({})
VerticalDualAxesLineBar.args = {
	id: 'vertical-dualAxes-lineBar',
	type: 'Bar',
	data: dualAxesLineBarStub,
	colors: LIGHT_COLORS.DUALAXES_BAR,
	options: {
		showTooltip: true,
		dualAxes: true,
		line: {
			show: true,
			opts: {
				showLine: true,
				showCircle: true
			},
			domain: 'netflow'
		},
		legend: {
			show: true,
			position: 'top-right',
			orient: 'horizontal'
		},
		xAxis: {
			show: true,
			position: 'bottom',
			domain: 'date',
			type: 'string',
			formatter: {
				formatType: 'date',
				format: '%b %y'
			}
		},
		yAxis: {
			show: true,
			position: 'left',
			formatter: {
				formatType: 'number',
				format: '.2s'
			},
			domain: ['inflow', 'outflow'],
			type: 'number'
		}
	}
}

export const VerticalDualAxesCircledBar = Template.bind({})
VerticalDualAxesCircledBar.args = {
	id: 'vertical-dualAxes-circledBar',
	type: 'Bar',
	data: dualAxesLineBarStub,
	colors: DARK_COLORS.DUALAXES_BAR,
	options: {
		showTooltip: true,
		dualAxes: true,
		line: {
			show: true,
			opts: {
				showLine: false,
				showCircle: true
			},
			domain: 'netflow'
		},
		legend: {
			show: true,
			position: 'top-right',
			orient: 'horizontal'
		},
		xAxis: {
			show: true,
			position: 'bottom',
			domain: 'date',
			type: 'string',
			formatter: {
				formatType: 'date',
				format: '%b %y'
			}
		},
		yAxis: {
			show: true,
			position: 'left',
			formatter: {
				formatType: 'number',
				format: '.2s'
			},
			domain: ['inflow', 'outflow'],
			type: 'number'
		}
	}
}

export const HorizontalBiDirectionalDualAxesBar = Template.bind({})
HorizontalBiDirectionalDualAxesBar.args = {
	id: 'horizontal-dualAxes-lineBar',
	type: 'Bar',
	data: dualAxesHorizontalLineBarStub,
	colors: DARK_COLORS.DUALAXES_BAR,
	options: {
		showTooltip: true,
		dualAxes: true,
		line: {
			show: true,
			opts: {
				showLine: true,
				showCircle: true
			},
			domain: 'netflow'
		},
		legend: {
			show: true,
			position: 'top-right',
			orient: 'horizontal'
		},
		xAxis: {
			show: true,
			position: 'bottom',
			domain: ['inflow', 'outflow'],
			type: 'number',
			formatter: {
				formatType: 'number',
				format: '.2s'
			}
		},
		yAxis: {
			show: true,
			position: 'left',
			domain: 'type',
			type: 'string',
			fold: false
		}
	}
}

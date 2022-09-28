import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Chart from '../components/Chart'
import { dualAxesCenterTextBarStub } from '../stub/index'
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

export const HorizontalDualAxesBarCenterText = Template.bind({})
HorizontalDualAxesBarCenterText.args = {
	id: 'horizontal-dualAxes-centerTextBar',
	type: 'Bar',
	data: dualAxesCenterTextBarStub,
	colors: LIGHT_COLORS.BAR_VARIANT5,
	options: {
		showTooltip: true,
		dualAxes: true,
		centerText: true,
		xAxis: {
			show: true,
			dual: true,
			position: 'bottom',
			formatter: {
				formatType: 'number',
				format: '.2s'
			},
			domain: ['aum', 'aha'],
			type: 'number',
			showTicks: true,
			noOfTicks: 4,
			labels: {
				left: { show: true, label: 'Assets Under Management', type: 'number' },
				right: { show: true, label: 'Assets Held Away', type: 'number' }
			}
		},
		yAxis: {
			show: true,
			position: 'right',
			domain: 'status',
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

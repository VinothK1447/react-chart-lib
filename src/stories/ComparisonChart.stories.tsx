import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Comparison from '../components/Comparison'
import { comparisonChartStub } from '../stub/index'
import { LIGHT_COLORS } from '../generators/Colors'

export default {
	component: Comparison,
	title: 'Components/React/Comparison',
	args: {
		id: 'comparison-chart'
	}
} as ComponentMeta<typeof Comparison>

const Template: ComponentStory<typeof Comparison> = (args) => <Comparison {...args} />

export const ComparisonChart = Template.bind({})
ComparisonChart.args = {
	data: comparisonChartStub,
	colors: LIGHT_COLORS.COMPARISON,
	options: {
		showTooltip: true,
		labels: {
			showLabel: true,
			formatter: {
				formatType: 'currency',
				format: 'USD'
			}
		}
	}
}

import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import LineBar from '../components/LineBar'
import { lineBarStub } from '../stub/index'
import { LIGHT_COLORS } from '../generators/Colors'

export default {
	component: LineBar,
	title: 'Components/React/LineBar',
	args: {
		id: 'linebar-chart'
	}
} as ComponentMeta<typeof LineBar>

const Template: ComponentStory<typeof LineBar> = (args) => <LineBar {...args} />

export const LineBarChart = Template.bind({})
LineBarChart.args = {
	data: lineBarStub,
	colors: LIGHT_COLORS.BAR_VARIANT6,
	classes: 'custom-container',
	options: {
		showTooltip: false,
		labels: {
			preLabel: {
				show: true,
				preLabelClass: 'line-bar-pre-label'
			},
			postLabel: {
				show: true,
				postLabelClass: 'line-bar-post-label'
			}
		},
		domain: 'type',
		type: 'amount',
		wrapLength: 35,
		isClickable: {
			clickable: true,
			onChartItemClick: (data) => {
				console.log(data)
			}
		}
	}
}

import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import ProgressBar from '../components/ProgressBar'
import { progressBarStub } from '../stub/index'
import { LIGHT_COLORS } from '../generators/Colors'

export default {
	component: ProgressBar,
	title: 'Components/React/Progress',
	args: {
		id: 'progressbar-chart'
	}
} as ComponentMeta<typeof ProgressBar>

const Template: ComponentStory<typeof ProgressBar> = (args) => <ProgressBar {...args} />

export const ProgressBarChart = Template.bind({})
ProgressBarChart.args = {
	data: progressBarStub,
	colors: LIGHT_COLORS.PROGRESS_BAR,
	classes: 'custom-container',
	options: {
		showTooltip: false,
		labels: {
			showPreLabel: true,
			showPostLabel: true,
			formatter: {
				formatType: 'currency',
				format: 'USD'
			}
		},
		domain: 'Invested',
		type: 'Proposed',
		isClickable: {
			clickable: true,
			onChartItemClick: (data) => {
				console.log(data)
			}
		}
	}
}

export const GradientProgressBarChart = Template.bind({})
GradientProgressBarChart.args = {
	data: [progressBarStub[3]],
	colors: [`linear-gradient(90deg, rgba(0,212,255,1) 0%, rgba(9,9,121,1) 84%, rgba(2,0,36,1) 100%)`, '#ddd'],
	options: {
		showTooltip: true,
		domain: 'Invested',
		type: 'Proposed',
		isClickable: {
			clickable: true,
			onChartItemClick: (data) => {
				console.log(data)
			}
		}
	}
}

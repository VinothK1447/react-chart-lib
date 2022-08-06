import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import SankeyChart from '../components/SankeyChart'
import { randomSankeyStub, centralSankeyStub } from '../stub/index'

export default {
	component: SankeyChart,
	title: 'Components/SankeyChart/Sankey',
	args: {
		id: 'sankey-chart-container'
	}
} as ComponentMeta<typeof SankeyChart>

const Template: ComponentStory<typeof SankeyChart> = (args) => <SankeyChart {...args} />

export const SankeyRandom = Template.bind({})
SankeyRandom.args = {
	type: 'Sankey',
	data: randomSankeyStub,
	options: {
		// circularNodes: [4],
		textNodes: [
			{ key: 'type', class: 'txt-header' },
			{ key: 'displayText', class: 'txt-body' },
			{ key: 'subValue', class: 'txt-subtext' }
		],
		header: {
			title: 'Data Visualization',
			tabsRequired: true,
			tabkey: 'name'
		}
	}
}

export const SankeyCentral = Template.bind({})
SankeyCentral.args = {
	type: 'Sankey',
	data: centralSankeyStub,
	options: {
		// circularNodes: [4],
		textNodes: [
			{ key: 'type', class: 'txt-header' },
			{ key: 'displayText', class: 'txt-body' },
			{ key: 'subValue', class: 'txt-subtext' }
		],
		header: {
			title: 'Data Visualization',
			tabsRequired: true,
			tabkey: 'name'
		}
	}
}

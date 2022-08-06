import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Chart from '../components/Chart'
import { sunburstStub } from '../stub/index'

export default {
	component: Chart,
	title: 'Components/Chart',
	args: {
		parent: 'root',
		classes: 'demo-container'
	}
} as ComponentMeta<typeof Chart>

const Template: ComponentStory<typeof Chart> = (args) => <Chart {...args} />

export const Sunburst = Template.bind({})
Sunburst.args = {
	id: 'sunburst-chart',
	type: 'Sunburst',
	data: sunburstStub,
	options: {
		group: 'name',
		type: 'size'
	}
}

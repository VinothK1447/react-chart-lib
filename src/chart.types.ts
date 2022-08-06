import { HTMLAttributes } from 'react'
import * as d3 from 'd3'
export interface chartOptions extends HTMLAttributes<HTMLElement> {
	/**
	 * ID to render chart
	 * @type string
	 */
	id: string
	/**
	 * CSS class to be applied for chart render
	 * @type string
	 */
	classes?: string
	/**
	 * Data used to render chart
	 * @type [{}]
	 */
	data: any //datum[]
	/**
	 * Type of chart to be rendered
	 * @type ('Area' | 'Bar' | 'Pie' | 'Line' | 'Sunburst' | 'Sankey')
	 */
	type: 'Area' | 'Bar' | 'Pie' | 'Line' | 'Sunburst' | 'Sankey'
	/**
	 * Colors used in chart, if specific color scheme needed
	 * @type string[]
	 */
	colors?: string[]
	/**
	 * Chart options
	 * @type {}
	 */
	options: areaChartOptions | barChartOptions | pieChartOptions | lineChartOptions | sunburstChartOptions | sankeyChartOptions
	/**
	 * Event handler on chart clicks
	 * @type Function
	 */
	onChartClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void
}

type datum = {
	[key: string | number]: Date | string | number
}
type chartType = 'Area' | 'Pie' | 'Line' | 'Bar' | 'Sankey' | 'Sunburst'
type position = 'left' | 'right' | 'top' | 'bottom'
type legendPosition = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
type arcSizeOpts = 'sm' | 'md' | 'lg'
type orientation = 'horizontal' | 'vertical'
type postLabelPosition = 'end' | 'alt' | 'above' | 'below'
type labelValueType = 'key' | 'value' | 'both'
type axisProps = {
	show: boolean
	showTicks?: boolean
	noOfTicks?: number
	showDomain?: boolean
	position: position
	domain?: string | number | any
	type: string
	dual?: boolean
	formatter?: {
		formatType: string
		format: string
	}
	label?: string
	fold?: boolean
	labels?: {
		left?: {
			show: boolean
			label: string
			type: string
		}
		right?: {
			show: boolean
			label: string
			type: string
		}
	}
}

export type axesProps = {
	id: string
	data: any[]
	classes?: string
	colors?: string[]
	options: areaChartOptions | barChartOptions | pieChartOptions | lineChartOptions | sunburstChartOptions | sankeyChartOptions
}

export type svgProps = {
	id: string
	msg?: string
	classes?: string
}

export type svgWithHeaderProps = {
	id: string
	header: any
	classes?: string
}
// Area chart props - START
export type areaChartProps = {
	id: string
	data: any //datum[]
	classes?: string
	options: areaChartOptions
	colors?: string[]
	type?: chartType
}

export type areaChartOptions = {
	showTooltip?: boolean
	stacked?: boolean
	interactive?: boolean
	xAxis: axisProps
	yAxis: axisProps
	orient?: orientation
	legend?: {
		show: boolean
		position: legendPosition
		label?: string[]
		orient?: string
	}
}

export type areaOnlyProps = {
	height: number
	options: {
		showTooltip?: boolean
		xAxis: axisProps
		yAxis: axisProps
	}
}

export type areaTooltipProps = {
	id: string
	data: any
	options: areaChartOptions
	xAxisScale?: any
	yAxisScale?: any
}

// Area chart props - END

// Bar chart props - START
export type barChartProps = {
	id: string
	data: any //datum[]
	classes?: string
	colors?: string[]
	options: barChartOptions
	type?: chartType
}

export type barChartOptions = {
	showTooltip?: boolean
	xAxis: axisProps
	yAxis: axisProps
	grouped?: boolean
	stack?: boolean
	dualAxes?: boolean
	centerText?: boolean
	orient?: orientation
	line?: {
		show: boolean
		opts?: {
			showLine: boolean
			showCircle: boolean
		}
		domain?: string
	}
	labels?: {
		show: boolean
		pre?: {
			show: boolean
			valueType: labelValueType
		}
		post?: {
			show: boolean
			valueType: labelValueType
			position: postLabelPosition
		}
	}
	legend?: {
		show: boolean
		position: legendPosition
		label?: string[]
		orient?: string
	}
}

// Bar chart props - END

// Pie/Donut chart props - START
export type pieChartProps = {
	id: string
	data: any //datum[]
	classes?: string
	colors?: string[]
	options: pieChartOptions
}

export type pieChartOptions = {
	isDonut?: boolean
	arcSize?: arcSizeOpts
	showTooltip?: boolean
	centerText?: {
		show: boolean
		label: string
		type: string
		formatter: { formatType: string; format: string }
	}
	legend?: {
		show: boolean
		position: legendPosition
		label: string[]
		orient?: string
	}
	domain?: string
	type?: string
}

// Pie/Donut chart props - END

// Line chart props - START
export type lineChartProps = {
	id: string
	data: any //datum[]
	classes?: string
	colors?: string[]
	options: lineChartOptions
}

export type lineChartOptions = {
	showTooltip?: boolean
	group?: string
	xAxis: axisProps
	yAxis: axisProps
	orient?: orientation
	legend?: {
		show: boolean
		position: legendPosition
		label: string[]
		orient?: string
	}
}

// Line chart props - END

// Sunburst chart props - END
export type sunburstChartProps = {
	id: string
	data: any //datum[]
	classes?: string
	colors?: string[]
	options: sunburstChartOptions
}

export type sunburstChartOptions = {
	group: string
	type: string
}

// Sunburst chart props - END

// Sankey chart props - START
export type sankeyChartProps = {
	id: string
	data?: any //datum[]
	classes?: string
	colors?: string[]
	options: sankeyChartOptions
}

export type sankeyChartOptions = {
	circularNodes?: boolean
	textNodes?: {
		key: string
		class: string
	}[]
	header?: {
		title: string
		tabsRequired: boolean
		tabKey: string
	}
	summary?: {
		required: boolean
		key: string
		keys: string[]
	}
}

// Sankey chart props - END

// Progress bar props - START
export type progressBarProps = {
	id: string
	data?: any
	colors?: string[]
	classes?: string
	options: progressBarOptions
}

export type progressBarOptions = {
	showTooltip?: boolean
	labels?: {
		showPreLabel: boolean
		showPostLabel: boolean
		formatter?: {
			formatType: string
			format: string
		}
	}
	classes?: string
	domain?: string
	type?: string
}
// Progress bar props - END

// Comparison chart props - START
export type comparisonChartProps = {
	id: string
	data?: any
	colors?: string[]
	classes?: string
	options: comparisonChartOptions
}

export type comparisonChartOptions = {
	showTooltip?: boolean
	labels?: {
		showLabel: boolean
		formatter?: {
			formatType: string
			format: string
		}
	}
	classes?: string
	domain?: string | string[]
	type?: string
}
// Comparison chart props - END

// Line bar props - START
export type lineBarProps = {
	id: string
	data?: any
	colors?: string[]
	classes?: string
	options: lineBarOptions
}

export type lineBarOptions = {
	showTooltip?: boolean
	labels?: {
		preLabel: {
			show: boolean
			preLabelClass?: string
			formatter?: {
				formatType: string
				format: string
			}
		}
		postLabel: {
			show: boolean
			postLabelClass?: string
			formatter?: {
				formatType: string
				format: string
			}
		}
	}
	classes?: string
	domain?: string
	type?: string
}
// Line bar props - END

export type svgUtilsProps = {
	id: string
	data?: datum[]
	dataNest?: {}
	height?: number
	options?: {
		xAxis?: axisProps
		yAxis?: axisProps
		domain?: string
		type?: string
		isDonut?: boolean
		showTooltip?: boolean
		group?: string
	}
	xAxisScale: any
	yAxisScale: any
}

export type xAxisProps = {
	id?: string
	data?: datum[]
	axisType?: string
	xAxis?: axisProps
}

export type yAxisProps = {
	id?: string
	data?: datum[]
	axisType?: string
	yAxis?: axisProps
}

// export type chartOpt = d3.ScaleBand<d3.AxisDomain> | d3.ScaleLinear<Range, d3.AxisDomain> | d3.ScaleOrdinal<d3.AxisDomain, Range>

export type axisScaleProps = {
	type: string
	domain: string | number
	data: any //datum[]
	position: position
	formatter?: { formatType: string; format: string }
	axisType: string
	grouped?: boolean
	showTicks?: boolean
	showDomain?: boolean
}

export type axisMapProps = {
	id: string
	data: any //datum[]
	axisType: string
	axisOpts: axisProps
	orient?: string
	grouped?: boolean
	stack?: boolean
	dualAxes?: boolean
}

export type scaleTypeProps = d3.ScaleLinear<number, number, never> | d3.ScaleBand<any> | d3.ScaleTime<number, number, never>

export type curateFnProps = {
	axisPlot?: d3.Axis<d3.AxisDomain>
	value?: string | number | Date
	formatter: { formatType: string; format: string }
}

<template>
	<div class="segment-card">
		<h3 class="segment-title">{{ segment.title }}</h3>

		<div class="metric-box">
			<p class="metric-label">
				<i class="pi pi-users"></i> Unique users
			</p>
			<p class="metric-value">{{ formatNumber(segment.unique_users) }}</p>
		</div>

		<p class="metric-subtitle">Visit trend</p>

		<div ref="chartRef" class="trend-chart"></div>

		<button class="segment-btn" @click="$emit('click', segment)">
			<i class="pi pi-chart-line"></i> Mehr dazu!
		</button>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

const props = defineProps({
	segment: {
		type: Object,
		required: true,
	},
});

const chartRef = ref(null);

function formatNumber(num) {
	return num.toLocaleString("de-DE");
}

onMounted(() => {
	if (!chartRef.value) return;

	const chart = echarts.init(chartRef.value);

	chart.setOption({
		grid: { left: 0, right: 0, bottom: 0, top: 10 },
		xAxis: { type: "category", show: false },
		yAxis: {
			type: "value",
			show: true,
			splitLine: { show: false },
		},
		series: [
			{
				type: "line",
				data: props.segment.trend,
				symbol: "none",
				lineStyle: { width: 2, color: "#071847" },
				smooth: true,
			},
		],
		tooltip: { show: false },
	});
});
</script>

<style scoped>
.segment-card {
	border: 1px solid #071847;
	border-radius: 12px;
	padding: 1.5rem;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.segment-title {
	font-size: 1.1rem;
	font-weight: 600;
	min-height: 50px;
	margin-bottom: 1rem;
}

.metric-box {
	border: 1px solid #071847;
	background: #1a3cfb0a;
	padding: 0.8rem;
	border-radius: 10px;
	margin-bottom: 0.8rem;
}

.metric-label {
	font-size: 0.75rem;
	color: #071847;
}

.metric-value {
	font-size: 1.4rem;
	font-weight: bold;
	margin-top: 0.3rem;
	color: #071847;
}

.metric-subtitle {
	font-size: 0.75rem;
	color: #777;
	margin-bottom: 4px;
}

.trend-chart {
	width: 100%;
	height: 90px;
}

.segment-btn {
	margin-top: 30px;
	padding: 8px 16px;
	font-size: 0.85rem;
	border: 1px solid #071847;
	background: white;
	color: #071847;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.2s;
}
.segment-btn:hover {
	background: #071847;
	color: white;
}
</style>

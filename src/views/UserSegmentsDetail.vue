<template>
	<div class="grid wholeView">
		<div class="col-12">
			<div class="card">
				<div class="row w-full flex flex-wrap">
					<div class="col-12">
						<h1 class="m-0"> {{segment_detail.title}}</h1>
					</div>

					<!-- KPIs -->
					<div class="col-12">
						<div class="row">
							<div class="grid mt-4">
								<div class="col-2">
									<div class="kpi-card">
										<span>Unique users</span>
										<h2 class="ml-5">{{ formatNumber(segment_detail.unique_users) }}</h2>
									</div>
								</div>
								<div class="col-3">
									<div class="kpi-card">
										<span>Unique Sessions</span>
										<h2 class="ml-5">{{ formatNumber(segment_detail.unique_sessions) }}</h2>
									</div>
								</div>
								<div class="col-3">
									<div class="kpi-card">
										<span>Avg. Engaged Time</span>
										<h2 class="ml-5">{{ formatNumber(segment_detail.engage_time) }} m</h2>
									</div>
								</div>
								<div class="col-2">
									<div ref="donut1" class="chart-box"></div>
									<p class="text-center"><strong>Engagement</strong></p>
								</div>
								<div class="col-2">
									<div ref="donut2" class="chart-box"></div>
									<p class="text-center"><strong>Frequent</strong></p>
								</div>
							</div>
						</div>
					</div>

					<!-- Text description -->
					<div class="col-7">
						<p class="subtitle">
							{{segment_detail.desc}}
						</p>
					</div>
				</div>

				<!-- Map -->
				<div class="col-12">
					<h3 class="mb-3"><i class="pi pi-map"></i> REGIONALER BLICK</h3>

					<div class="row w-full flex flex-wrap">
						
						<div class="col-5">
							<div ref="mapChart" class="map-box"></div>
						</div>

						<div class="col-7">
							<h4>Interesse von Nutzern pro Regierungsbezirk</h4>

							<!-- ✅ scroll wrapper -->
							<div class="scrollable-text" v-html="marked(segment_detail.regions_desc)"></div>
						</div>

					</div>
				</div>


				<div class="col-12">
					<h2 class="section-title">
						<i class="pi pi-chart-line"></i> ZEITLICHE PERSPEKTIVE
					</h2>
					<div class="grid mt-4">
						<div class="col-2">
							<h4 class="chart-title">Normalisierte Ereignisse pro Wochentagstyp</h4>
							<div ref="weekdayWeekendRef" class="chart-box-time"></div>
						</div>
						<div class="col-7">
							<div class="flex justify-between align-items-center">
								<h4 class="chart-title">Ereignisse pro Zeitfenster</h4>
							</div>
							<div ref="timeBucketsRef" class="chart-box-time"></div>
						</div>
						<div class="col-3">
							<h4 class="chart-title">Events counts</h4>
							<div ref="eventsByDayRef" class="chart-box-time"></div>
						</div>
					</div>
				</div>


				<div class="col-12">
					<div class="section">

							<h2 class="section-title">
								<i class="pi pi-sitemap"></i> KONTEXTANSICHT
							</h2>

							<div class="grid align-items-start">

								<!-- LEFT COLUMN — BAR CHART -->
								<div class="col-3">
									<label class="dropdown-label">Which data to show?</label>
									<Dropdown :options="entityOptions" v-model="selectedEntity" class="w-full" />
									<div ref="barChartRef" class="chart-box-heat"></div>
								</div>

								<!-- RIGHT COLUMN — HEATMAP -->
								<div class="col-9">
									<label class="dropdown-label">Which data to show?</label>
									<Dropdown :options="topicOptions" v-model="selectedTopic" class="w-full" />
									<div ref="heatmapRef" class="chart-box-heat heatmap-box"></div>
								</div>
							</div>
						</div>
					</div>






				<div class="col-12">
					<div class="section">
						<h2 class="section-title">
							<i class="pi pi-timeline"></i> ANSICHT DES SEQUENZIELLEN NUTZERVERHALTENS
						</h2>

						<Dropdown
							class="dropdown"
							:options="topicOptions2"
							v-model="selectedTopic2"
							placeholder="Which data to use to mine sequential user behaviour?"
						/>

						<div class="grid align-items-start mt-3">
							<div class="col-8">
								<div ref="seqHeatmapRef" class="heatmap-box"></div>
							</div>
							<div class="col-4 insights-container">
								<h3>Leseverhalten der Benutzerschaft</h3>
								<ul>
									<li v-for="(point, index) in insights" :key="index">
										<strong>{{ point.title }}:</strong> {{ point.text }}
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

					


			</div>
		</div>
	</div>
</template>


<script setup>
import api from '@/boot/axios';
import * as echarts from "echarts";
import { onMounted, ref, watch } from "vue";
import germanyJson from "@/assets/germany.json"; 
import Dropdown from 'primevue/dropdown';
import { useRoute } from 'vue-router';
import { marked } from "marked";


const route = useRoute();
const segment_id = ref(null);
const segment_detail = ref({
	title: "",
	desc: "",
	unique_users: 0,
	regions: {},
	regions_desc: "",
	freq_users: 0,
	not_freq_users: 0,
	engage_time: 0,
	unique_sessions: 0,
	engaged: 0,
	not_engaged: 0,
	week: 0,
	weekend: 0,
	day_consumption: {},
	day_count: {},
	mm_cat: {}
});

function formatNumber(num) {
  return num.toLocaleString("en-US");
}


const donut1 = ref(null);
const donut2 = ref(null);
const mapChart = ref(null);

onMounted(() => {
	segment_id.value = route.params.id
	loadSegmentDetails()
});

const loadSegmentDetails = async () => { 
	api.get(`/UserSegment/${segment_id.value}`) 
	.then((response) => {
		if(response.status == 200) { 
			console.log(response.data.segment_detail)
			segment_detail.value = response.data.segment_detail
			initDonuts();
			initMap();
			drawWeekdayWeekend();
			drawTimeBuckets();
			drawEventsByDay();
		}
	})
}

const initDonuts = () => { 
  initDonut(donut1.value, ["Engaged", "Not engaged"], [segment_detail.value.engaged, segment_detail.value.not_engaged]);
  initDonut(donut2.value, ["Frequent", "Non frequent"], [segment_detail.value.freq_users, segment_detail.value.not_freq_users]);
}


function initDonut(el, labels, values) {
  const chart = echarts.init(el);
  chart.setOption({
    tooltip: { trigger: "item" },
    color: ["#071847", "#729cba"],
    series: [
      {
        type: "pie",
        radius: ["50%", "80%"],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: "bold",
          },
        },
        data: labels.map((label, index) => ({
          value: values[index],
          name: label,
        })),
      },
    ],
  });
}

function initMap() {
	//  Filter GeoJSON to Bayern (NAME_1 == "Bayern")
	const bayernOnly = {
		...germanyJson,
		features: germanyJson.features.filter(
			(feature) => {
				if (feature.properties.NAME_1 === "Bayern"){
					feature.properties.name = feature.properties.NAME_2
					return feature
				}
		}),
	};
	echarts.registerMap("germany_bayern", bayernOnly);

	const data = bayernOnly.features.map((f) => ({
		name: f.properties.NAME_2,        
		value: segment_detail.value.regions[f.properties.NAME_2] || 0,
	}));
  const chart = echarts.init(mapChart.value);

  chart.setOption({
    tooltip: { trigger: "item", formatter: "{b}: {c}" },
    series: [
      {
        type: "map",
        map: "germany_bayern",
        roam: false,  
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 1.2,
          areaColor:  "#071847",  
        },
        emphasis: {
          label: { show: true },
          itemStyle: {
            color: "#071847",    
          },
        },
        data,
      },
    ],
  });

  chart.on("click", (params) => {
    console.log(`Region gewählt: ${params.name}`);
  });
}



// CHART REFS
const weekdayWeekendRef = ref(null);
const timeBucketsRef = ref(null);
const eventsByDayRef = ref(null);
function drawWeekdayWeekend() {
	const weekdayWeekendData = {
		labels: ["Weekday", "Weekend"],
		values: [segment_detail.value.weekday, segment_detail.value.weekend],
	};

	const chart = echarts.init(weekdayWeekendRef.value);
	chart.setOption({
		xAxis: { type: "category", data: weekdayWeekendData.labels },
		yAxis: { type: "value" },
		series: [{
			type: "bar",
			data: weekdayWeekendData.values,
			itemStyle: { color: "#071847" }
		}]
	});
}

function drawTimeBuckets() {
	const chart = echarts.init(timeBucketsRef.value);
	chart.setOption({
		xAxis: { type: "category", data: segment_detail.value.day_consumption.times, boundaryGap: false },
		yAxis: { type: "value" },
		series: [{
			type: "line",
			data: segment_detail.value.day_consumption.values,
			lineStyle: { width: 4, color: "#071847" }
		}]
	});
}

function drawEventsByDay() {
	const chart = echarts.init(eventsByDayRef.value);
	chart.setOption({
		xAxis: { type: "category", data:  segment_detail.value.day_count.day },
		yAxis: { type: "value" },
		series: [{
			type: "bar",
			data: segment_detail.value.day_count.value,
			itemStyle: { color: "#071847" }
		}]
	});
}


// Dropdown values
const entityOptions = ["BR24 Categories", "Topics"];
const topicOptions = ["Topics", "Categories"];

const selectedEntity = ref("BR24 Categories");
const selectedTopic = ref("Topics");

// refs bound to <div ref="">
const barChartRef = ref(null);
const heatmapRef = ref(null);

/* ------------------- MOCK DATA (replace later) -------------------- */

// Bar chart (Left chart)
const barLabels = ["afternoon", "evening", "morning", "night"];
const barValues = [38000, 15000, 58000, 6000];

// Heatmap (Right chart)
const hours = ["morning", "afternoon", "evening", "night"];
const topics = [
	"Verkehrsunfälle und Strafverfolgung",
	"Bayerns Landkreise und Städte",
	"Brandsschutz und Einsatz",
	"Fußball / Saison-Highlights",
	"Europa - Leben und Kultur",
	"Rechtliche Politik und Verstrickungen",
	"Pandemiegeschehen",
	"Bayerns Innenpolitik",
	"Finanzielle Herausforderungen",
	"Europa / Internationale Politik",
	"Deutsche Politik und Parteien",
	"Aktuelle Ereignisse im Finanzmarkt",
	"Deutsche Mannschaftssportarten"
];

// Generate mock heatmap matrix data
const heatmapData = topics.flatMap((topic, ti) =>
	hours.map((hour, hi) => [ti, hi, Math.floor(Math.random() * 4) + 6])
);

/* ------------------- CHART INITIALIZATION -------------------- */

onMounted(() => {
	renderBarChart();
	renderHeatmap();
});

watch(selectedEntity, () => renderBarChart());
watch(selectedTopic, () => renderHeatmap());

/* ------------------- BAR CHART -------------------- */
function renderBarChart() {
	const chart = echarts.init(barChartRef.value);
	chart.setOption({
		grid: { top: 20, left: 40, right: 10, bottom: 30 },
		xAxis: { type: "category", data: barLabels },
		yAxis: { type: "value" },
		series: [{
			type: "bar",
			data: barValues,
			barWidth: "60%",
			itemStyle: { color: "#071847" }
		}]
	});
}

/* ------------------- HEATMAP -------------------- */
function renderHeatmap() {
	const chart = echarts.init(heatmapRef.value);
	chart.setOption({
		tooltip: {},
		grid: { top: 60, left: 60, right: 60, bottom: 120 },
		xAxis: { type: "category", data: topics, axisLabel: { rotate: 45, fontSize: 10 } },
		yAxis: { type: "category", data: hours },
		visualMap: {
			min: 6,
			max: 10,
			orient: "vertical",
			right: 0,
			top: "center",
			inRange: { color: ["#071847", "#729cba"] }
		},
		series: [{
			type: "heatmap",
			data: heatmapData,
			itemStyle: { borderColor: "#fff", borderWidth: 2 }
		}]
	});
}







// ✅ Dropdown menu
const topicOptions2 = ["Topics", "Categories", "User Interest Clusters"];
const selectedTopic2 = ref("Topics");

// ✅ ECharts ref
const seqHeatmapRef = ref(null);

// ✅ Topic labels (X & Y axis)
const topics2 = [
	"Bayerische Kultur und Tierschutz",
	"Finanzielle Entwicklungen und Börsenanalyse",
	"Straßenverkehrsunfälle und Ermittlungen",
	"Fußball- und Sportthemen in Deutschland",
	"Politische Debatte in Deutschland",
	"Deutsche Politik und Internationale Beziehungen",
	"Aktuelle Nachrichten aus der Welt",
	"Coronavirus-Pandemie in Deutschland",
	"Europäische Politik",
	"Politische Entwicklungen und regionale Beziehungen",
	"Europäische Politik und Verfassung",
	"Politische und regionale Entwicklungen in Bayern",
	"Nachrichten aus Mittelfranken und Oberfranken",
	"Verkehrsstörungen auf deutschen Straßen",
	"Politik und Regierung in Bayern",
	"Strafverfolgung und Recht",
	"Politik und Gesellschaft in Oberbayern",
	"Europäische Wirtschaftsentwicklung",
	"Deutsche Mannschaften im Fokus",
	"Schwäbisches Stadtleben",
	"Süddeutschland und Regionen",
	"Das Leben von Kindern und Jugendlichen",
	"Politische Entwicklungen im Bundesrepublik",
	"Brandkatastrophen und Löscheinsätze",
	"Bundesländer und Regionalität"
];

// ✅ Generate heatmap data (random demo matrix)
const heatmapData2 = topics2.flatMap((topic, x) =>
	topics2.map((t, y) => [x, y, +(Math.random() * 0.3).toFixed(2)])
);

// ✅ Right insights panel content
const insights = [
	{
		title: "Straßenverkehrsunfälle und Ermittlungen",
		text: "Die Wahrscheinlichkeit, dass Leser nach einem Artikel über Straßenverkehrsunfälle und Ermittlungen einen weiteren Artikel lesen, beträgt 0,16."
	},
	{
		title: "Politische und regionale Entwicklungen in Bayern",
		text: "Hohe Übergangswahrscheinlichkeit zwischen regionalen Themen — Rate: 0,33."
	},
	{
		title: "Strafverfolgung und Recht",
		text: "Nach Artikeln zu Rechtsthemen wechseln Nutzer oft zu lokalen politischen Themen."
	},
	{
		title: "Westernstadt, Pullman City, Bränden, Freizeitparks und Zerstörung",
		text: "Auch diese Themen führen oft zu Übergängen zu Unfällen / Ermittlungen (Rate 0,21)."
	}
];

// ✅ Heatmap chart creation
function drawHeatmap() {
	const chart = echarts.init(seqHeatmapRef.value);

	chart.setOption({
		tooltip: {},
		grid: { top: 20, left: 150, bottom: 150, right: 60 },
		xAxis: {
			type: "category",
			data: topics2,
			axisLabel: { rotate: 45, fontSize: 10 }
		},
		yAxis: {
			type: "category",
			data: topics2,
			axisLabel: { fontSize: 10 }
		},
		visualMap: {
			min: 0,
			max: 0.3,
			calculable: false,
			right: 10,
			inRange: { color: ["#071847", "#729cba"] }
		},
		series: [
			{
				type: "heatmap",
				data: heatmapData2,
				itemStyle: {
					borderColor: "#fff",
					borderWidth: 2
				}
			}
		]
	});
}

onMounted(drawHeatmap);
watch(selectedTopic, drawHeatmap);
</script>


<style scoped>
.wholeView{ 
	width: 100%;
	height: 85vh;       
  overflow-y: auto;  
  padding: 2rem;
}

.subtitle {
  padding-top: 20px;
  line-height: 1.5;
  height: 170px;
  color: #555;
}

.map-box {
  width: 100%;
  height: 600px;
}

.chart-box {
  width: 100%;
  height: 70%;
}

.chart-box-time {
  width: 100%;
  height: 400px;
}

.kpi-card span {
  font-size: 0.9rem;
  opacity: 0.8;
}

.kpi-card h2 {
  margin: 10px;
}

.section {
	margin-top: 3rem;
	padding-bottom: 3rem;
}

.section-title {
	font-size: 1.6rem;
	font-weight: 600;
	margin-bottom: 1.2rem;
}

.chart-box-heat {
	width: 100%;
	height: 300px;
	margin-top: 1rem;
}

.heatmap-box {
	height: 420px;
}

.dropdown-label {
	font-size: 0.8rem;
	color: #666;
	margin-bottom: 0.3rem;
	display: inline-block;
}

.section {
	margin-top: 4rem;
}

.section-title {
	font-size: 1.8rem;
	font-weight: 600;
	margin-bottom: 1.4rem;
}

.dropdown {
	width: 350px;
	margin-bottom: 1.2rem;
}

.heatmap-box {
	width: 100%;
	height: 560px;
}

.insights-container {
	padding-left: 2rem;
	line-height: 1.5;
}

.insights-container ul {
	padding-left: 0.8rem;
}

.insights-container li {
	margin-bottom: 1rem;
	font-size: 0.95rem;
}

.scrollable-text {
  max-height: 480px;     /* adjust this to match your map height */
  overflow-y: auto;      /* enables vertical scrolling */
  padding-right: 10px;   /* space from scrollbar */
}

/* Optional: nicer scrollbar (Webkit browsers / Chrome / Edge / Safari) */
.scrollable-text::-webkit-scrollbar {
  width: 6px;
}

.scrollable-text::-webkit-scrollbar-thumb {
  background: #b0b0b0;
  border-radius: 10px;
}

</style>

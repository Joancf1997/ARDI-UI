<template>
	<div class="grid">
			<div class="col-12">
					<div class="card">
							<div class="grid grid-cols-3 gap-4 mb-6">
								<div class="p-4 rounded shadow">
									<h3 class="font-bold text-lg">Total Requests</h3>
									<p class="text-2xl">{{ metrics.totalRequests }}</p>
								</div>
								<div class="p-4 rounded shadow">
									<h3 class="font-bold text-lg">Overall Match Ratio</h3>
									<p class="text-2xl">{{ metrics.overallMatchRatio }}</p>
								</div>
								<div class="p-4 rounded shadow">
									<h3 class="font-bold text-lg">Avg Tools / Request</h3>
									<p class="text-2xl">{{ metrics.avgToolsPerRequest }}</p>
								</div>
							</div>
							<Toolbar class="mb-4">
									<template v-slot:start>
											<div class="my-2">
												<button icon="pi pi-plus" class="mr-2" severity="success" @click="newDatasetEvaluation()"> New Dataset Evaluation </button>
											</div>
									</template>
									<template v-slot:end>
										<div class="my-2">
											<InputText
												v-model="filters.thread_name.value"
												placeholder="Filter by thread name (ex: Segment 1, ARDI...)"
												class="w-full"
											/>										
										</div>
									</template>


							</Toolbar>
							<DataTable
								:value="evaluations"
								v-model:filters="filters"
								v-model:expandedRows="expandedRows"
								paginator
								:rows="10"
								showGridlines
								dataKey="id"
								filterDisplay="row"
								@filter="onFilter"
							>
								<!-- 🔽 Expander column (THIS WAS MISSING) -->
								<Column expander style="width: 3rem" />

								<Column
									field="thread_name"
									header="Thread"
									filter
									filterPlaceholder="Search thread..."
									style="width: 16rem"
								/>


								<!-- Question -->
								<Column field="question" header="Question" style="width: 35%" />

								<!-- Expected Tools -->
								<Column field="labels" header="Expected Tools">
									<template #body="{ data }">
										<Chip 
											v-for="t in data.labels" 
											:key="t" 
											:label="t"
											class="mr-1 mb-1"
										/>
									</template>
								</Column>

								<!-- Actual Tools -->
								<Column field="actual_tools" header="Actual Tools">
									<template #body="{ data }">
										<Chip 
											v-for="t in data.actual_tools" 
											:key="t" 
											:label="t" 
											class="mr-1 mb-1"
											severity="success"
										/>
									</template>
								</Column>

								<!-- Match Ratio -->
								<Column field="match_ratio" header="Matched">
									<template #body="{ data }">
										<Tag 
											:value="(data.match_ratio * 100).toFixed(0) + '%'" 
											:severity="getSeverity(data.match_ratio)"
										/>
									</template>
								</Column>

								<!-- Match Fraction -->
								<Column field="match_ratio_str" header="Matched Fraction">
									<template #body="{ data }">
										<Tag :value="data.match_ratio_str" severity="info" />
									</template>
								</Column>

								<!-- Created At -->
								<Column field="created_at" header="Date" style="width: 12%">
									<template #body="{ data }">
										{{ formatDate(data.created_at) }}
									</template>
								</Column>

								<!-- ✅ EXPANDED CONTENT -->
								<template #expansion="{ data }">
									<div class="p-4 surface-100 border-round">

										<h3 class="font-semibold mb-2">Details</h3>

										<p><strong>Question:</strong> {{ data.question }}</p>

										<div class="mt-3">
											<strong>Expected Tools:</strong>
											<div class="mt-2">
												<Chip 
													v-for="t in data.labels" 
													:key="'lbl-'+t" 
													:label="t"
													class="mr-1 mb-1"
												/>
											</div>
										</div>

										<div class="mt-3">
											<strong>Actual Tools:</strong>
											<div class="mt-2">
												<Chip 
													v-for="t in data.actual_tools" 
													:key="'act-'+t" 
													:label="t"
													class="mr-1 mb-1"
													severity="success"
												/>
											</div>
										</div>

										<div class="mt-3">
											<strong>Match:</strong>
											<Tag :value="data.match_ratio_str" severity="info" />
										</div>

										<div class="mt-3 text-sm text-gray-500">
											<p><strong>ID:</strong> {{ data.id }}</p>
											<p><strong>Thread ID:</strong> {{ data.thread_id }}</p>
											<p><strong>Thread Name:</strong> {{ data.thread_name }}</p>
										</div>
									</div>
								</template>

							</DataTable>


					</div>
			</div>
	</div>
</template>

<script setup>
import api from '@/boot/axios';
import Toolbar from 'primevue/toolbar';
import { ref, onMounted } from 'vue';
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import Chip from "primevue/chip";
import InputText from 'primevue/inputtext';
import { FilterMatchMode } from 'primevue/api'

const onFilter = (event) => {
  // event.filteredValue = rows that passed the filter
  const list = event.filteredValue || [];

  if (list.length === 0) {
    metrics.value = {
      totalRequests: 0,
      overallMatchRatio: 0,
      avgToolsPerRequest: 0
    };
    return;
  }

  const totalRequests = list.length;

  const totalMatched = list.reduce((sum, r) => sum + r.matched, 0);
  const totalLabels = list.reduce((sum, r) => sum + r.total_labels, 0);
  const totalTools = list.reduce((sum, r) => sum + (r.actual_tools?.length || 0), 0);

  metrics.value.totalRequests = totalRequests;
  metrics.value.overallMatchRatio = totalLabels > 0 
    ? +(totalMatched / totalLabels).toFixed(2) 
    : 0;

  metrics.value.avgToolsPerRequest = +(
    totalTools / totalRequests
  ).toFixed(2);
};


const filters = ref({
  thread_name: { value: null, matchMode: FilterMatchMode.CONTAINS }
})


const evaluations = ref([])
const metrics = ref({
  totalRequests: 0,
  overallMatchRatio: 0,
  avgToolsPerRequest: 0,
});

const expandedRows = ref([]);

// Overall metrics computed from the evaluations table
const overallStats = () => {
  const list = evaluations.value || [];
  if (list.length === 0) {
    return {
      totalRequests: 0,
      overallMatchRatio: 0,
      avgToolsPerRequest: 0
    };
  }

  const totalRequests = list.length;

  const totalMatched = list.reduce((sum, r) => sum + r.matched, 0);
  const totalLabels  = list.reduce((sum, r) => sum + r.total_labels, 0);
  const totalTools = list.reduce((sum, r) => sum + r.actual_tools.length, 0);
  metrics.value.totalRequests = totalRequests,
  metrics.value.overallMatchRatio = totalLabels > 0 ? +(totalMatched / totalLabels).toFixed(2) : 0,
  metrics.value.avgToolsPerRequest = +(totalTools / totalRequests).toFixed(2)
};

onMounted(() => {
	loadEvaluations()
});


function getSeverity(value) {
  if (value >= 0.6) return "success";     
  if (value >= 0.5) return "warning";     
  return "danger";                        
}

const loadEvaluations = async () => { 
  try {
    const res = await api.get(`/dataset_evaluations`)
		evaluations.value = res.data;
		overallStats()
  } catch (error) {
    console.error("Error fetching dataset evaluations:", error);
    throw error;
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString();
}

const newDatasetEvaluation = async () => { 
	var userauth = JSON.parse(window.localStorage.getItem('ardiUserData'));
	const userId = userauth.user_id
	try {
		let payload = {
        user_id: userId,
        name: "Dataset Evaluation"
    }
    const response = await api.post(`dataset_evaluation`, payload);
    return response.data;
  } catch (error) {
    console.error("Error running dataset evaluation:", error);
    throw error;
  }
}

</script>
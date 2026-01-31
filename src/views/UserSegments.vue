<template>
	<div class="grid wholeView">
		<div class="col-12">
			<div class="card">
				<h2 class="section-title"><i class="pi pi-users"></i> USER SEGMENTS LIST</h2>
				<p class="description">
						Bitte wählen Sie aus der folgenden Liste ein Nutzersegment aus, das Sie untersuchen möchten.
				</p>

				<div class="grid">
						<div
								v-for="segment in userSegments"
								:key="segment.id"
								class="col-4"
						>
								<UserSegmentCard
										:segment="segment"
										@click="goToSegmentDetails(segment)"
								/>
						</div>
					</div>
				</div>
			</div>
    </div>
</template>

<script setup>
import api from '@/boot/axios';
import { useRouter } from 'vue-router';
import { ref, onMounted } from "vue";
import UserSegmentCard from "@/components/UserSegmentCard.vue";

const router = useRouter();
const userSegments = ref([]);

const loadSegment = async () => { 
	api.get('/UserSegments') 
	.then((response) => {
		if(response.status == 200) { 
			userSegments.value = response.data.segments
		}
	})
}

onMounted(() => {
  loadSegment()
});

function goToSegmentDetails(segment) {
	router.push(`/userSegmentsDetails/${segment.id}`)
}
</script>

<style scoped>
.section-title {
	font-size: 1.8rem;
	font-weight: bold;
	margin-bottom: 0.5rem;
}
.description {
	font-size: 0.9rem;
	color: #555;
	margin-bottom: 1.5rem;
}
</style>

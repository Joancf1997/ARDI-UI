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
import { useRouter } from 'vue-router';
import UserSegmentCard from "@/components/UserSegmentCard.vue";

const router = useRouter();
const userSegments = [
	{
		id: 1,
		title: "Schulwesen und Unwetter-Themen dominieren Interesse",
		unique_users: 160187,
		trend: [0, 0.1, 0.2, 0.3, 0.55, 0.1, 0.05],
	},
	{
		id: 2,
		title: "Westernstadt- und Pullman-City-Themen dominieren Interesse",
		unique_users: 111918,
		trend: [0, 0.05, 0.05, 0.1, 0.65, 0.2],
	},
	{
		id: 3,
		title: "Bahntreue und Tarifstreit",
		unique_users: 113372,
		trend: [0.05, 0.07, 0.1, 0.15, 0.42],
	},
	// ... add rest of your segments here ...
];

function goToSegmentDetails(segment) {
	router.push({name: 'userSegmentsDetails'});
	// router.push(`/segments/${segment.id}`)
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

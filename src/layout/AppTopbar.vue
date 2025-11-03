
<template>
	<div class="layout-topbar">
		<router-link to="/" class="layout-topbar-logo">
			<img src="/layout/images/Logo-ARD.svg" alt="Image" height="100" />
			<span>ARDI</span>
		</router-link>

		<button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
			<i class="pi pi-bars"></i>
		</button>

		<button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
			<i class="pi pi-ellipsis-v"></i>
		</button>

		<div class="layout-topbar-menu" :class="topbarMenuClasses">
			<button class="p-link layout-topbar-button">
				<i class="pi pi-user"></i>
				<span>Profile</span>
			</button>
			<button @click="onLogOut()" class="p-link layout-topbar-button">
				<i class="pi pi-sign-out"></i>
				<span>Settings</span>
			</button>
		</div>
	</div>
</template>



<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLayout } from '@/layout/composables/layout';
const { onMenuToggle } = useLayout();

const topbarMenuActive = ref(false);
const router = useRouter();

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const onLogOut = () => {			
    window.localStorage.removeItem('mesI4Mon');
		router.push({name: 'login'});
};

const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

</script>
<style lang="scss" scoped></style>

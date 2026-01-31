<script setup>
import { computed } from 'vue';


const logoUrl = computed(() => {
    return `/layout/images/Logo-ARD.svg`;
});
</script>

<template>
    <div class="layout-footer">
        <img :src="logoUrl" alt="Logo" height="50" class="mr-2" />
        <!-- <strong class="mr-2"> ARDI </strong>   -->
    </div>
</template>
<style lang="scss" scoped></style>

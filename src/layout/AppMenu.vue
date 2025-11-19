<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import AppMenuItem from './AppMenuItem.vue';


// Generales
const model = ref([
    {
        label: "ARDI",
        items: [
            {
                icon: "pi pi-comments",
                label: "Chats",
                to: "/chats"
            },
            {
                icon: "pi pi-users",
                label: "User Segments",
                to: "/userSegments"
            },
            {
                icon: "pi pi-user",
                label: "Users",
                to: "/users"
            },
            {
                icon: "pi pi-chart-bar",
                label: "Dataset Evaluation",
                to: "/datasetEvaluation"
            }
        ]
    }
]);

onMounted(() => {
    loadMenuProcesos()
});


const loadMenuProcesos = () => { 
    // var storage = JSON.parse(window.localStorage.getItem('I4MON'));
    // model.value = storage.permisosMenu;
}

</script>

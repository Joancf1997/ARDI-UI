<template>
    <button class="layout-config-button p-link" type="button" @click="onConfigButtonClick()">
        <i class="pi pi-cog"></i>
    </button>

    <Sidebar v-model:visible="visible" position="right" class="layout-config-sidebar w-26rem" pt:closeButton="ml-auto">

        <div class="image-container">
            <Image class="centered-image" src="/layout/images/Logo-ARD.svg" alt="Image" width="200" />
        </div>
        <div class="image-container">
            <FileUpload mode="basic" accept="image/*" />
        </div>


        <div class="p-2">
            <section class="pb-4 flex align-items-center justify-content-between border-bottom-1 surface-border">
                <span class="text-xl font-semibold">Scale</span>
                <div class="flex align-items-center gap-2 border-1 surface-border py-1 px-2" style="border-radius: 30px">
                    <Button icon="pi pi-minus" @click="decrementScale" text rounded :disabled="layoutConfig.scale.value === scales[0]" />
                    <i v-for="s in scales" :key="s" :class="['pi pi-circle-fill text-sm text-200', { 'text-lg text-primary': s === layoutConfig.scale.value }]" />

                    <Button icon="pi pi-plus" @click="incrementScale" text rounded :disabled="layoutConfig.scale.value === scales[scales.length - 1]" />
                </div>
            </section>

            <section class="py-4 flex align-items-center justify-content-between border-bottom-1 surface-border">
                <span :class="['text-xl font-semibold']">Dark Mode</span>
                <InputSwitch :modelValue="layoutConfig.darkTheme.value" @update:modelValue="onDarkModeChange" />
            </section>

            <template v-if="!simple">
                <section class="py-4 flex align-items-center justify-content-between border-bottom-1 surface-border">
                    <span class="text-xl font-semibold">Menu Type</span>
                    <SelectButton :modelValue="layoutConfig.menuMode.value" @update:modelValue="onMenuModeChange" :options="menuModes" optionLabel="label" optionValue="value" :allowEmpty="false" />
                </section>
            </template>

            <section class="py-4 border-bottom-1 surface-border">
                <div class="text-xl font-semibold mb-3">Themes</div>
                <div class="flex align-items-center gap-2 mb-3">
                    <img src="https://primefaces.org/cdn/primevue/images/themes/aura.png" alt="Aura" style="width: 1.5rem" />
                    <span class="font-medium">Aura</span>
                </div>
                <div class="flex align-items-center justify-content-between gap-3 mb-3">
                    <button
                        :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('aura', 'green'), 'hover:border-500 surface-border': !isThemeActive('aura', 'green') }
                        ]"
                        style="border-radius: 30px"
                        @click="changeTheme('aura', 'green')"
                    >
                        <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(180deg, #4dac9c 0%, rgba(77, 172, 156, 0.5) 100%)"></span>
                    </button>
                    <button
                        :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('aura', 'cyan'), 'hover:border-500 surface-border': !isThemeActive('aura', 'cyan') }
                        ]"
                        style="border-radius: 30px"
                        @click="changeTheme('aura', 'cyan')"
                    >
                        <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(180deg, #06b6d4 0%, rgba(6, 182, 212, 0.5) 100%)"></span>
                    </button>
                    <button
                        :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('aura', 'blue'), 'hover:border-500 surface-border': !isThemeActive('aura', 'blue') }
                        ]"
                        style="border-radius: 30px"
                        @click="changeTheme('aura', 'blue')"
                    >
                        <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(180deg, #4378e6 0%, rgba(67, 120, 230, 0.5) 100%)"></span>
                    </button>
                    <button
                        :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('aura', 'indigo'), 'hover:border-500 surface-border': !isThemeActive('aura', 'indigo') }
                        ]"
                        style="border-radius: 30px"
                        @click="changeTheme('aura', 'indigo')"
                    >
                        <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(180deg, #585fe0 0%, rgba(88, 95, 224, 0.5) 100%)"></span>
                    </button>
                </div>
                <div class="flex align-items-center justify-content-between gap-3 mb-3">
                    <button
                        :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('aura', 'purple'), 'hover:border-500 surface-border': !isThemeActive('aura', 'purple') }
                        ]"
                        style="border-radius: 30px"
                        @click="changeTheme('aura', 'purple')"
                    >
                        <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(180deg, #7758e4 0%, rgba(119, 88, 228, 0.5) 100%)"></span>
                    </button>
                    <button
                        :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('aura', 'amber'), 'hover:border-500 surface-border': !isThemeActive('aura', 'amber') }
                        ]"
                        style="border-radius: 30px"
                        @click="changeTheme('aura', 'amber')"
                    >
                        <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(180deg, #f59e0b 0%, rgba(245, 158, 11, 0.5) 100%)"></span>
                    </button>
                    <button
                        :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('aura', 'teal'), 'hover:border-500 surface-border': !isThemeActive('aura', 'teal') }
                        ]"
                        style="border-radius: 30px"
                        @click="changeTheme('aura', 'teal')"
                    >
                        <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(180deg, #14b8a6 0%, rgba(20, 184, 166, 0.5) 100%)"></span>
                    </button>
                    <button
                        :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('aura', 'pink'), 'hover:border-500 surface-border': !isThemeActive('aura', 'pink') }
                        ]"
                        style="border-radius: 30px"
                        @click="changeTheme('aura', 'pink')"
                    >
                        <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(180deg, #ec4899 0%, rgba(236, 72, 153, 0.5) 100%)"></span>
                    </button>
                </div>
                <div class="flex align-items-center justify-content-between gap-3">
                    <button
                        :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('aura', 'noir'), 'hover:border-500 surface-border': !isThemeActive('aura', 'noir') }
                        ]"
                        style="border-radius: 30px"
                        @click="changeTheme('aura', 'noir')"
                    >
                        <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(180deg, #0f172a 0%, rgba(0, 0, 0, 0.5) 100%)"></span>
                    </button>
                    <button
                        :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('aura', 'lime'), 'hover:border-500 surface-border': !isThemeActive('aura', 'lime') }
                        ]"
                        style="border-radius: 30px"
                        @click="changeTheme('aura', 'lime')"
                    >
                        <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(180deg, #84cc16 0%, rgb(132, 204, 22, 0.5) 100%)"></span>
                    </button>
                    <span class="w-3"></span>
                    <span class="w-3"></span>
                </div>
            </section>

            <section class="py-4 border-bottom-1 surface-border mt-5 button-container">
                <Button label="Guardar Configuraciòn" icon="pi pi-save" class="mr-2" severity="success" rounded @click="saveStyle()" />
            </section>
        </div>
    </Sidebar>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import api from "@/boot/axios"
import { useToast } from 'primevue/usetoast';
import { usePrimeVue } from 'primevue/config';
import { useLayout } from '@/layout/composables/layout';

defineProps({
    simple: {
        type: Boolean,
        default: false
    }
});

const toast = useToast();
const $primevue = usePrimeVue();

const scales = ref([12, 13, 14, 15, 16]);
const visible = ref(false);
const menuModes = ref([
    { label: 'Static', value: 'static' },
    { label: 'Overlay', value: 'overlay' }
]);
const compactMaterial = ref(false);

const { setScale, layoutConfig } = useLayout();

const saveStyle = () => { 
	let userauth = JSON.parse(window.localStorage.getItem('mesI4Sol'));

    let style = { 
        orgId: userauth.usuario.org_id,
        img_paht: "",
        ...layoutConfig.theme._object
    }
    api.post('uploadOrganizationStyle', style) 
	.then((response) => {
        if(response.status == 200) { 
            toast.add({ severity: 'success', summary: 'Exito', detail: 'Configuración de estilo correctamente', life: 3000 });
            location.reload();
	    }
	})
	.catch((_) => {
		toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la configuración del estilo', life: 3000 });
	})
}

const onConfigButtonClick = () => {
    visible.value = !visible.value;
};
const onChangeTheme = (theme, mode) => {
    $primevue.changeTheme(layoutConfig.theme.value, theme, 'theme-css', () => {
        layoutConfig.theme.value = theme;
        layoutConfig.darkTheme.value = mode;
    });
};
const decrementScale = () => {
    setScale(layoutConfig.scale.value - 1);
    applyScale();
};
const incrementScale = () => {
    setScale(layoutConfig.scale.value + 1);
    applyScale();
};
const applyScale = () => {
    document.documentElement.style.fontSize = layoutConfig.scale.value + 'px';
};
const onMenuModeChange = (value) => {
    layoutConfig.menuMode.value = value;
};
const onDarkModeChange = (value) => {
    const newThemeName = value ? layoutConfig.theme.value.replace('light', 'dark') : layoutConfig.theme.value.replace('dark', 'light');

    layoutConfig.darkTheme.value = value;
    onChangeTheme(newThemeName, value);
};
const changeTheme = (theme, color) => {
    let newTheme, dark;

    newTheme = theme + '-' + (layoutConfig.darkTheme.value ? 'dark' : 'light');

    if (color) {
        newTheme += '-' + color;
    }

    if (newTheme.startsWith('md-') && compactMaterial.value) {
        newTheme = newTheme.replace('md-', 'mdc-');
    }

    dark = layoutConfig.darkTheme.value;

    onChangeTheme(newTheme, dark);
};
const isThemeActive = (themeFamily, color) => {
    let themeName;
    let themePrefix = themeFamily === 'md' && compactMaterial.value ? 'mdc' : themeFamily;

    themeName = themePrefix + (layoutConfig.darkTheme.value ? '-dark' : '-light');

    if (color) {
        themeName += '-' + color;
    }

    return layoutConfig.theme.value === themeName;
};

</script>

<style lang="scss" scoped>
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.centered-image {
  max-width: 100%;
  max-height: 100%;
}
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

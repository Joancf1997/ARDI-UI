<template>
	<div class="grid">
			<div class="col-12">
					<div class="card">
							<Toolbar class="mb-4">
									<template v-slot:start>
											<div class="my-2">
												<button icon="pi pi-plus" class="mr-2" severity="success" @click="openNew()"> New User </button>
											</div>
									</template>
							</Toolbar>
  
							<!-- Table users -->
							<DataTable
								ref="dt"
								:value="users"
								dataKey="id"
								:paginator="true"
								:rows="10"
								:filters="filters"
								paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
								:rowsPerPageOptions="[10, 25, 50]"
								currentPageReportTemplate="Mostrado  del {first} al {last} de {totalRecords} items"
							>
								<template #header>
									<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
										<h5 class="m-0">User Administration</h5>
										<IconField iconPosition="left" class="block mt-2 md:mt-0">
											<InputIcon class="pi pi-search" />
											<InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..." />
										</IconField>
									</div>
								</template>
								<Column field="username" header="username" :sortable="true" >
									<template #body="slotProps">
										<span class="p-column-title">Username</span>
										{{ slotProps.data.username }}
									</template>
								</Column>
							</DataTable>

							<!-- Dialog for editing the procesos -->
							<Dialog v-model:visible="dialogProcesosVisible" :style="{ width: '450px' }" header="User Details" :modal="true" class="p-fluid">
								<div class="field">
									<label for="usuario">Username</label>
									<InputText id="usuario" v-model.trim="user.username" required="true" autofocus :invalid="!user.username" />
								</div>
								<div class="field" v-if="!editProcesoFlag">
									<label for="password">Password</label>
									<Password v-model="user.password_hash" promptLabel="Password" weakLabel="Muy simple" mediumLabel="Seguridad Media" strongLabel="Seguridad Compleja"/>
								</div>
								<template #footer>
									<button icon="pi pi-times" text="" @click="hideDialog()"> Cancel </button>
									<button v-if="!editProcesoFlag" icon="pi pi-check" text="" @click="saveProceso()"> Save </button>
									<button v-if="editProcesoFlag" icon="pi pi-check" text="" @click="updateProceso()">Update </button>
								</template>
							</Dialog>
					</div>
			</div>
	</div>
</template>

<script setup>
import api from "@/boot/axios"
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import Toolbar from 'primevue/toolbar';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Password from 'primevue/password';

// Generales
const toast = useToast();
const filters = ref({});

// Procesos
const users = ref(null);
const user = ref({
	username: "",
	password_hash: ""
});
const dialogProcesosVisible = ref(false);
const editProcesoFlag = ref(false);

//  Prepare the filters for the table
onBeforeMount(() => {
	initFilters();
});

//  Request information to populate the table
onMounted(() => {
	loadUsers()
});

// ============= usuarios
const loadUsers = () => { 
    api.get('users') 
    .then((response) => {
		if(response.status == 200) { 
			users.value = response.data.users
			console.log(users.value)
		}
    })
    .catch((_) => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error loading the users', life: 3000 });
    })
}

async function saveProceso() {
	try {
		let payload = { 
			username: user.value.username,
			password: user.value.password_hash,
		}
    const res = await api.post("/users/create",payload);
    loadUsers()
  } catch (err) {
    console.error("Failed to create user:", err);
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    throw new Error("User creation failed.");
  }
}

// ================ Generales
// Configuracion del filtro de la tabla
const initFilters = () => {
	filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
	};
};

const hideDialog = () => {
	user.value = { username: "", password_hash: ""};
	dialogProcesosVisible.value = false;
};

const openNew = () => {
	editProcesoFlag.value = false
	user.value = { nombre: "", username: "", password_hash: ""};
	dialogProcesosVisible.value = true;
};
</script>
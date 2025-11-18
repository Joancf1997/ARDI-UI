<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        
        <div class="flex flex-column align-items-center justify-content-center">    
            
            <Message v-if="messageFlag" :severity="messageSeverity"> {{ messageTxt }} </Message>
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg,  #071847, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-5 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center">
                        <img src="/layout/images/Logo-ARD.svg" alt="Image" height="200" />
                        <div class="text-900 text-3xl font-medium mb-3">Welcome</div>
                    </div>
                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Username</label>
                        <InputText id="email1" type="text" placeholder="Username" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="credenciales.username" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="credenciales.password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }" :feedback="false"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                        </div>
                        <Button 
                            label="Login"
                            class="w-full p-3 p-button-outlined loginbtn" 
                            @click="ingresar()"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/boot/axios';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Message from 'primevue/message';

const router = useRouter();
const messageFlag = ref(false);
const messageTxt = ref('');
const messageSeverity = ref('');

const credenciales = ref({
    username: '',
    password: ''    
});

async function ingresar() {
    try {
    let payload = { 
        username: credenciales.value.username, 
        password: credenciales.value.password
    }
    const res = await api.post("/auth/login", payload);
    const login = res.data.login;
    localStorage.setItem("ardiUserData", JSON.stringify({
      user_id: login.user_id,
      username: login.username,
      token: login.token,
      expires_at: login.expires_at
    }));
    router.push({name: 'chats'});
  } catch (err) {
    console.error("Login error:", err);
    if (err.response?.data?.detail) {
      throw new Error(err.response.data.detail);
    }
    throw new Error("Login failed.");
  }
}


</script>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}

.loginbtn{
    border: 1px solid #071847d8;
    color: #071847d8;
}
</style>
<template>
  <!-- Floating Button -->
  <div class="assistant-bubble" @click="toggle">
    <i class="pi pi-comments"></i>
    <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
  </div>

  <!-- Chat Panel -->
  <transition name="fade">
    <div v-if="isOpen" class="chat-panel">
      <header class="chat-header">
        <button class="close" @click="toggle">
          ✕
        </button>
      </header>

      <ChatComponent :messages="messages" @new-message="handleNewMessage" />

    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";
import ChatComponent from "@/views/chats.vue";


const isOpen = ref(false);
const unreadCount = ref(0);
const messages = ref([]);

function toggle() {
  isOpen.value = !isOpen.value;
  unreadCount.value = 0;
}

function handleNewMessage(msg) {
  messages.value.push(msg);
  if (!isOpen.value) unreadCount.value++;
}
</script>

<style scoped>
:deep(.layout) {
  height: 92% !important;
}

/* Floating bubble */
.assistant-bubble {
  position: fixed;
  bottom: 22px;
  right: 22px;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: #071847d8;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0,0,0,0.26);
  z-index: 9999;
}

.badge {
  position: absolute;
  top: -3px;
  right: -2px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 9px;
}

/* Floating chat window */
.chat-panel {
  position: fixed;
  bottom: 90px;
  right: 22px;
  width: 400px;
  height: 580px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 25px rgba(0,0,0,0.18);
  overflow: hidden;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  animation: pop 0.2s ease-out;
}

/* Header */
.chat-header {
  height: 50px;
  background: linear-gradient(135deg, #071847d8, #071847d8);
  color: white;
  display: flex;
  align-items: center;
  padding: 8px 14px;
  justify-content: space-between;
}
.chat-header .title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo {
  width: 26px;
  height: 26px;
}
.close {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes pop {
  from { transform: scale(.9); opacity: .4; }
  to { transform: scale(1); opacity: 1; }
}
</style>

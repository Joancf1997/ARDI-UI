<template>
  <div class="layout">

    <!-- LEFT THREADS SIDEBAR -->
    <aside 
      class="sidebar" 
      :class="{ hidden: !showSidebar }"
    >
      <div class="sidebar-header">
        <h3>Chats</h3>
        <button class="new-thread" @click="createThread()" >New Chat</button>
      </div>

      <div class="thread-list">
        <div 
          v-for="t in threads" 
          :key="t.id"
          :class="['thread-item', { active: t.id === currentThreadId }]"
          @click="selectThread(t.id)"
        >
          <span>{{ t.name || ('Thread ' + t.id.slice(0,5)) }}</span>
        </div>
      </div>
    </aside>

    <!-- RIGHT CHAT WINDOW -->
    <div class="chat-container">

      <Dialog v-model:visible="showOutputDialog" header="References" modal style="width: 70vw;">
        <TabView>
          <TabPanel
            v-for="tab in outputObject"
            :key="tab.value"
            :header="tab.title"
          >
            <vue-json-pretty :data="tab.content" />
          </TabPanel>
        </TabView>
      </Dialog>

      <div class="chat-shell">

        <!-- Header -->
        <header class="chat-header">
          <button class="toggle-btn" @click="showSidebar = !showSidebar">
            ☰
          </button>

          <div class="title">
            <span class="logo">
              <img src="/layout/images/ARD-Icon.png" alt="Logo" height="50" class="mr-2" />
            </span>
            <div>
              <h2>ARDI</h2>
              <p class="subtitle">Ask me about the user segments</p>
            </div>
          </div>
        </header>

        <!-- Messages -->
        <main ref="scrollEl" class="chat-main">
          <div v-for="m in messages" :key="m.id" class="msg-row" :class="m.role">
            <div class="avatar">
              <span v-if="m.role==='assistant'">
                <img src="/layout/images/ARD-Icon.png" alt="Logo" height="20" class="mr-2" />
              </span>
              <span v-else>
                <i class="pi pi-user" style="font-size: 1rem"></i>
              </span>
            </div>

            <div class="bubble">
              <div class="content" v-if="m.role!=='typing'">
                <div class="content markdown" v-html="renderMarkdown(m.content)"></div>
                <button class="btnReferences" v-if="(m.role==='assistant') && (m.outputs.length > 0)" @click="viewOutputs(m.outputs)"> 
                  <i class="pi pi-link" /> {{ m.outputs.length }}
                </button>
              </div>

              <div v-else class="typing">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              </div>

              <div class="meta">
                <span>{{ timeAgo(m.timestamp) }}</span>
              </div>
            </div>
          </div>
        </main>

        <!-- Composer -->
        <footer class="chat-footer">
          <textarea
            v-model="draft"
            class="composer"
            rows="1"
            placeholder="Type a message…"
            @keydown.enter.exact.prevent="send()"
            @keydown.enter.shift.stop
            @input="autoResize"
            ref="inputEl"
          ></textarea>
          <button class="send" :disabled="sending || !draft.trim()" @click="send">
            <i class="pi pi-send" /> Send
          </button>
        </footer>
      </div>

    </div>
  </div>
</template>


<script setup>
import api from '@/boot/axios';
import { marked } from "marked";
import { ref, nextTick, onMounted } from "vue";
import Dialog from 'primevue/dialog';
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";


/* SIDEBAR TOGGLE */
const showSidebar = ref(true);


/* THREADS STATE */
const threads = ref([]);  
const currentThreadId = ref(null);

const userId = "11111111-1111-1111-1111-111111111111"; 

/* CHAT STATE */
const messages = ref([]);
const draft = ref("");
const sending = ref(false);
const scrollEl = ref(null);
const inputEl = ref(null);

// references dialog
const showOutputDialog = ref(false);
const outputObject = ref([])

onMounted(async () => {
  await loadThreads();
  autoResize();
  scrollToBottom();
});


/* LOAD THREADS form user */
async function loadThreads() {
  const res = await api.get('/threads', {
    params: { user_id: userId }
  });
  threads.value = res.data ?? [];
  if (threads.value.length > 0) {
    selectThread(threads.value[0].id);
  }
}

/* LOAD MESSAGES FOR A THREAD */
async function selectThread(id) {
  currentThreadId.value = id;

  const res = await api.get(`/chat/history/${id}`, {
    params: { user_id: userId }
  });

  messages.value = res.data.map(m => ({
    id: m.id,                           
    role: m.role,
    content: m.content,
    response_to: m.response_to ?? null, 
    outputs: m.outputs,
    timestamp: m.timestamp             
  }));

  await nextTick();
  scrollToBottom();
}

async function renameThread(threadId, newName) {
  const res = await api.put(`/chat/thread/${threadId}/rename`, {
    name: newName,
    user_id: userId
  });

  const updated = res.data.thread;

  // Update local thread list
  const idx = threads.value.findIndex(t => t.id === threadId);
  if (idx !== -1) {
    threads.value[idx].name = updated.name;
  }

  // If currently selected, update UI
  if (currentThreadId.value === threadId) {
    currentThreadName.value = updated.name;
  }
}

/* CREATE A NEW THREAD */
async function createThread() {
  const res = await api.post('/chat/newThread', {
    user_id: userId
  });
  threads.value.push(res.data.thread);
  selectThread(res.data.thread.id);
}

/* HELPERS */
function cryptoRandomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function timeAgo(ts) {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  return `${h}h`;
}

function autoResize() {
  const el = inputEl.value;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 180) + "px";
}

function renderMarkdown(md) {
  return marked(md ?? "");
}


/* SEND MESSAGE */
const send = async () => {
  const text = draft.value.trim();
  if (!text || sending.value) return;

  messages.value.push({
    id: cryptoRandomId(),
    role: "user",
    content: text,
    outputs: [],
    timestamp: Date.now()
  });

  draft.value = "";
  await nextTick();
  autoResize();
  scrollToBottom();

  const typingId = cryptoRandomId();
  messages.value.push({
    id: typingId,
    role: "typing",
    content: "",
    outputs: [],
    timestamp: Date.now()
  });

  sending.value = true;

  try {

    let payload = {
      question: text,
      thread_id: currentThreadId.value
    }

    api.post('/chat/ask', payload)
    .then((response) => {
      const idx = messages.value.findIndex(m => m.id === typingId);

      if (response.status === 200) {
        console.log(response.data.response)
        messages.value.splice(idx, 1, {
          id: cryptoRandomId(),
          role: "assistant",
          content: response.data.response.response,
          outputs: response.data.response.outputs,
          timestamp: Date.now()
        });
      }
    })
    .catch((error) => {		
      console.log(error)
    })

  } finally {
    sending.value = false;
    await nextTick();
    scrollToBottom();
  }
}


function scrollToBottom() {
  const el = scrollEl.value;
  if (!el) return;
  el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
}


const viewOutputs = (outputs) => {
  showOutputDialog.value = true 
  outputObject.value = outputs.map((obj, index) => ({
    value: index.toString(),
    title: `Segment ${obj.segment_id ?? index}`,
    content: obj
  }))
}

</script>


<style scoped>
/* SIDEBAR + TOGGLE LAYOUT */
.layout {
  display: flex;
  height: 85vh;
}

.sidebar {
  width: 260px;
  border-right: 1px solid #ddd;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease;
}

.sidebar.hidden {
  transform: translateX(-260px);
}

.toggle-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  margin-right: 12px;
}


/* SIDEBAR CONTENT */
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.new-thread {
  background: #071847;
  color: white;
  border: none;
  width: 90px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
}

.thread-list {
  overflow-y: auto;
  flex: 1;
}

.thread-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f1f1f1;
}

.thread-item:hover {
  background: #e9e9ff;
}

.thread-item.active {
  background: #071847;
  color: white;
  font-weight: bold;
}

/* CHAT CONTAINER */
.chat-container {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

/* ORIGINAL CHAT UI BELOW */
.chat-shell {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  border: 1px solid #eee;
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
}

.chat-header {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  display: flex;
  align-items: center;
}

.title {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* SAME MESSAGE STYLES AS BEFORE */
.chat-main {
  overflow-y: auto;
  padding: 16px 20px;
  background: radial-gradient(40px 40px at 10% 0, #fafafa 0, rgba(255,255,255,0) 70%), #fff;
}

.msg-row {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.msg-row.user { flex-direction: row-reverse; }

.avatar {
  width: 32px;
  height: 32px;
  background: #f3f3f6;
  border-radius: 8px;
  display: grid;
  place-items: center;
}

.msg-row.user .avatar {
  background: #eef3ff;
}

.bubble {
  max-width: min(780px, 80%);
}

/* OWNER MESSAGE */
.msg-row.user .bubble {
  background: #071847d8;
  color: white;
  border-radius: 14px;
  padding: 12px 14px;
}

/* BOT MESSAGE */
.msg-row.assistant .bubble {
  background: #f7f7fb;
  border: 1px solid #eee;
  padding: 12px 14px;
  border-radius: 14px;
}

.typing {
  display: inline-flex;
  gap: 6px;
  padding: 2px 0;
}

.dot {
  width: 6px;
  height: 6px;
  background: #8b8ca3;
  border-radius: 50%;
  animation: blink 1.2s infinite ease-in-out;
}

.dot:nth-child(2) { animation-delay: .15s; }
.dot:nth-child(3) { animation-delay: .3s; }

@keyframes blink {
  0%, 60%, 100% { opacity: .25; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-2px); }
}

.meta {
  margin-top: 6px;
  font-size: 11px;
  color: #9aa0a6;
}

/* Composer */
.chat-footer {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  background: white;
}

.composer {
  width: 100%;
  resize: none;
  border-radius: 12px;
  padding: 12px 14px;
  border: 1px solid #e6e6ef;
  background: #fafafc;
}

.send {
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  min-width: 86px;
  border: 1px solid #071847;
  background: #071847;
  color: white;
}

.btnReferences{
  width: 80px;
  height: 20px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid #071847;
  background: white;
  cursor: pointer;
}
</style>

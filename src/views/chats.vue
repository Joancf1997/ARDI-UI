<template>
  <div class="chat-shell">
    <!-- Header -->
    <header class="chat-header">
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
            <!-- keep it simple & safe: plain text with line breaks -->
            <pre class="plaintext">{{ m.content }}</pre>
          </div>

          <!-- typing indicator -->
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
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";

const messages = ref([
  { id: cryptoRandomId(), role: "assistant", content: "Hi! How can I help you today?", timestamp: Date.now() }
]);

const draft = ref("");
const sending = ref(false);
const scrollEl = ref(null);
const inputEl = ref(null);

onMounted(() => {
  autoResize();
  scrollToBottom();
});

function cryptoRandomId() {
  // simple unique id
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

async function send() {
  const text = draft.value.trim();
  if (!text || sending.value) return;

  // push user message
  messages.value.push({
    id: cryptoRandomId(),
    role: "user",
    content: text,
    timestamp: Date.now()
  });
  draft.value = "";
  await nextTick();
  autoResize();
  scrollToBottom();

  // show typing bubble
  const typingId = cryptoRandomId();
  messages.value.push({
    id: typingId,
    role: "typing",
    content: "",
    timestamp: Date.now()
  });
  sending.value = true;

  try {
    // --- OPTION A: call your backend (non-streaming example) ---
    // const replyText = await callBackend(text, messages.value);

    // --- OPTION B: local mock (delete when wired to backend) ---
    const replyText = await mockAssistant(text);

    // replace typing bubble with real assistant message
    const idx = messages.value.findIndex(m => m.id === typingId);
    if (idx !== -1) {
      messages.value.splice(idx, 1, {
        id: cryptoRandomId(),
        role: "assistant",
        content: replyText,
        timestamp: Date.now()
      });
    }
  } catch (e) {
    // show error
    const idx = messages.value.findIndex(m => m.id === typingId);
    if (idx !== -1) {
      messages.value.splice(idx, 1, {
        id: cryptoRandomId(),
        role: "assistant",
        content: "⚠️ Sorry, something went wrong. Please try again.",
        timestamp: Date.now()
      });
    }
    // console.error(e);
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

/* ---------- Backend hook (replace with your API) ---------- */
async function callBackend(userText, history) {
  // Example POST to your server
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: userText,
      history: history
        .filter(m => m.role !== "typing")
        .map(({ role, content }) => ({ role, content }))
    })
  });
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  return data.reply; // { reply: "..." }
}

/* ---------- Mock assistant for demo ---------- */
function mockAssistant(prompt) {
  const canned = [
    "Here's a quick summary:",
    "Sure! Here are some ideas:",
    "I can help with that. First, …",
    "To solve this, consider:"
  ];
  const head = canned[Math.floor(Math.random() * canned.length)];
  const body =
    "\n\n• Point A\n• Point B\n• Point C\n\n" +
    "If you want, I can refine or give code examples.";
  // simulate latency
  return new Promise(resolve => setTimeout(() => resolve(`${head} "${prompt}"${body}`), 900));
}
</script>


<style scoped>
/* Shell */
.chat-shell {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 85vh;             
  border: 1px solid #eee;
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
}

/* Header */
.chat-header {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}
.title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo {
  font-size: 22px;
}
.subtitle {
  margin-top: 2px;
  color: #888;
  font-size: 12px;
}

/* Messages pane */
.chat-main {
  overflow-y: auto;
  padding: 16px 20px;
  background:
    radial-gradient(40px 40px at 10% 0, #fafafa 0, rgba(255,255,255,0) 70%),
    #fff;
}

/* Message rows */
.msg-row {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}
.msg-row.user { flex-direction: row-reverse; }
.msg-row .avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f3f3f6;
  display: grid;
  place-items: center;
  flex: 0 0 32px;
}
.msg-row.user .avatar { background: #eef3ff; }

/* Bubbles */
.bubble {
  max-width: min(780px, 80%);
}
.msg-row.assistant .bubble {
  background: #f7f7fb;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 12px 14px;
}
.msg-row.user .bubble {
  background: #071847d8;
  color: #fff;
  border-radius: 14px;
  padding: 12px 14px;
}

/* Plaintext content */
pre.plaintext {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  line-height: 1.45;
}

/* Typing indicator */
.typing {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 2px 0;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8b8ca3;
  animation: blink 1.2s infinite ease-in-out;
}
.dot:nth-child(2) { animation-delay: .15s; }
.dot:nth-child(3) { animation-delay: .3s; }
@keyframes blink {
  0%, 60%, 100% { opacity: .25; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-2px); }
}

/* Meta (time) */
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
  background: #fff;
}
.composer {
  width: 100%;
  resize: none;
  border: 1px solid #e6e6ef;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  line-height: 1.4;
  outline: none;
  background: #fafafc;
}
.composer:focus {
  border-color: #c7c7f7;
  background: #fff;
}
.send {
  padding: 0 14px;
  border: 1px solid #071847;
  background: #071847;
  color: #fff;
  border-radius: 12px;
  min-width: 86px;
  cursor: pointer;
}
.send:disabled {
  opacity: .5;
  cursor: not-allowed;
}
</style>

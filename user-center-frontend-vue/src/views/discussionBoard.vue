<template>
  <div class="discussion-board">
    <header class="db-header">
      <h1>讨论板</h1>
      <div class="controls">
        <input
          v-model="searchQuery"
          class="search"
          placeholder="搜索标题或作者..."
        />
        <button class="btn primary" @click="openNew = true">发起话题</button>
      </div>
    </header>

    <section v-if="paginatedTopics.length" class="topics">
      <div v-for="topic in paginatedTopics" :key="topic.id" class="topic">
        <div class="meta">
          <h3 class="title">{{ topic.title }}</h3>
          <div class="sub">
            by <strong>{{ topic.author }}</strong> ·
            {{ formatDate(topic.createdAt) }}
          </div>
        </div>
        <div class="body">{{ excerpt(topic.body) }}</div>
        <div class="actions">
          <div class="left">
            <button class="btn" @click="toggleLike(topic.id)">
              {{ topic.liked ? "取消点赞" : "点赞" }} ({{ topic.likes }})
            </button>
            <button class="btn ghost" @click="openDetail(topic)">
              查看详情
            </button>
          </div>
          <div class="right">
            <span class="replies">回复 {{ topic.replies }}</span>
            <button class="btn danger" @click="removeTopic(topic.id)">
              删除
            </button>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="empty">
      <p>当前没有话题。试试点击“发起话题”来开始讨论。</p>
    </section>

    <nav class="pagination" v-if="totalPages > 1">
      <button class="btn" :disabled="page === 1" @click="page--">上一页</button>
      <span>第 {{ page }} / {{ totalPages }} 页</span>
      <button class="btn" :disabled="page === totalPages" @click="page++">
        下一页
      </button>
    </nav>

    <!-- New Topic Modal -->
    <div class="modal" v-if="openNew">
      <div class="modal-inner">
        <h2>新建话题</h2>
        <label>
          标题
          <input v-model="newTopic.title" maxlength="120" />
        </label>
        <label>
          作者
          <input v-model="newTopic.author" maxlength="60" />
        </label>
        <label>
          内容
          <textarea
            v-model="newTopic.body"
            rows="6"
            maxlength="2000"
          ></textarea>
        </label>
        <div class="modal-actions">
          <button class="btn" @click="createTopic">发布</button>
          <button class="btn ghost" @click="resetNew">取消</button>
        </div>
        <div class="hint">提示：标题最大 120 字，内容最大 2000 字。</div>
      </div>
    </div>

    <!-- Detail Drawer -->
    <div class="drawer" v-if="detailTopic">
      <div class="drawer-inner">
        <button class="close" @click="detailTopic = null">关闭</button>
        <h2>{{ detailTopic.title }}</h2>
        <div class="sub">
          by {{ detailTopic.author }} · {{ formatDate(detailTopic.createdAt) }}
        </div>
        <div class="full-body">{{ detailTopic.body }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";

type Reply = {
  id: string;
  author: string;
  body: string;
  createdAt: number;
};

type Topic = {
  id: string;
  title: string;
  author: string;
  body: string;
  createdAt: number;
  likes: number;
  liked?: boolean;
  replies: number;
  repliesList?: Reply[];
};

const STORAGE_KEY = "discussion_topics_v1";

const defaultTopics: Topic[] = [
  {
    id: String(Date.now() - 1000 * 60 * 60 * 24),
    title: "欢迎来到讨论板！",
    author: "系统",
    body: "这里是讨论区的示例话题。你可以发起新话题，回复，或者点赞。",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    likes: 3,
    liked: false,
    replies: 2,
    repliesList: [
      {
        id: uid(),
        author: "小红",
        body: "感谢分享！",
        createdAt: Date.now() - 1000 * 60 * 60 * 6,
      },
      {
        id: uid(),
        author: "小李",
        body: "期待更多内容。",
        createdAt: Date.now() - 1000 * 60 * 60 * 2,
      },
    ],
  },
  {
    id: String(Date.now() - 1000 * 60 * 60),
    title: "前端学习资源分享",
    author: "小明",
    body: "分享一些我平时常看的前端学习资源，包含 Vue、TypeScript、Vite 等。欢迎补充。",
    createdAt: Date.now() - 1000 * 60 * 60,
    likes: 5,
    liked: false,
    replies: 8,
    repliesList: [
      {
        id: uid(),
        author: "小王",
        body: "很有帮助，已收藏。",
        createdAt: Date.now() - 1000 * 60 * 30,
      },
    ],
  },
];

function loadTopics(): Topic[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultTopics;
    const parsed = JSON.parse(raw) as Topic[];
    // ensure backward compat and provide repliesList default
    return parsed.map((t) => ({
      ...t,
      likes: t.likes ?? 0,
      replies: t.replies ?? (t.repliesList ? t.repliesList.length : 0),
      repliesList: Array.isArray((t as any).repliesList)
        ? (t as any).repliesList
        : [],
    }));
  } catch (e) {
    return defaultTopics;
  }
}

const topics = ref<Topic[]>(loadTopics());
const searchQuery = ref("");
const page = ref(1);
const perPage = ref(6);
const openNew = ref(false);
const detailTopic = ref<Topic | null>(null);

const newTopic = reactive({ title: "", author: "", body: "" });

watch(
  topics,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    } catch (e) {
      // ignore
    }
  },
  { deep: true }
);

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return topics.value.slice().sort((a, b) => b.createdAt - a.createdAt);
  return topics.value
    .filter((t) =>
      (t.title + " " + t.author + " " + t.body).toLowerCase().includes(q)
    )
    .sort((a, b) => b.createdAt - a.createdAt);
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / perPage.value))
);

const paginatedTopics = computed(() => {
  if (!filtered.value.length) return [];
  const p = Math.max(1, Math.min(page.value, totalPages.value));
  const start = (p - 1) * perPage.value;
  return filtered.value.slice(start, start + perPage.value);
});

watch([searchQuery], () => {
  page.value = 1;
});

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString();
}

function excerpt(body: string, len = 160) {
  const txt = body.replace(/\s+/g, " ").trim();
  if (txt.length <= len) return txt;
  return txt.slice(0, len) + "...";
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function createTopic() {
  const title = newTopic.title.trim();
  const author = newTopic.author.trim() || "匿名";
  const body = newTopic.body.trim();
  if (!title) {
    alert("标题不能为空");
    return;
  }
  if (!body) {
    alert("内容不能为空");
    return;
  }
  const t: Topic = {
    id: uid(),
    title,
    author,
    body,
    createdAt: Date.now(),
    likes: 0,
    liked: false,
    replies: 0,
  };
  topics.value.unshift(t);
  resetNew();
  // jump to first page so new topic is visible
  page.value = 1;
}

function resetNew() {
  newTopic.title = "";
  newTopic.author = "";
  newTopic.body = "";
  openNew.value = false;
}

function toggleLike(id: string) {
  const t = topics.value.find((x) => x.id === id);
  if (!t) return;
  t.liked = !t.liked;
  t.likes = (t.likes || 0) + (t.liked ? 1 : -1);
}

function removeTopic(id: string) {
  if (!confirm("确认删除该话题？")) return;
  topics.value = topics.value.filter((t) => t.id !== id);
}

function openDetail(t: Topic) {
  detailTopic.value = t;
}
</script>

<style scoped>
.discussion-board {
  max-width: 980px;
  margin: 24px auto;
  padding: 16px;
}
.db-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.db-header h1 {
  margin: 0;
  font-size: 1.4rem;
}
.controls {
  display: flex;
  gap: 8px;
  align-items: center;
}
.search {
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.btn {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
}
.btn.primary {
  background: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}
.btn.ghost {
  background: transparent;
}
.btn.danger {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #b91c1c;
}
.topics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.topic {
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 6px;
  background: #fff;
}
.topic .meta {
  margin-bottom: 8px;
}
.title {
  margin: 0 0 4px 0;
}
.sub {
  color: #666;
  font-size: 0.9rem;
}
.body {
  color: #333;
  margin-bottom: 8px;
}
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.actions .left {
  display: flex;
  gap: 8px;
}
.replies {
  color: #555;
}
.empty {
  padding: 40px;
  text-align: center;
  color: #666;
}
.pagination {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 14px;
  align-items: center;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-inner {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  max-width: 680px;
  width: 100%;
}
.modal-inner label {
  display: block;
  margin-bottom: 8px;
}
.modal-inner input,
.modal-inner textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
}
.hint {
  font-size: 0.85rem;
  color: #888;
  margin-top: 8px;
}

.drawer {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 420px;
  background: #fafafa;
  border-left: 1px solid #eee;
  box-shadow: -6px 0 20px rgba(0, 0, 0, 0.04);
  padding: 16px;
}
.drawer-inner {
  height: 100%;
  overflow: auto;
}
.drawer .close {
  float: right;
}
.full-body {
  white-space: pre-wrap;
  margin-top: 12px;
}
</style>

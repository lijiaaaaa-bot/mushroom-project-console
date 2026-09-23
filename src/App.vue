<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import BlockerCallout from './components/BlockerCallout.vue'
import ChecklistPanel from './components/ChecklistPanel.vue'
import ProjectHeader from './components/ProjectHeader.vue'
import QuickLinks from './components/QuickLinks.vue'
import WorkstreamBoard from './components/WorkstreamBoard.vue'
import { loadProjectStatus, summarize } from './data/project'
import type { ProjectStatus } from './data/types'

const status = ref<ProjectStatus | null>(null)
const error = ref<string | null>(null)
const loading = ref(true)

const summary = computed(() => (status.value ? summarize(status.value) : null))

watch(status, (value) => {
  document.title = value ? `${value.project.console} · ${value.project.slug}` : '蘑菇项目指挥台'
})

onMounted(() => {
  void reload()
})

async function reload() {
  loading.value = true
  error.value = null
  try {
    status.value = await loadProjectStatus()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '状态文件读取失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-svh pb-10">
    <div v-if="status && summary" class="pb-8">
      <ProjectHeader
        :project="status.project"
        :summary="summary"
        :workstreams="status.workstreams"
        :loading="loading"
        @reload="reload"
      />

      <p
        v-if="error"
        class="mx-auto mt-4 max-w-6xl px-4 text-sm text-coral sm:px-6"
        role="alert"
      >
        重新读取失败：{{ error }}。页面仍显示上次成功的台账。
      </p>

      <BlockerCallout :blockers="status.blockers" />

      <div class="mx-auto mt-8 max-w-6xl space-y-6 px-4 sm:px-6">
        <WorkstreamBoard :items="status.workstreams" />
        <div class="grid items-start gap-6 lg:grid-cols-2">
          <ChecklistPanel :items="status.checklist" />
          <QuickLinks :links="status.links" />
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="mx-auto max-w-6xl px-4 py-8 sm:px-6" aria-live="polite">
      <p class="text-sm text-muted">正在读取 status.json</p>
      <div class="mt-4 h-36 animate-pulse rounded-lg border border-line bg-panel" />
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <div v-for="n in 4" :key="n" class="h-28 animate-pulse rounded-lg border border-line bg-panel" />
      </div>
    </div>

    <div v-else class="mx-auto max-w-xl px-4 py-16 sm:px-6" role="alert">
      <p class="font-mono text-xs tracking-[0.14em] text-coral">读取失败</p>
      <h1 class="mt-2 text-2xl font-semibold">台账没有打开</h1>
      <p class="mt-3 text-sm leading-6 text-muted">{{ error }}</p>
      <p class="mt-2 text-sm leading-6 text-muted">
        修正 public/status.json 后点重新读取。字段说明在 README。
      </p>
      <button
        type="button"
        class="mt-5 inline-flex min-h-9 items-center rounded-md border border-line bg-raised px-3 text-xs text-ink hover:border-brass/70 hover:text-brass"
        @click="reload"
      >
        重新读取
      </button>
    </div>

    <footer class="mx-auto max-w-6xl px-4 text-xs leading-5 text-faint sm:px-6">
      mushroom-project-console · 只跟踪平台构建，不放种植业务。进度改 public/status.json。
    </footer>
  </div>
</template>

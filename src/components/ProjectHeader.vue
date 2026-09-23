<script setup lang="ts">
import { formatUpdatedAt, padIndex } from '../data/project'
import type { ProjectMeta, StatusSummary, Workstream } from '../data/types'
import Mark from './Mark.vue'

defineProps<{
  project: ProjectMeta
  summary: StatusSummary
  workstreams: Workstream[]
  loading: boolean
}>()

defineEmits<{ reload: [] }>()
</script>

<template>
  <header class="sticky top-0 z-10 border-b border-line/80 bg-canvas/95 backdrop-blur-sm">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
      <div class="flex min-w-0 items-center gap-2.5 text-brass">
        <Mark class="shrink-0" />
        <div class="min-w-0">
          <p class="truncate text-sm text-ink">{{ project.console }}</p>
          <p class="font-mono text-[11px] tracking-[0.14em] text-faint">{{ project.phase }}</p>
        </div>
      </div>
      <button
        type="button"
        class="inline-flex min-h-9 shrink-0 items-center rounded-md border border-line bg-raised px-3 text-xs text-ink transition hover:border-brass/70 hover:text-brass disabled:cursor-wait disabled:opacity-60"
        :disabled="loading"
        @click="$emit('reload')"
      >
        {{ loading ? '读取中' : '重新读取' }}
      </button>
    </div>
  </header>

  <section class="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8">
    <p class="font-mono text-xs text-brass sm:text-sm">{{ project.slug }}</p>
    <h1 class="mt-2 text-[1.7rem] leading-tight font-semibold text-ink sm:text-4xl">
      {{ project.name }}
    </h1>
    <p class="mt-3 max-w-3xl text-base leading-7 text-ink sm:text-lg">{{ project.headline }}</p>
    <p class="mt-1 max-w-3xl text-sm leading-6 text-muted">下一步：{{ project.next }}</p>

    <div class="mt-5 sm:max-w-md">
      <div class="grid grid-cols-3 gap-2">
        <div class="rounded-md border border-line bg-panel px-3 py-2">
          <p class="text-[11px] text-muted">已完成</p>
          <p class="mt-1 font-mono text-xl text-moss tabular-nums">{{ summary.counts.done }}</p>
        </div>
        <div class="rounded-md border border-line bg-panel px-3 py-2">
          <p class="text-[11px] text-muted">进行中</p>
          <p class="mt-1 font-mono text-xl text-amber tabular-nums">{{ summary.counts.active }}</p>
        </div>
        <div class="rounded-md border border-line bg-panel px-3 py-2">
          <p class="text-[11px] text-muted">阻塞</p>
          <p class="mt-1 font-mono text-xl text-coral tabular-nums">{{ summary.counts.blocked }}</p>
        </div>
      </div>

      <div class="mt-3 flex gap-1" aria-hidden="true">
      <span
        v-for="(item, index) in workstreams"
        :key="item.id"
        class="h-1.5 flex-1 rounded-full"
        :class="{
          'bg-moss': item.status === 'done',
          'bg-amber': item.status === 'active',
          'bg-coral': item.status === 'blocked',
        }"
        :title="`${padIndex(index)} ${item.name}`"
      />
      </div>
    </div>
    <p class="mt-2 font-mono text-[11px] text-faint">
      台账更新 {{ formatUpdatedAt(project.updatedAt) }} · {{ summary.counts.done }}/{{
        summary.total
      }}
      已完成
    </p>
  </section>
</template>

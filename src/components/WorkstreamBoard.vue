<script setup lang="ts">
import { padIndex } from '../data/project'
import type { Workstream } from '../data/types'
import StatusPill from './StatusPill.vue'

defineProps<{ items: Workstream[] }>()
</script>

<template>
  <section aria-labelledby="workstream-heading">
    <div class="mb-3 flex items-baseline justify-between gap-3">
      <h2 id="workstream-heading" class="text-sm font-medium text-ink">工作流</h2>
      <p class="font-mono text-[11px] text-faint">{{ items.length }} 条</p>
    </div>

    <p
      v-if="items.length === 0"
      class="rounded-lg border border-dashed border-line px-4 py-6 text-sm text-muted"
    >
      状态文件里还没有工作流。
    </p>

    <ul v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="(item, index) in items"
        :key="item.id"
        class="relative overflow-hidden rounded-lg border border-line bg-panel"
      >
        <span
          class="absolute inset-y-0 left-0 w-1"
          :class="{
            'bg-moss': item.status === 'done',
            'bg-amber': item.status === 'active',
            'bg-coral': item.status === 'blocked',
          }"
          aria-hidden="true"
        />
        <div class="flex h-full flex-col px-4 py-3.5 pl-5">
          <div class="flex items-center justify-between gap-3">
            <span class="font-mono text-[11px] text-faint">{{ padIndex(index) }}</span>
            <StatusPill :status="item.status" />
          </div>
          <h3 class="mt-3 text-base font-medium text-ink">{{ item.name }}</h3>
          <p class="mt-1.5 text-sm leading-6 text-muted">{{ item.note }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>

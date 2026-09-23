<script setup lang="ts">
import { padIndex } from '../data/project'
import type { Blocker } from '../data/types'

defineProps<{ blockers: Blocker[] }>()
</script>

<template>
  <section class="mx-auto mt-6 max-w-6xl px-4 sm:px-6" aria-label="当前阻塞">
    <div
      v-if="blockers.length === 0"
      class="rounded-lg border border-moss/30 bg-moss/10 px-4 py-3 text-sm text-moss"
    >
      当前没有阻塞。
    </div>
    <ul v-else class="space-y-3">
      <li
        v-for="(blocker, index) in blockers"
        :key="blocker.id"
        class="rounded-lg border border-coral/40 bg-coral/10 px-4 py-4 sm:px-5"
      >
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p class="font-mono text-[11px] tracking-[0.14em] text-coral">
            阻塞 {{ padIndex(index) }}
          </p>
          <p class="font-mono text-[11px] text-faint">自 {{ blocker.since }}</p>
        </div>
        <h2 class="mt-1.5 text-base font-medium text-ink sm:text-lg">{{ blocker.title }}</h2>
        <p class="mt-1.5 max-w-3xl text-sm leading-6 text-muted">{{ blocker.detail }}</p>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { groupByDay } from '../data/project'
import type { CheckItem } from '../data/types'

const props = defineProps<{ items: CheckItem[] }>()
const groups = computed(() => groupByDay(props.items))
const doneCount = computed(() => props.items.filter((item) => item.done).length)
</script>

<template>
  <section class="rounded-lg border border-line bg-panel" aria-labelledby="checklist-heading">
    <div class="flex items-baseline justify-between gap-3 border-b border-line px-4 py-3">
      <h2 id="checklist-heading" class="text-sm font-medium text-ink">架构清单</h2>
      <p class="font-mono text-[11px] text-faint tabular-nums">{{ doneCount }}/{{ items.length }}</p>
    </div>

    <p v-if="items.length === 0" class="px-4 py-6 text-sm text-muted">清单是空的。</p>

    <div v-else class="px-4 py-2">
      <div v-for="group in groups" :key="group.day" class="py-2">
        <p class="font-mono text-[11px] tracking-[0.12em] text-brass">{{ group.day }}</p>
        <ul>
          <li
            v-for="item in group.items"
            :key="item.id"
            class="flex gap-3 border-b border-line/70 py-2.5 last:border-b-0"
          >
            <span
              class="mt-0.5 grid size-4 shrink-0 place-items-center rounded-[3px] border"
              :class="item.done ? 'border-moss bg-moss/15 text-moss' : 'border-faint'"
              aria-hidden="true"
            >
              <svg v-if="item.done" viewBox="0 0 12 12" class="size-3" fill="none">
                <path
                  d="M2.5 6.2 4.7 8.4 9.5 3.6"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <p class="text-sm leading-6" :class="item.done ? 'text-muted' : 'text-ink'">
              <span class="sr-only">{{ item.done ? '已勾选' : '未勾选' }}</span>
              {{ item.text }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

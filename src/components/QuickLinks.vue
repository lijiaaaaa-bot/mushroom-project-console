<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { isExternalHref } from '../data/project'
import type { QuickLink } from '../data/types'

defineProps<{ links: QuickLink[] }>()

const copied = ref<string | null>(null)
const failed = ref<string | null>(null)
let timer = 0

onUnmounted(() => window.clearTimeout(timer))

async function copy(href: string) {
  window.clearTimeout(timer)
  failed.value = null
  try {
    await navigator.clipboard.writeText(href)
    copied.value = href
  } catch {
    copied.value = null
    failed.value = href
  }
  timer = window.setTimeout(() => {
    copied.value = null
    failed.value = null
  }, 1600)
}
</script>

<template>
  <section class="rounded-lg border border-line bg-panel" aria-labelledby="links-heading">
    <div class="flex items-baseline justify-between gap-3 border-b border-line px-4 py-3">
      <h2 id="links-heading" class="text-sm font-medium text-ink">快速链接</h2>
      <p class="font-mono text-[11px] text-faint">可改 status.json</p>
    </div>

    <p v-if="links.length === 0" class="px-4 py-6 text-sm text-muted">还没有链接。</p>

    <ul v-else class="divide-y divide-line/80">
      <li v-for="link in links" :key="link.href" class="px-4 py-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-sm text-ink">{{ link.label }}</p>
            <p class="mt-1 font-mono text-xs leading-5 break-all text-brass">{{ link.href }}</p>
          </div>
          <div class="flex shrink-0 gap-1.5">
            <a
              v-if="isExternalHref(link.href)"
              class="inline-flex min-h-8 items-center rounded-md border border-line px-2 text-[11px] text-muted transition hover:border-brass/70 hover:text-brass"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
            >
              打开
            </a>
            <button
              type="button"
              class="inline-flex min-h-8 items-center rounded-md border border-line px-2 text-[11px] text-muted transition hover:border-brass/70 hover:text-brass"
              @click="copy(link.href)"
            >
              {{ failed === link.href ? '失败' : copied === link.href ? '已复制' : '复制' }}
            </button>
          </div>
        </div>
        <p class="mt-1.5 text-xs leading-5 text-muted">{{ link.note }}</p>
      </li>
    </ul>
  </section>
</template>

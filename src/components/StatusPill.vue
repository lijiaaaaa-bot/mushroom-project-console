<script setup lang="ts">
import { STATUS_LABEL, type WorkStatus } from '../data/types'

defineProps<{ status: WorkStatus }>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] leading-5"
    :class="{
      'border-moss/40 bg-moss/10 text-moss': status === 'done',
      'border-amber/40 bg-amber/10 text-amber': status === 'active',
      'border-coral/45 bg-coral/10 text-coral': status === 'blocked',
    }"
  >
    <span
      class="size-1.5 rounded-full"
      :class="{
        'bg-moss': status === 'done',
        'bg-amber': status === 'active',
        'bg-coral': status === 'blocked',
      }"
      aria-hidden="true"
    />
    {{ STATUS_LABEL[status] }}
  </span>
</template>

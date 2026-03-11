<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus';

const { data: stats, pending } = await useFetch('/api/dashboard/stats');
const { data: chartData, pending: chartsPending } = await useFetch('/api/dashboard/charts');
const { settings } = useSettings();
const { isAdmin } = useAuth();
const {
  widgets,
  visibleWidgets,
  isEditMode,
  updateWidgetOrder,
  toggleWidgetVisibility,
  cycleWidgetWidth,
  cycleWidgetHeight,
  resetToDefault,
} = useDashboardWidgets();

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: settings.value?.currency || 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

const statCards = computed(() => [
  { id: 'total-products', value: stats.value?.totalProducts ?? 0, alert: false },
  { id: 'low-stock', value: stats.value?.lowStockCount ?? 0, alert: (stats.value?.lowStockCount ?? 0) > 0 },
  { id: 'active-suppliers', value: stats.value?.totalSuppliers ?? 0, alert: false },
  { id: 'total-valuation', value: formatCurrency(stats.value?.totalStockValue ?? 0), alert: false },
]);

function getStatValue(id: string) {
  return statCards.value.find((s) => s.id === id);
}

const ROW_HEIGHT = 140;
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-end justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-gray-900">
          Overview
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Business intelligence and inventory metrics.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          v-if="isAdmin"
          @click="isEditMode = !isEditMode"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all"
          :class="isEditMode 
            ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700' 
            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm'"
        >
          <Icon :name="isEditMode ? 'lucide:check' : 'lucide:layout-grid'" class="h-4 w-4" />
          {{ isEditMode ? 'Done' : 'Edit Dashboard' }}
        </button>
        <div
          class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm"
        >
          <Icon name="lucide:calendar" class="h-4 w-4 text-gray-400" />
          <span class="text-xs font-medium text-gray-700">Last 30 Days</span>
        </div>
      </div>
    </div>

    <div v-if="isEditMode" class="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-blue-900">Widget Settings</h3>
        <button
          @click="resetToDefault()"
          class="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Reset to default
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="widget in widgets"
          :key="widget.id"
          @click="toggleWidgetVisibility(widget.id)"
          class="px-3 py-1.5 text-xs font-medium rounded-lg border transition-all"
          :class="widget.visible 
            ? 'bg-white border-blue-300 text-blue-700 shadow-sm' 
            : 'bg-white/50 border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'"
        >
          <Icon :name="widget.icon" class="h-3 w-3 inline mr-1" />
          {{ widget.title }}
        </button>
      </div>
    </div>

    <VueDraggable
      v-model="visibleWidgets"
      :disabled="!isEditMode"
      :animation="200"
      ghost-class="opacity-50"
      class="grid gap-4 grid-cols-2 lg:grid-cols-4"
      :style="{ gridAutoRows: `${ROW_HEIGHT}px` }"
      @update:model-value="updateWidgetOrder"
    >
      <div
        v-for="widget in visibleWidgets"
        :key="widget.id"
        :style="{
          gridColumn: `span ${widget.width}`,
          gridRow: `span ${widget.height}`,
        }"
        class="transition-all"
      >
        <NuxtLink
          v-if="widget.type === 'stat'"
          :to="isEditMode ? undefined : widget.href"
          :class="[
            'flex flex-col h-full rounded-xl border shadow-sm transition-all group overflow-hidden',
            isEditMode ? 'cursor-grab' : '',
            getStatValue(widget.id)?.alert
              ? 'bg-amber-50 border-amber-200 hover:border-amber-400 hover:shadow-md'
              : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md',
          ]"
        >
          <div class="p-6 flex flex-col flex-1 min-h-0">
            <div class="flex justify-between items-start">
              <p
                class="text-[11px] font-semibold uppercase tracking-widest"
                :class="getStatValue(widget.id)?.alert ? 'text-amber-600' : 'text-gray-400'"
              >
                {{ widget.title }}
              </p>
              <div
                :class="[
                  'p-2.5 rounded-lg',
                  getStatValue(widget.id)?.alert ? 'bg-amber-100' : 'bg-gray-50'
                ]"
              >
                <Icon
                  :name="widget.icon"
                  class="h-4 w-4"
                  :class="getStatValue(widget.id)?.alert ? 'text-amber-500' : 'text-gray-400'"
                />
              </div>
            </div>
            <div class="mt-4 flex items-baseline gap-2">
              <span
                class="text-3xl font-semibold tabular-nums tracking-tight"
                :class="getStatValue(widget.id)?.alert ? 'text-amber-700' : 'text-gray-900'"
              >
                {{ getStatValue(widget.id)?.value }}
              </span>
            </div>
            <div class="mt-auto pt-3">
              <span
                v-if="widget.id === 'low-stock' && (stats?.lowStockCount ?? 0) > 0"
                class="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md"
              >
                <Icon name="lucide:alert-triangle" class="h-3 w-3" />
                Action needed
              </span>
              <span
                v-if="isEditMode"
                class="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Drag to reorder
              </span>
            </div>
          </div>
        </NuxtLink>

        <div
          v-else
          :class="[
            'h-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col transition-all group',
            isEditMode ? 'cursor-grab' : '',
          ]"
        >
          <div class="px-5 py-4 flex items-center justify-between shrink-0 border-b border-gray-100">
            <div class="text-[11px] font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Icon
                :name="widget.icon"
                :class="widget.id === 'low-stock-alerts' ? 'h-3.5 w-3.5 text-amber-500' : 'h-3.5 w-3.5 text-gray-400'"
              />
              <span>{{ widget.title }}</span>
            </div>
            <NuxtLink
              v-if="widget.href && !isEditMode"
              :to="widget.href"
              class="text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors"
            >
              View All
            </NuxtLink>
          </div>

          <div v-if="widget.id === 'stock-velocity'" class="p-5 flex-1 min-h-0">
            <div v-if="chartsPending" class="flex h-full items-center justify-center">
              <Icon name="lucide:loader-2" class="h-6 w-6 animate-spin text-gray-300" />
            </div>
            <ChartsStockMovementsChart
              v-else-if="chartData?.movementsChart"
              :labels="chartData.movementsChart.labels"
              :stock-in="chartData.movementsChart.stockIn"
              :stock-out="chartData.movementsChart.stockOut"
              height="100%"
            />
            <div v-else class="h-full flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200 rounded-lg">
              <Icon name="lucide:bar-chart-2" class="h-8 w-8 mb-2 opacity-30" />
              <span class="text-xs">No movement data yet</span>
            </div>
          </div>

          <div v-if="widget.id === 'category-split'" class="p-5 flex-1 min-h-0 flex items-center justify-center">
            <div v-if="chartsPending" class="skeleton h-32 w-32 rounded-full" />
            <ChartsCategoryDistributionChart
              v-else-if="chartData?.productsByCategory?.length"
              :data="chartData.productsByCategory"
            />
            <div v-else class="h-full flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200 rounded-lg w-full">
              <span class="text-xs">No categories defined</span>
            </div>
          </div>

          <div v-if="widget.id === 'low-stock-alerts'" class="flex-1 min-h-0 overflow-auto">
            <div v-if="pending" class="p-5 space-y-3">
              <div v-for="i in 3" :key="i" class="skeleton h-10 w-full rounded" />
            </div>
            <template v-else-if="stats?.lowStockProducts?.length">
              <NuxtLink
                v-for="product in stats.lowStockProducts"
                :key="product.id"
                :to="`/products/${product.id}`"
                class="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</p>
                  <p class="text-[11px] text-gray-400 mt-0.5 font-mono">{{ product.sku || 'NO-SKU' }}</p>
                </div>
                <div class="text-right flex items-center gap-3">
                  <div class="flex flex-col items-end">
                    <span class="text-sm font-semibold tabular-nums text-red-600">{{ product.stockQuantity }}</span>
                    <span class="text-[10px] text-gray-400">Min: {{ product.stockMin }}</span>
                  </div>
                  <Icon name="lucide:chevron-right" class="h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </NuxtLink>
            </template>
            <div v-else class="h-full flex flex-col items-center justify-center p-5">
              <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 mb-3">
                <Icon name="lucide:check" class="h-6 w-6 text-emerald-500" />
              </div>
              <p class="text-sm font-medium text-gray-900">All stocked up</p>
              <p class="text-xs text-gray-400 text-center mt-1">No products below minimum.</p>
            </div>
          </div>

          <div v-if="widget.id === 'recent-activity'" class="flex-1 min-h-0 overflow-auto">
            <div v-if="pending" class="p-5 space-y-3">
              <div v-for="i in 3" :key="i" class="skeleton h-10 w-full rounded" />
            </div>
            <template v-else-if="stats?.recentMovements?.length">
              <NuxtLink
                v-for="movement in stats.recentMovements"
                :key="movement.id"
                :to="`/movements`"
                class="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div
                    class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                    :class="movement.type === 'in' ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-100 text-gray-400'"
                  >
                    <Icon :name="movement.type === 'in' ? 'lucide:arrow-up' : 'lucide:arrow-down'" class="h-4 w-4" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ movement.product?.name }}</p>
                    <p class="text-[11px] text-gray-400 mt-0.5">{{ formatDate(movement.createdAt) }}</p>
                  </div>
                </div>
                <span
                  class="text-xs font-semibold tabular-nums px-2.5 py-1 rounded-md"
                  :class="movement.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'"
                >
                  {{ movement.type === 'in' ? '+' : '-' }}{{ Math.abs(movement.quantity) }}
                </span>
              </NuxtLink>
            </template>
            <div v-else class="h-full flex flex-col items-center justify-center p-5 text-gray-400">
              <Icon name="lucide:activity" class="h-8 w-8 mb-2 opacity-30" />
              <p class="text-sm">No recent movements.</p>
            </div>
          </div>

          <div
            v-if="isEditMode"
            class="px-5 py-3 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center justify-between bg-gray-50 border-t border-gray-100"
          >
            <span class="font-medium">Drag to reorder</span>
            <div class="flex items-center gap-2">
              <button
                @click.prevent.stop="cycleWidgetWidth(widget.id)"
                class="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition-colors"
                title="Width"
              >
                <Icon name="lucide:columns" class="h-3 w-3" />
                {{ widget.width }}
              </button>
              <button
                @click.prevent.stop="cycleWidgetHeight(widget.id)"
                class="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition-colors"
                title="Height"
              >
                <Icon name="lucide:rows" class="h-3 w-3" />
                {{ widget.height }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </VueDraggable>
  </div>
</template>

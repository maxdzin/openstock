import type { SortableOptions } from 'sortablejs';

export type WidgetWidth = 1 | 2;
export type WidgetHeight = 1 | 2 | 3;

export interface DashboardWidget {
  id: string;
  type: 'stat' | 'chart' | 'list';
  title: string;
  icon: string;
  href?: string;
  visible: boolean;
  width: WidgetWidth;
  height: WidgetHeight;
  order: number;
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'total-products', type: 'stat', title: 'Total Products', icon: 'lucide:package', href: '/products', visible: true, width: 1, height: 1, order: 0 },
  { id: 'low-stock', type: 'stat', title: 'Low Stock', icon: 'lucide:alert-triangle', href: '/products?filter=low-stock', visible: true, width: 1, height: 1, order: 1 },
  { id: 'active-suppliers', type: 'stat', title: 'Active Suppliers', icon: 'lucide:truck', href: '/suppliers', visible: true, width: 1, height: 1, order: 2 },
  { id: 'total-valuation', type: 'stat', title: 'Total Valuation', icon: 'lucide:euro', href: '/products', visible: true, width: 1, height: 1, order: 3 },
  { id: 'stock-velocity', type: 'chart', title: 'Stock Velocity', icon: 'lucide:activity', href: '/movements', visible: true, width: 2, height: 2, order: 4 },
  { id: 'category-split', type: 'chart', title: 'Category Split', icon: 'lucide:pie-chart', href: '/categories', visible: true, width: 1, height: 2, order: 5 },
  { id: 'low-stock-alerts', type: 'list', title: 'Low Stock Alerts', icon: 'lucide:alert-circle', href: '/products?filter=low-stock', visible: true, width: 1, height: 2, order: 6 },
  { id: 'recent-activity', type: 'list', title: 'Recent Activity', icon: 'lucide:history', href: '/movements', visible: true, width: 1, height: 2, order: 7 },
];

const STORAGE_KEY = 'openstock-dashboard-widgets';

export function useDashboardWidgets() {
  const widgets = ref<DashboardWidget[]>([]);
  const isEditMode = ref(false);
  const isInitialized = ref(false);

  function loadWidgets() {
    if (import.meta.client) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as DashboardWidget[];
          const merged = DEFAULT_WIDGETS.map((defaultWidget) => {
            const storedWidget = parsed.find((w) => w.id === defaultWidget.id);
            return storedWidget ? { ...defaultWidget, ...storedWidget } : defaultWidget;
          });
          widgets.value = merged.sort((a, b) => a.order - b.order);
        } catch {
          widgets.value = [...DEFAULT_WIDGETS];
        }
      } else {
        widgets.value = [...DEFAULT_WIDGETS];
      }
    }
    isInitialized.value = true;
  }

  function saveWidgets() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets.value));
    }
  }

  function updateWidgetOrder(newOrder: DashboardWidget[]) {
    const widgetMap = new Map(widgets.value.map((w) => [w.id, w]));
    newOrder.forEach((widget, index) => {
      widgetMap.set(widget.id, { ...widget, order: index });
    });
    widgets.value = Array.from(widgetMap.values()).sort((a, b) => a.order - b.order);
    saveWidgets();
  }

  function toggleWidgetVisibility(id: string) {
    const widget = widgets.value.find((w) => w.id === id);
    if (widget) {
      widget.visible = !widget.visible;
      saveWidgets();
    }
  }

  function cycleWidgetWidth(id: string) {
    const widget = widgets.value.find((w) => w.id === id);
    if (widget && widget.type !== 'stat') {
      widget.width = widget.width === 1 ? 2 : 1;
      saveWidgets();
    }
  }

  function cycleWidgetHeight(id: string) {
    const widget = widgets.value.find((w) => w.id === id);
    if (widget && widget.type !== 'stat') {
      widget.height = ((widget.height % 3) + 1) as WidgetHeight;
      saveWidgets();
    }
  }

  function resetToDefault() {
    widgets.value = [...DEFAULT_WIDGETS];
    saveWidgets();
  }

  const visibleWidgets = computed(() => widgets.value.filter((w) => w.visible));

  const draggableOptions = computed<SortableOptions>(() => ({
    animation: 200,
    ghostClass: 'opacity-50',
    chosenClass: 'ring-2 ring-blue-500',
    dragClass: 'shadow-lg',
    disabled: !isEditMode.value,
  }));

  onMounted(loadWidgets);

  return {
    widgets,
    visibleWidgets,
    isEditMode,
    isInitialized,
    updateWidgetOrder,
    toggleWidgetVisibility,
    cycleWidgetWidth,
    cycleWidgetHeight,
    resetToDefault,
    saveWidgets,
    draggableOptions,
  };
}

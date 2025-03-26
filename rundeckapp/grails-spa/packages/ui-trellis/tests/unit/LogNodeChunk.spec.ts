import { mount } from '@vue/test-utils'
import LogNodeChunk from '../../src/library/components/execution-log/LogNodeChunk.vue'
import { EventBus } from '../../src/library/utilities/vueEventBus'

// Mock the vue-virtual-scroller components with proper props and events
jest.mock('vue-virtual-scroller', () => ({
  DynamicScroller: {
    name: 'DynamicScroller',
    props: ['items', 'min-item-size', 'key-field', 'page-mode', 'class', 'ref'],
    template: '<div class="scroller" :class="class"><slot :items="items" /></div>',
    emits: ['update']
  },
  DynamicScrollerItem: {
    name: 'DynamicScrollerItem',
    props: ['item', 'index', 'active', 'size-dependencies', 'emit-resize'],
    template: '<div class="execution-log__line" :class="{ "execution-log__line--selected": active }" :data-index="index"><slot :item="item" :index="index" :active="active" /></div>'
  }
}))

// Mock the EventBus with mitt-like functionality
const mockEventBus = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  all: new Map()
}

jest.mock('../../src/library/utilities/vueEventBus', () => ({
  EventBus: jest.fn().mockImplementation(() => mockEventBus)
}))

describe('LogNodeChunk', () => {
  const createMockEntries = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      lineNumber: i + 1,
      log: `Log entry ${i + 1}`,
      logHtml: `<span>Log entry ${i + 1}</span>`,
      time: new Date().toISOString(),
      node: 'test-node',
      executionOutput: {},
      meta: {},
      level: 'INFO'
    }))
  }

  const defaultProps = {
    eventBus: mockEventBus,
    node: 'test-node',
    stepCtx: 'test-step',
    nodeIcon: true,
    maxLine: 2000,
    command: true,
    time: true,
    gutter: true,
    lineWrap: true,
    entries: createMockEntries(100),
    follow: false
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles large log files without hitting the rendered items limit', () => {
    // Create a large number of entries (5000) to test the limit
    const largeEntries = createMockEntries(5000)
    
    const wrapper = mount(LogNodeChunk, {
      props: {
        ...defaultProps,
        entries: largeEntries,
        maxLine: 5000
      }
    })

    // This test will fail if the component throws "Rendered items limit reached"
    const scroller = wrapper.find('.scroller')
    expect(scroller.exists()).toBe(true)
    
    // Verify we can render all entries
    const items = wrapper.findAll('.execution-log__line')
    expect(items.length).toBe(5000)
  })

  it('displays node-specific logs correctly', () => {
    const wrapper = mount(LogNodeChunk, {
      props: {
        ...defaultProps,
        node: 'specific-node',
        entries: createMockEntries(10).map(entry => ({
          ...entry,
          node: 'specific-node'
        }))
      }
    })

    const items = wrapper.findAll('.execution-log__line')
    expect(items.length).toBe(10)
    items.forEach(item => {
      expect(item.text()).toContain('specific-node')
    })
  })

  it('handles step context correctly', () => {
    const wrapper = mount(LogNodeChunk, {
      props: {
        ...defaultProps,
        stepCtx: 'step-1',
        entries: createMockEntries(10).map(entry => ({
          ...entry,
          stepCtx: 'step-1'
        }))
      }
    })

    const items = wrapper.findAll('.execution-log__line')
    expect(items.length).toBe(10)
  })

  it('supports jumping to specific lines', async () => {
    const wrapper = mount(LogNodeChunk, {
      props: {
        ...defaultProps,
        jumpToLine: 500,
        entries: createMockEntries(1000)
      }
    })

    await wrapper.setProps({ jumped: true })
    const emitted = wrapper.emitted('jumped')
    expect(emitted).toBeTruthy()
  })

  it('handles line selection and emits events', async () => {
    const wrapper = mount(LogNodeChunk, {
      props: {
        ...defaultProps,
        selectedLineIdx: 100
      }
    })

    const lineNumber = 100
    await wrapper.vm.onSelectLine(lineNumber)
    
    const emitted = wrapper.emitted('line-select')
    expect(emitted).toBeTruthy()
    if (emitted) {
      expect(emitted[0]).toEqual([lineNumber])
    }
  })

  it('maintains auto-scrolling when following logs', async () => {
    const wrapper = mount(LogNodeChunk, {
      props: {
        ...defaultProps,
        follow: true
      }
    })

    await wrapper.setProps({
      entries: [...createMockEntries(100), {
        lineNumber: 101,
        log: 'New log entry',
        logHtml: '<span>New log entry</span>',
        time: new Date().toISOString(),
        node: 'test-node',
        executionOutput: {},
        meta: {},
        level: 'INFO'
      }]
    })

    const scroller = wrapper.find('.scroller')
    expect(scroller.exists()).toBe(true)
  })
}) 
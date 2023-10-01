import {describe, expect, it} from 'vitest'

import {mount} from '@vue/test-utils'
import DataTable from '../DataTable.vue'

describe('DataTable', () => {
    // Sample data for tests
    const mockData = [
        {id: 1, name: 'John'},
        {id: 2, name: 'Doe'},
        {id: 3, name: 'Jane'},
    ]
    const mockColumns = [{key: 'id', label: 'ID'}, {key: 'name', label: 'Name'}]

    it('filters data based on filterKey', async () => {
        const wrapper = mount(DataTable, {
            props: {
                data: mockData,
                columns: mockColumns,
                filterKey: 'John'
            }
        })

        // There should only be one row that matches the filter
        const rows = wrapper.findAll('tbody > tr')
        expect(rows.length).toBe(1)
        expect(rows[0].text()).toContain('John')
    })

    it('opens side pane when a single row is selected', async () => {
        const wrapper = mount(DataTable, {
            props: {
                data: mockData,
                columns: mockColumns
            }
        })

        // Simulate clicking a row
        await wrapper.find('tbody > tr').trigger('click')

        // The side pane should be opened
        expect(wrapper.vm.isPaneOpen).toBe(true)
    })

    it('closes side pane when more than one row is selected', async () => {
        const wrapper = mount(DataTable, {
            props: {
                data: mockData,
                columns: mockColumns
            }
        })

        // Simulate clicking two rows
        const rows = wrapper.findAll('tbody > tr')
        await rows[0].trigger('click')
        await rows[1].trigger('click')

        // The side pane should be closed
        expect(wrapper.vm.isPaneOpen).toBe(false)
    })
})


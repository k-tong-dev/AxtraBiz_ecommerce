'use client'

import React, { useState } from 'react'
import Popover from '@/components/ui/RSuite/Overlays/Popover'
import Whisper from '@/components/ui/RSuite/Overlays/Whisper'
import Button from '@/components/ui/RSuite/Buttons/Button'
import { CheckTree, CheckTreeData, CheckTreeProps } from './checktree'

export interface CheckTreeDropdownProps extends Omit<CheckTreeProps, 'value' | 'onChange'> {
  trigger?: 'click' | 'hover'
  placement?: 'top' | 'bottom' | 'left' | 'right'
  buttonLabel?: string
  buttonIcon?: React.ReactNode
  selectedCount?: number
  onClear?: () => void
}

export function CheckTreeDropdown({
  data,
  defaultExpandAll = false,
  trigger = 'click',
  placement = 'bottom',
  buttonLabel = 'Filter',
  buttonIcon,
  selectedCount,
  onClear,
  renderTreeNode,
  renderTreeIcon
}: CheckTreeDropdownProps) {
  const [value, setValue] = useState<(string | number)[]>([])

  const handleChange = (newValue: (string | number)[], event: React.SyntheticEvent) => {
    setValue(newValue)
  }

  const handleClear = () => {
    setValue([])
    onClear?.()
  }

  return (
    <Whisper
      trigger={trigger}
      placement={placement}
      speaker={
        <Popover style={{ padding: 0 }}>
          <div className="p-4 min-w-[300px]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Select items</span>
              {value.length > 0 && (
                <Button size="xs" appearance="link" onClick={handleClear}>
                  Clear
                </Button>
              )}
            </div>
            <CheckTree
              data={data}
              defaultExpandAll={defaultExpandAll}
              value={value}
              onChange={handleChange}
              renderTreeNode={renderTreeNode}
              renderTreeIcon={renderTreeIcon}
            />
          </div>
        </Popover>
      }
    >
      <Button appearance="subtle" size="sm">
        {buttonIcon}
        {buttonLabel}
        {selectedCount !== undefined && selectedCount > 0 && (
          <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
            {selectedCount}
          </span>
        )}
      </Button>
    </Whisper>
  )
}

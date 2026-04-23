'use client'

import React from 'react'
import { CheckTree } from 'rsuite'
import { ChevronDown, ChevronRight, File, Folder } from 'lucide-react'

export interface CheckTreeData {
  value: string | number
  label: string
  children?: CheckTreeData[]
}

export interface CheckTreeProps {
  data: CheckTreeData[]
  defaultExpandAll?: boolean
  value?: (string | number)[]
  onChange?: (value: (string | number)[], event: React.SyntheticEvent) => void
  renderTreeNode?: (treeNode: any) => React.ReactNode
  renderTreeIcon?: (treeNode: any, expanded?: boolean) => React.ReactNode
}

const TreeNode = ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...rest} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {children}
    </div>
  )
}

export function CheckTreeComponent({
  data,
  defaultExpandAll = false,
  value,
  onChange,
  renderTreeNode,
  renderTreeIcon
}: CheckTreeProps) {
  const defaultRenderTreeNode = (treeNode: any) => {
    return (
      <TreeNode>
        {treeNode.children ? <Folder className="w-4 h-4" /> : <File className="w-4 h-4" />}
        {treeNode.label}
      </TreeNode>
    )
  }

  const defaultRenderTreeIcon = (treeNode: any, expanded?: boolean) => {
    if (treeNode.children) {
      return expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
    }
    return null
  }

  return (
    <CheckTree
      data={data}
      defaultExpandAll={defaultExpandAll}
      value={value}
      onChange={onChange}
      renderTreeNode={renderTreeNode || defaultRenderTreeNode}
      renderTreeIcon={renderTreeIcon || defaultRenderTreeIcon}
    />
  )
}

export { CheckTreeComponent as CheckTree }

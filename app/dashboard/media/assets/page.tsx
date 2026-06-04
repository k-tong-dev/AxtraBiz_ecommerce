'use client'

import { AssetManager } from '@/components/Base/Asset/AssetManager'

export default function AssetsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Asset Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage files and folders for your store assets
        </p>
      </div>
      <AssetManager />
    </div>
  )
}

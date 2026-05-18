'use client'

import { ResourceView } from '../../../../components/Base/Views'
import { announcementConfig } from '../config'

export default function NewAnnouncementPage() {
    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'New Announcement',
                description: 'Create a new announcement.',
                formViewConfig: announcementConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: announcementConfig.defaultActions,
                serverActions: announcementConfig.customServerActions,
            }}
        />
    )
}

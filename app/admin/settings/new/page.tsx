'use client'

import { ResourceView } from '../../../../components/Base/Views'
import { settingConfig } from '../config'

export default function NewSettingPage() {
    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'New Setting',
                description: 'Create a new setting.',
                formViewConfig: settingConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: settingConfig.defaultActions,
                serverActions: settingConfig.customServerActions,
            }}
        />
    )
}

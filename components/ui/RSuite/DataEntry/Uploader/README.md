# Uploader

**Category:** Data Entry
**Source:** `@/components/ui/RSuite/DataEntry/Uploader`

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `action` | `string` | ✓ |  |
| `accept` | `string` |  |  |
| `autoUpload` | `boolean` |  |  |
| `children` | `React.ReactElement` |  |  |
| `data` | `any` |  |  |
| `defaultFileList` | `FileType[]` |  |  |
| `disabled` | `boolean` |  |  |
| `disabledFileItem` | `boolean` |  |  |
| `disableMultipart` | `boolean` |  |  |
| `draggable` | `boolean` |  |  |
| `fileList` | `FileType[]` |  |  |
| `fileListVisible` | `boolean` |  |  |
| `headers` | `any` |  |  |
| `listType` | `'text' \| 'picture-text' \| 'picture'` |  |  |
| `locale` | `UploaderLocale` |  |  |
| `maxPreviewFileSize` | `number` |  |  |
| `method` | `string` |  |  |
| `multiple` | `boolean` |  |  |
| `name` | `string` |  |  |
| `onChange` | `(fileList: FileType[], event: React.ChangeEvent \| React.MouseEvent) =\> void` |  |  |
| `onError` | `(status: ErrorStatus, file: FileType, event: ProgressEvent, xhr: XMLHttpRequest) =\> void` |  |  |
| `onPreview` | `(file: FileType, event: React.SyntheticEvent) =\> void` |  |  |
| `onProgress` | `(percent: number, file: FileType, event: ProgressEvent, xhr: XMLHttpRequest) =\> void` |  |  |
| `onRemove` | `(file: FileType) =\> void` |  |  |
| `onReupload` | `(file: FileType) =\> void` |  |  |
| `onSuccess` | `(response: any, file: FileType, event: ProgressEvent, xhr: XMLHttpRequest) =\> void` |  |  |
| `onUpload` | `(file: FileType, uploadData: any, xhr: XMLHttpRequest) =\> void` |  |  |
| `plaintext` | `boolean` |  |  |
| `readOnly` | `boolean` |  |  |
| `ref` | `React.Ref\<UploaderInstance \| undefined\>` |  |  |
| `removable` | `boolean` |  |  |
| `renderFileInfo` | `(file: FileType, fileElement: React.ReactNode) =\> React.ReactNode` |  |  |
| `renderThumbnail` | `(file: FileType, thumbnail: React.ReactNode) =\> React.ReactNode` |  |  |
| `shouldQueueUpdate` | `(fileList: FileType[], newFile: FileType[] \| FileType) =\> boolean \| Promise\<boolean\>` |  |  |
| `shouldUpload` | `(file: FileType) =\> boolean \| Promise\<boolean\>` |  |  |
| `timeout` | `number` |  |  |
| `toggleAs` | `React.ElementType` |  |  |
| `withCredentials` | `boolean` |  |  |

> **Extends:** `BaseBoxProps`

---
*Auto-generated from rsuite type definitions. Refer to [rsuite documentation](https://rsuitejs.com/components/uploader) for full details.*

# Uploader

**Category:** Data Entry
**Source:** `@/components/ui/RSuite/DataEntry/Uploader`

## Props

| Prop | Type | Required | Inherited From | Description |
|------|------|----------|----------------|-------------|
| `accept` | `string` |  | `UploaderProps` |  |
| `action` | `string` | ✓ | `UploaderProps` |  |
| `autoUpload` | `boolean` |  | `UploaderProps` |  |
| `children` | `React.ReactElement` |  | `UploaderProps` |  |
| `data` | `any` |  | `UploaderProps` |  |
| `defaultFileList` | `FileType[]` |  | `UploaderProps` |  |
| `disabled` | `boolean` |  | `UploaderProps` |  |
| `disabledFileItem` | `boolean` |  | `UploaderProps` |  |
| `disableMultipart` | `boolean` |  | `UploaderProps` |  |
| `draggable` | `boolean` |  | `UploaderProps` |  |
| `fileList` | `FileType[]` |  | `UploaderProps` |  |
| `fileListVisible` | `boolean` |  | `UploaderProps` |  |
| `headers` | `any` |  | `UploaderProps` |  |
| `listType` | `'text' \| 'picture-text' \| 'picture'` |  | `UploaderProps` |  |
| `locale` | `UploaderLocale` |  | `UploaderProps` |  |
| `maxPreviewFileSize` | `number` |  | `UploaderProps` |  |
| `method` | `string` |  | `UploaderProps` |  |
| `multiple` | `boolean` |  | `UploaderProps` |  |
| `name` | `string` |  | `UploaderProps` |  |
| `onChange` | `(fileList: FileType[],  event: React.ChangeEvent \| React.MouseEvent) =\> void` |  | `UploaderProps` |  |
| `onError` | `(status: ErrorStatus,  file: FileType,  event: ProgressEvent,  xhr: XMLHttpRequest) =\> void` |  | `UploaderProps` |  |
| `onPreview` | `(file: FileType,  event: React.SyntheticEvent) =\> void` |  | `UploaderProps` |  |
| `onProgress` | `(percent: number,  file: FileType,  event: ProgressEvent,  xhr: XMLHttpRequest) =\> void` |  | `UploaderProps` |  |
| `onRemove` | `(file: FileType) =\> void` |  | `UploaderProps` |  |
| `onReupload` | `(file: FileType) =\> void` |  | `UploaderProps` |  |
| `onSuccess` | `(response: any,  file: FileType,  event: ProgressEvent,  xhr: XMLHttpRequest) =\> void` |  | `UploaderProps` |  |
| `onUpload` | `(file: FileType,  uploadData: any,  xhr: XMLHttpRequest) =\> void` |  | `UploaderProps` |  |
| `plaintext` | `boolean` |  | `UploaderProps` |  |
| `readOnly` | `boolean` |  | `UploaderProps` |  |
| `ref` | `React.Ref\<UploaderInstance \| undefined\>` |  | `UploaderProps` |  |
| `removable` | `boolean` |  | `UploaderProps` |  |
| `renderFileInfo` | `(file: FileType,  fileElement: React.ReactNode) =\> React.ReactNode` |  | `UploaderProps` |  |
| `renderThumbnail` | `(file: FileType,  thumbnail: React.ReactNode) =\> React.ReactNode` |  | `UploaderProps` |  |
| `shouldQueueUpdate` | `(fileList: FileType[],  newFile: FileType[] \| FileType) =\> boolean \| Promise\<boolean\>` |  | `UploaderProps` |  |
| `shouldUpload` | `(file: FileType) =\> boolean \| Promise\<boolean\>` |  | `UploaderProps` |  |
| `timeout` | `number` |  | `UploaderProps` |  |
| `toggleAs` | `React.ElementType` |  | `UploaderProps` |  |
| `withCredentials` | `boolean` |  | `UploaderProps` |  |
| `active` | `boolean` |  | `UploadTriggerProps` |  |
| `align` | `WithResponsive\<CSS['alignItems']\>` |  | `UploadTriggerProps` |  |
| `appearance` | `AppearanceType` |  | `UploadTriggerProps` |  |
| `as` | `As` |  | `UploadTriggerProps` |  |
| `basis` | `WithResponsive\<CSS['flexBasis']\>` |  | `UploadTriggerProps` |  |
| `bc` | `WithResponsive\<ColorScheme \| CSS['borderColor']\>` |  | `UploadTriggerProps` |  |
| `bd` | `WithResponsive\<CSS['border']\>` |  | `UploadTriggerProps` |  |
| `bdb` | `WithResponsive\<CSS['borderBottom']\>` |  | `UploadTriggerProps` |  |
| `bdbc` | `WithResponsive\<ColorScheme \| CSS['borderBottomColor']\>` |  | `UploadTriggerProps` |  |
| `bdbs` | `WithResponsive\<CSS['borderBottomStyle']\>` |  | `UploadTriggerProps` |  |
| `bdbw` | `WithResponsive\<CSS['borderBottomWidth']\>` |  | `UploadTriggerProps` |  |
| `bdl` | `WithResponsive\<CSS['borderLeft']\>` |  | `UploadTriggerProps` |  |
| `bdlc` | `WithResponsive\<ColorScheme \| CSS['borderLeftColor']\>` |  | `UploadTriggerProps` |  |
| `bdls` | `WithResponsive\<CSS['borderLeftStyle']\>` |  | `UploadTriggerProps` |  |
| `bdlw` | `WithResponsive\<CSS['borderLeftWidth']\>` |  | `UploadTriggerProps` |  |
| `bdr` | `WithResponsive\<CSS['borderRight']\>` |  | `UploadTriggerProps` |  |
| `bdrc` | `WithResponsive\<ColorScheme \| CSS['borderRightColor']\>` |  | `UploadTriggerProps` |  |
| `bdrs` | `WithResponsive\<CSS['borderRightStyle']\>` |  | `UploadTriggerProps` |  |
| `bdrw` | `WithResponsive\<CSS['borderRightWidth']\>` |  | `UploadTriggerProps` |  |
| `bdt` | `WithResponsive\<CSS['borderTop']\>` |  | `UploadTriggerProps` |  |
| `bdtc` | `WithResponsive\<ColorScheme \| CSS['borderTopColor']\>` |  | `UploadTriggerProps` |  |
| `bdts` | `WithResponsive\<CSS['borderTopStyle']\>` |  | `UploadTriggerProps` |  |
| `bdtw` | `WithResponsive\<CSS['borderTopWidth']\>` |  | `UploadTriggerProps` |  |
| `bg` | `WithResponsive\<ColorScheme \| CSS['background']\>` |  | `UploadTriggerProps` |  |
| `bga` | `WithResponsive\<CSS['backgroundAttachment']\>` |  | `UploadTriggerProps` |  |
| `bgc` | `WithResponsive\<ColorScheme \| CSS['backgroundColor']\>` |  | `UploadTriggerProps` |  |
| `bgi` | `WithResponsive\<CSS['backgroundImage']\>` |  | `UploadTriggerProps` |  |
| `bgp` | `WithResponsive\<CSS['backgroundPosition']\>` |  | `UploadTriggerProps` |  |
| `bgr` | `WithResponsive\<CSS['backgroundRepeat']\>` |  | `UploadTriggerProps` |  |
| `bgsz` | `WithResponsive\<CSS['backgroundSize']\>` |  | `UploadTriggerProps` |  |
| `block` | `boolean` |  | `UploadTriggerProps` |  |
| `bottom` | `WithResponsive\<CSS['bottom']\>` |  | `UploadTriggerProps` |  |
| `bs` | `WithResponsive\<CSS['borderStyle']\>` |  | `UploadTriggerProps` |  |
| `bsz` | `WithResponsive\<CSS['boxSizing']\>` |  | `UploadTriggerProps` |  |
| `bw` | `WithResponsive\<CSS['borderWidth']\>` |  | `UploadTriggerProps` |  |
| `c` | `WithResponsive\<ColorScheme \| CSS['color']\>` |  | `UploadTriggerProps` |  |
| `className` | `string` |  | `UploadTriggerProps` |  |
| `classPrefix` | `string` |  | `UploadTriggerProps` |  |
| `colgap` | `WithResponsive\<CSS['columnGap']\>` |  | `UploadTriggerProps` |  |
| `color` | `Color` |  | `UploadTriggerProps` |  |
| `direction` | `WithResponsive\<CSS['flexDirection']\>` |  | `UploadTriggerProps` |  |
| `display` | `WithResponsive\<CSS['display']\>` |  | `UploadTriggerProps` |  |
| `endIcon` | `React.ReactNode` |  | `UploadTriggerProps` |  |
| `ff` | `WithResponsive\<CSS['fontFamily']\>` |  | `UploadTriggerProps` |  |
| `flex` | `WithResponsive\<CSS['flex']\>` |  | `UploadTriggerProps` |  |
| `fs` | `WithResponsive\<CSS['fontSize']\>` |  | `UploadTriggerProps` |  |
| `fw` | `WithResponsive\<CSS['fontWeight']\>` |  | `UploadTriggerProps` |  |
| `gap` | `WithResponsive\<CSS['gap']\>` |  | `UploadTriggerProps` |  |
| `grow` | `WithResponsive\<CSS['flexGrow']\>` |  | `UploadTriggerProps` |  |
| `h` | `WithResponsive\<CSS['height']\>` |  | `UploadTriggerProps` |  |
| `hideFrom` | `Breakpoints` |  | `UploadTriggerProps` |  |
| `href` | `string` |  | `UploadTriggerProps` |  |
| `inset` | `WithResponsive\<CSS['inset']\>` |  | `UploadTriggerProps` |  |
| `insetx` | `WithResponsive\<CSS['insetInline']\>` |  | `UploadTriggerProps` |  |
| `insety` | `WithResponsive\<CSS['insetBlock']\>` |  | `UploadTriggerProps` |  |
| `justify` | `WithResponsive\<CSS['justifyContent']\>` |  | `UploadTriggerProps` |  |
| `left` | `WithResponsive\<CSS['left']\>` |  | `UploadTriggerProps` |  |
| `lh` | `WithResponsive\<CSS['lineHeight']\>` |  | `UploadTriggerProps` |  |
| `loading` | `boolean` |  | `UploadTriggerProps` |  |
| `lts` | `WithResponsive\<CSS['letterSpacing']\>` |  | `UploadTriggerProps` |  |
| `m` | `WithResponsive\<CSS['margin']\>` |  | `UploadTriggerProps` |  |
| `maxh` | `WithResponsive\<CSS['maxHeight']\>` |  | `UploadTriggerProps` |  |
| `maxw` | `WithResponsive\<CSS['maxWidth']\>` |  | `UploadTriggerProps` |  |
| `mb` | `WithResponsive\<CSS['marginBottom']\>` |  | `UploadTriggerProps` |  |
| `me` | `WithResponsive\<CSS['marginInlineEnd']\>` |  | `UploadTriggerProps` |  |
| `minh` | `WithResponsive\<CSS['minHeight']\>` |  | `UploadTriggerProps` |  |
| `minw` | `WithResponsive\<CSS['minWidth']\>` |  | `UploadTriggerProps` |  |
| `ml` | `WithResponsive\<CSS['marginLeft']\>` |  | `UploadTriggerProps` |  |
| `mr` | `WithResponsive\<CSS['marginRight']\>` |  | `UploadTriggerProps` |  |
| `ms` | `WithResponsive\<CSS['marginInlineStart']\>` |  | `UploadTriggerProps` |  |
| `mt` | `WithResponsive\<CSS['marginTop']\>` |  | `UploadTriggerProps` |  |
| `mx` | `WithResponsive\<CSS['marginInline']\>` |  | `UploadTriggerProps` |  |
| `my` | `WithResponsive\<CSS['marginBlock']\>` |  | `UploadTriggerProps` |  |
| `onDragEnter` | `React.DragEventHandler\<HTMLInputElement\>` |  | `UploadTriggerProps` |  |
| `onDragLeave` | `React.DragEventHandler\<HTMLInputElement\>` |  | `UploadTriggerProps` |  |
| `onDragOver` | `React.DragEventHandler\<HTMLInputElement\>` |  | `UploadTriggerProps` |  |
| `onDrop` | `React.DragEventHandler\<HTMLInputElement\>` |  | `UploadTriggerProps` |  |
| `onToggle` | `(active: boolean,  event: React.MouseEvent) =\> void` |  | `UploadTriggerProps` |  |
| `opacity` | `WithResponsive\<CSS['opacity']\>` |  | `UploadTriggerProps` |  |
| `order` | `WithResponsive\<CSS['order']\>` |  | `UploadTriggerProps` |  |
| `p` | `WithResponsive\<CSS['padding']\>` |  | `UploadTriggerProps` |  |
| `pb` | `WithResponsive\<CSS['paddingBottom']\>` |  | `UploadTriggerProps` |  |
| `pe` | `WithResponsive\<CSS['paddingInlineEnd']\>` |  | `UploadTriggerProps` |  |
| `pl` | `WithResponsive\<CSS['paddingLeft']\>` |  | `UploadTriggerProps` |  |
| `pos` | `WithResponsive\<CSS['position']\>` |  | `UploadTriggerProps` |  |
| `pr` | `WithResponsive\<CSS['paddingRight']\>` |  | `UploadTriggerProps` |  |
| `ps` | `WithResponsive\<CSS['paddingInlineStart']\>` |  | `UploadTriggerProps` |  |
| `pt` | `WithResponsive\<CSS['paddingTop']\>` |  | `UploadTriggerProps` |  |
| `px` | `WithResponsive\<CSS['paddingInline']\>` |  | `UploadTriggerProps` |  |
| `py` | `WithResponsive\<CSS['paddingBlock']\>` |  | `UploadTriggerProps` |  |
| `right` | `WithResponsive\<CSS['right']\>` |  | `UploadTriggerProps` |  |
| `ripple` | `boolean` |  | `UploadTriggerProps` |  |
| `rounded` | `WithResponsive\<Size \| CSS['borderRadius'] \| 'full'\>` |  | `UploadTriggerProps` |  |
| `rowgap` | `WithResponsive\<CSS['rowGap']\>` |  | `UploadTriggerProps` |  |
| `self` | `WithResponsive\<CSS['alignSelf']\>` |  | `UploadTriggerProps` |  |
| `shadow` | `WithResponsive\<Size \| CSS['boxShadow']\>` |  | `UploadTriggerProps` |  |
| `showFrom` | `Breakpoints` |  | `UploadTriggerProps` |  |
| `shrink` | `WithResponsive\<CSS['flexShrink']\>` |  | `UploadTriggerProps` |  |
| `size` | `BasicSize` |  | `UploadTriggerProps` |  |
| `spacing` | `WithResponsive\<CSS['gap']\>` |  | `UploadTriggerProps` |  |
| `startIcon` | `React.ReactNode` |  | `UploadTriggerProps` |  |
| `style` | `CSSProperties` |  | `UploadTriggerProps` |  |
| `ta` | `WithResponsive\<CSS['textAlign']\>` |  | `UploadTriggerProps` |  |
| `target` | `string` |  | `UploadTriggerProps` |  |
| `td` | `WithResponsive\<CSS['textDecoration']\>` |  | `UploadTriggerProps` |  |
| `tdc` | `WithResponsive\<ColorScheme \| CSS['textDecorationColor']\>` |  | `UploadTriggerProps` |  |
| `tds` | `WithResponsive\<CSS['textDecorationStyle']\>` |  | `UploadTriggerProps` |  |
| `toggleable` | `boolean` |  | `UploadTriggerProps` |  |
| `top` | `WithResponsive\<CSS['top']\>` |  | `UploadTriggerProps` |  |
| `tt` | `WithResponsive\<CSS['textTransform']\>` |  | `UploadTriggerProps` |  |
| `type` | `'button' \| 'reset' \| 'submit'` |  | `UploadTriggerProps` |  |
| `w` | `WithResponsive\<CSS['width']\>` |  | `UploadTriggerProps` |  |
| `z` | `WithResponsive\<CSS['zIndex']\>` |  | `UploadTriggerProps` |  |

---
*Auto-generated from rsuite type definitions. Refer to [rsuite documentation](https://rsuitejs.com/components/uploader/#props) for full details.*

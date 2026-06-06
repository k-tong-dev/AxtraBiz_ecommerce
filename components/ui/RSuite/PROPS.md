# Undocumented rsuite Shared Props

These props come from internal base interfaces that rsuite does not document on their component pages.
They are inherited by many components automatically. Only **direct** props of each interface are listed here.

---

## BoxProps

| Prop          | Type                                                          | Required | Description |
|---------------|---------------------------------------------------------------|----------|-------------|
| `align`       | `WithResponsive\<CSS['alignItems']\>`                         |          |             |
| `as`          | `As`                                                          |          |             |
| `basis`       | `WithResponsive\<CSS['flexBasis']\>`                          |          |             |
| `bc`          | `WithResponsive\<ColorScheme \| CSS['borderColor']\>`         |          |             |
| `bd`          | `WithResponsive\<CSS['border']\>`                             |          |             |
| `bdb`         | `WithResponsive\<CSS['borderBottom']\>`                       |          |             |
| `bdbc`        | `WithResponsive\<ColorScheme \| CSS['borderBottomColor']\>`   |          |             |
| `bdbs`        | `WithResponsive\<CSS['borderBottomStyle']\>`                  |          |             |
| `bdbw`        | `WithResponsive\<CSS['borderBottomWidth']\>`                  |          |             |
| `bdl`         | `WithResponsive\<CSS['borderLeft']\>`                         |          |             |
| `bdlc`        | `WithResponsive\<ColorScheme \| CSS['borderLeftColor']\>`     |          |             |
| `bdls`        | `WithResponsive\<CSS['borderLeftStyle']\>`                    |          |             |
| `bdlw`        | `WithResponsive\<CSS['borderLeftWidth']\>`                    |          |             |
| `bdr`         | `WithResponsive\<CSS['borderRight']\>`                        |          |             |
| `bdrc`        | `WithResponsive\<ColorScheme \| CSS['borderRightColor']\>`    |          |             |
| `bdrs`        | `WithResponsive\<CSS['borderRightStyle']\>`                   |          |             |
| `bdrw`        | `WithResponsive\<CSS['borderRightWidth']\>`                   |          |             |
| `bdt`         | `WithResponsive\<CSS['borderTop']\>`                          |          |             |
| `bdtc`        | `WithResponsive\<ColorScheme \| CSS['borderTopColor']\>`      |          |             |
| `bdts`        | `WithResponsive\<CSS['borderTopStyle']\>`                     |          |             |
| `bdtw`        | `WithResponsive\<CSS['borderTopWidth']\>`                     |          |             |
| `bg`          | `WithResponsive\<ColorScheme \| CSS['background']\>`          |          |             |
| `bga`         | `WithResponsive\<CSS['backgroundAttachment']\>`               |          |             |
| `bgc`         | `WithResponsive\<ColorScheme \| CSS['backgroundColor']\>`     |          |             |
| `bgi`         | `WithResponsive\<CSS['backgroundImage']\>`                    |          |             |
| `bgp`         | `WithResponsive\<CSS['backgroundPosition']\>`                 |          |             |
| `bgr`         | `WithResponsive\<CSS['backgroundRepeat']\>`                   |          |             |
| `bgsz`        | `WithResponsive\<CSS['backgroundSize']\>`                     |          |             |
| `bottom`      | `WithResponsive\<CSS['bottom']\>`                             |          |             |
| `bs`          | `WithResponsive\<CSS['borderStyle']\>`                        |          |             |
| `bsz`         | `WithResponsive\<CSS['boxSizing']\>`                          |          |             |
| `bw`          | `WithResponsive\<CSS['borderWidth']\>`                        |          |             |
| `c`           | `WithResponsive\<ColorScheme \| CSS['color']\>`               |          |             |
| `children`    | `ReactNode`                                                   |          |             |
| `className`   | `string`                                                      |          |             |
| `classPrefix` | `string`                                                      |          |             |
| `colgap`      | `WithResponsive\<CSS['columnGap']\>`                          |          |             |
| `direction`   | `WithResponsive\<CSS['flexDirection']\>`                      |          |             |
| `display`     | `WithResponsive\<CSS['display']\>`                            |          |             |
| `ff`          | `WithResponsive\<CSS['fontFamily']\>`                         |          |             |
| `flex`        | `WithResponsive\<CSS['flex']\>`                               |          |             |
| `fs`          | `WithResponsive\<CSS['fontSize']\>`                           |          |             |
| `fw`          | `WithResponsive\<CSS['fontWeight']\>`                         |          |             |
| `gap`         | `WithResponsive\<CSS['gap']\>`                                |          |             |
| `grow`        | `WithResponsive\<CSS['flexGrow']\>`                           |          |             |
| `h`           | `WithResponsive\<CSS['height']\>`                             |          |             |
| `hideFrom`    | `Breakpoints`                                                 |          |             |
| `inset`       | `WithResponsive\<CSS['inset']\>`                              |          |             |
| `insetx`      | `WithResponsive\<CSS['insetInline']\>`                        |          |             |
| `insety`      | `WithResponsive\<CSS['insetBlock']\>`                         |          |             |
| `justify`     | `WithResponsive\<CSS['justifyContent']\>`                     |          |             |
| `left`        | `WithResponsive\<CSS['left']\>`                               |          |             |
| `lh`          | `WithResponsive\<CSS['lineHeight']\>`                         |          |             |
| `lts`         | `WithResponsive\<CSS['letterSpacing']\>`                      |          |             |
| `m`           | `WithResponsive\<CSS['margin']\>`                             |          |             |
| `maxh`        | `WithResponsive\<CSS['maxHeight']\>`                          |          |             |
| `maxw`        | `WithResponsive\<CSS['maxWidth']\>`                           |          |             |
| `mb`          | `WithResponsive\<CSS['marginBottom']\>`                       |          |             |
| `me`          | `WithResponsive\<CSS['marginInlineEnd']\>`                    |          |             |
| `minh`        | `WithResponsive\<CSS['minHeight']\>`                          |          |             |
| `minw`        | `WithResponsive\<CSS['minWidth']\>`                           |          |             |
| `ml`          | `WithResponsive\<CSS['marginLeft']\>`                         |          |             |
| `mr`          | `WithResponsive\<CSS['marginRight']\>`                        |          |             |
| `ms`          | `WithResponsive\<CSS['marginInlineStart']\>`                  |          |             |
| `mt`          | `WithResponsive\<CSS['marginTop']\>`                          |          |             |
| `mx`          | `WithResponsive\<CSS['marginInline']\>`                       |          |             |
| `my`          | `WithResponsive\<CSS['marginBlock']\>`                        |          |             |
| `opacity`     | `WithResponsive\<CSS['opacity']\>`                            |          |             |
| `order`       | `WithResponsive\<CSS['order']\>`                              |          |             |
| `p`           | `WithResponsive\<CSS['padding']\>`                            |          |             |
| `pb`          | `WithResponsive\<CSS['paddingBottom']\>`                      |          |             |
| `pe`          | `WithResponsive\<CSS['paddingInlineEnd']\>`                   |          |             |
| `pl`          | `WithResponsive\<CSS['paddingLeft']\>`                        |          |             |
| `pos`         | `WithResponsive\<CSS['position']\>`                           |          |             |
| `pr`          | `WithResponsive\<CSS['paddingRight']\>`                       |          |             |
| `ps`          | `WithResponsive\<CSS['paddingInlineStart']\>`                 |          |             |
| `pt`          | `WithResponsive\<CSS['paddingTop']\>`                         |          |             |
| `px`          | `WithResponsive\<CSS['paddingInline']\>`                      |          |             |
| `py`          | `WithResponsive\<CSS['paddingBlock']\>`                       |          |             |
| `right`       | `WithResponsive\<CSS['right']\>`                              |          |             |
| `rounded`     | `WithResponsive\<Size \| CSS['borderRadius'] \| 'full'\>`     |          |             |
| `rowgap`      | `WithResponsive\<CSS['rowGap']\>`                             |          |             |
| `self`        | `WithResponsive\<CSS['alignSelf']\>`                          |          |             |
| `shadow`      | `WithResponsive\<Size \| CSS['boxShadow']\>`                  |          |             |
| `showFrom`    | `Breakpoints`                                                 |          |             |
| `shrink`      | `WithResponsive\<CSS['flexShrink']\>`                         |          |             |
| `spacing`     | `WithResponsive\<CSS['gap']\>`                                |          |             |
| `style`       | `CSSProperties`                                               |          |             |
| `ta`          | `WithResponsive\<CSS['textAlign']\>`                          |          |             |
| `td`          | `WithResponsive\<CSS['textDecoration']\>`                     |          |             |
| `tdc`         | `WithResponsive\<ColorScheme \| CSS['textDecorationColor']\>` |          |             |
| `tds`         | `WithResponsive\<CSS['textDecorationStyle']\>`                |          |             |
| `top`         | `WithResponsive\<CSS['top']\>`                                |          |             |
| `tt`          | `WithResponsive\<CSS['textTransform']\>`                      |          |             |
| `w`           | `WithResponsive\<CSS['width']\>`                              |          |             |
| `z`           | `WithResponsive\<CSS['zIndex']\>`                             |          |             |

## WithAsProps

| Prop          | Type            | Required | Description |
|---------------|-----------------|----------|-------------|
| `as`          | `As`            |          |             |
| `children`    | `ReactNode`     |          |             |
| `className`   | `string`        |          |             |
| `classPrefix` | `string`        |          |             |
| `style`       | `CSSProperties` |          |             |

## StandardProps

| Prop          | Type            | Required | Description |
|---------------|-----------------|----------|-------------|
| `children`    | `ReactNode`     |          |             |
| `className`   | `string`        |          |             |
| `classPrefix` | `string`        |          |             |
| `style`       | `CSSProperties` |          |             |

## CSSSystemProps

| Prop        | Type                                                          | Required | Description |
|-------------|---------------------------------------------------------------|----------|-------------|
| `align`     | `WithResponsive\<CSS['alignItems']\>`                         |          |             |
| `basis`     | `WithResponsive\<CSS['flexBasis']\>`                          |          |             |
| `bc`        | `WithResponsive\<ColorScheme \| CSS['borderColor']\>`         |          |             |
| `bd`        | `WithResponsive\<CSS['border']\>`                             |          |             |
| `bdb`       | `WithResponsive\<CSS['borderBottom']\>`                       |          |             |
| `bdbc`      | `WithResponsive\<ColorScheme \| CSS['borderBottomColor']\>`   |          |             |
| `bdbs`      | `WithResponsive\<CSS['borderBottomStyle']\>`                  |          |             |
| `bdbw`      | `WithResponsive\<CSS['borderBottomWidth']\>`                  |          |             |
| `bdl`       | `WithResponsive\<CSS['borderLeft']\>`                         |          |             |
| `bdlc`      | `WithResponsive\<ColorScheme \| CSS['borderLeftColor']\>`     |          |             |
| `bdls`      | `WithResponsive\<CSS['borderLeftStyle']\>`                    |          |             |
| `bdlw`      | `WithResponsive\<CSS['borderLeftWidth']\>`                    |          |             |
| `bdr`       | `WithResponsive\<CSS['borderRight']\>`                        |          |             |
| `bdrc`      | `WithResponsive\<ColorScheme \| CSS['borderRightColor']\>`    |          |             |
| `bdrs`      | `WithResponsive\<CSS['borderRightStyle']\>`                   |          |             |
| `bdrw`      | `WithResponsive\<CSS['borderRightWidth']\>`                   |          |             |
| `bdt`       | `WithResponsive\<CSS['borderTop']\>`                          |          |             |
| `bdtc`      | `WithResponsive\<ColorScheme \| CSS['borderTopColor']\>`      |          |             |
| `bdts`      | `WithResponsive\<CSS['borderTopStyle']\>`                     |          |             |
| `bdtw`      | `WithResponsive\<CSS['borderTopWidth']\>`                     |          |             |
| `bg`        | `WithResponsive\<ColorScheme \| CSS['background']\>`          |          |             |
| `bga`       | `WithResponsive\<CSS['backgroundAttachment']\>`               |          |             |
| `bgc`       | `WithResponsive\<ColorScheme \| CSS['backgroundColor']\>`     |          |             |
| `bgi`       | `WithResponsive\<CSS['backgroundImage']\>`                    |          |             |
| `bgp`       | `WithResponsive\<CSS['backgroundPosition']\>`                 |          |             |
| `bgr`       | `WithResponsive\<CSS['backgroundRepeat']\>`                   |          |             |
| `bgsz`      | `WithResponsive\<CSS['backgroundSize']\>`                     |          |             |
| `bottom`    | `WithResponsive\<CSS['bottom']\>`                             |          |             |
| `bs`        | `WithResponsive\<CSS['borderStyle']\>`                        |          |             |
| `bsz`       | `WithResponsive\<CSS['boxSizing']\>`                          |          |             |
| `bw`        | `WithResponsive\<CSS['borderWidth']\>`                        |          |             |
| `c`         | `WithResponsive\<ColorScheme \| CSS['color']\>`               |          |             |
| `colgap`    | `WithResponsive\<CSS['columnGap']\>`                          |          |             |
| `direction` | `WithResponsive\<CSS['flexDirection']\>`                      |          |             |
| `display`   | `WithResponsive\<CSS['display']\>`                            |          |             |
| `ff`        | `WithResponsive\<CSS['fontFamily']\>`                         |          |             |
| `flex`      | `WithResponsive\<CSS['flex']\>`                               |          |             |
| `fs`        | `WithResponsive\<CSS['fontSize']\>`                           |          |             |
| `fw`        | `WithResponsive\<CSS['fontWeight']\>`                         |          |             |
| `gap`       | `WithResponsive\<CSS['gap']\>`                                |          |             |
| `grow`      | `WithResponsive\<CSS['flexGrow']\>`                           |          |             |
| `h`         | `WithResponsive\<CSS['height']\>`                             |          |             |
| `inset`     | `WithResponsive\<CSS['inset']\>`                              |          |             |
| `insetx`    | `WithResponsive\<CSS['insetInline']\>`                        |          |             |
| `insety`    | `WithResponsive\<CSS['insetBlock']\>`                         |          |             |
| `justify`   | `WithResponsive\<CSS['justifyContent']\>`                     |          |             |
| `left`      | `WithResponsive\<CSS['left']\>`                               |          |             |
| `lh`        | `WithResponsive\<CSS['lineHeight']\>`                         |          |             |
| `lts`       | `WithResponsive\<CSS['letterSpacing']\>`                      |          |             |
| `m`         | `WithResponsive\<CSS['margin']\>`                             |          |             |
| `maxh`      | `WithResponsive\<CSS['maxHeight']\>`                          |          |             |
| `maxw`      | `WithResponsive\<CSS['maxWidth']\>`                           |          |             |
| `mb`        | `WithResponsive\<CSS['marginBottom']\>`                       |          |             |
| `me`        | `WithResponsive\<CSS['marginInlineEnd']\>`                    |          |             |
| `minh`      | `WithResponsive\<CSS['minHeight']\>`                          |          |             |
| `minw`      | `WithResponsive\<CSS['minWidth']\>`                           |          |             |
| `ml`        | `WithResponsive\<CSS['marginLeft']\>`                         |          |             |
| `mr`        | `WithResponsive\<CSS['marginRight']\>`                        |          |             |
| `ms`        | `WithResponsive\<CSS['marginInlineStart']\>`                  |          |             |
| `mt`        | `WithResponsive\<CSS['marginTop']\>`                          |          |             |
| `mx`        | `WithResponsive\<CSS['marginInline']\>`                       |          |             |
| `my`        | `WithResponsive\<CSS['marginBlock']\>`                        |          |             |
| `opacity`   | `WithResponsive\<CSS['opacity']\>`                            |          |             |
| `order`     | `WithResponsive\<CSS['order']\>`                              |          |             |
| `p`         | `WithResponsive\<CSS['padding']\>`                            |          |             |
| `pb`        | `WithResponsive\<CSS['paddingBottom']\>`                      |          |             |
| `pe`        | `WithResponsive\<CSS['paddingInlineEnd']\>`                   |          |             |
| `pl`        | `WithResponsive\<CSS['paddingLeft']\>`                        |          |             |
| `pos`       | `WithResponsive\<CSS['position']\>`                           |          |             |
| `pr`        | `WithResponsive\<CSS['paddingRight']\>`                       |          |             |
| `ps`        | `WithResponsive\<CSS['paddingInlineStart']\>`                 |          |             |
| `pt`        | `WithResponsive\<CSS['paddingTop']\>`                         |          |             |
| `px`        | `WithResponsive\<CSS['paddingInline']\>`                      |          |             |
| `py`        | `WithResponsive\<CSS['paddingBlock']\>`                       |          |             |
| `right`     | `WithResponsive\<CSS['right']\>`                              |          |             |
| `rounded`   | `WithResponsive\<Size \| CSS['borderRadius'] \| 'full'\>`     |          |             |
| `rowgap`    | `WithResponsive\<CSS['rowGap']\>`                             |          |             |
| `self`      | `WithResponsive\<CSS['alignSelf']\>`                          |          |             |
| `shadow`    | `WithResponsive\<Size \| CSS['boxShadow']\>`                  |          |             |
| `shrink`    | `WithResponsive\<CSS['flexShrink']\>`                         |          |             |
| `spacing`   | `WithResponsive\<CSS['gap']\>`                                |          |             |
| `ta`        | `WithResponsive\<CSS['textAlign']\>`                          |          |             |
| `td`        | `WithResponsive\<CSS['textDecoration']\>`                     |          |             |
| `tdc`       | `WithResponsive\<ColorScheme \| CSS['textDecorationColor']\>` |          |             |
| `tds`       | `WithResponsive\<CSS['textDecorationStyle']\>`                |          |             |
| `top`       | `WithResponsive\<CSS['top']\>`                                |          |             |
| `tt`        | `WithResponsive\<CSS['textTransform']\>`                      |          |             |
| `w`         | `WithResponsive\<CSS['width']\>`                              |          |             |
| `z`         | `WithResponsive\<CSS['zIndex']\>`                             |          |             |

## StandardCSSProps

No direct props (type alias or re-export only).

## AnimationEventProps

| Prop         | Type                           | Required | Description |
|--------------|--------------------------------|----------|-------------|
| `onEnter`    | `(node: HTMLElement) =\> void` |          |             |
| `onEntered`  | `(node: HTMLElement) =\> void` |          |             |
| `onEntering` | `(node: HTMLElement) =\> void` |          |             |
| `onExit`     | `(node: HTMLElement) =\> void` |          |             |
| `onExited`   | `(node: HTMLElement) =\> void` |          |             |
| `onExiting`  | `(node: HTMLElement) =\> void` |          |             |

## PickerBaseProps

| Prop                | Type                                                          | Required | Description |
|---------------------|---------------------------------------------------------------|----------|-------------|
| `align`             | `WithResponsive\<CSS['alignItems']\>`                         |          |             |
| `appearance`        | `PickerAppearance`                                            |          |             |
| `as`                | `As`                                                          |          |             |
| `basis`             | `WithResponsive\<CSS['flexBasis']\>`                          |          |             |
| `bc`                | `WithResponsive\<ColorScheme \| CSS['borderColor']\>`         |          |             |
| `bd`                | `WithResponsive\<CSS['border']\>`                             |          |             |
| `bdb`               | `WithResponsive\<CSS['borderBottom']\>`                       |          |             |
| `bdbc`              | `WithResponsive\<ColorScheme \| CSS['borderBottomColor']\>`   |          |             |
| `bdbs`              | `WithResponsive\<CSS['borderBottomStyle']\>`                  |          |             |
| `bdbw`              | `WithResponsive\<CSS['borderBottomWidth']\>`                  |          |             |
| `bdl`               | `WithResponsive\<CSS['borderLeft']\>`                         |          |             |
| `bdlc`              | `WithResponsive\<ColorScheme \| CSS['borderLeftColor']\>`     |          |             |
| `bdls`              | `WithResponsive\<CSS['borderLeftStyle']\>`                    |          |             |
| `bdlw`              | `WithResponsive\<CSS['borderLeftWidth']\>`                    |          |             |
| `bdr`               | `WithResponsive\<CSS['borderRight']\>`                        |          |             |
| `bdrc`              | `WithResponsive\<ColorScheme \| CSS['borderRightColor']\>`    |          |             |
| `bdrs`              | `WithResponsive\<CSS['borderRightStyle']\>`                   |          |             |
| `bdrw`              | `WithResponsive\<CSS['borderRightWidth']\>`                   |          |             |
| `bdt`               | `WithResponsive\<CSS['borderTop']\>`                          |          |             |
| `bdtc`              | `WithResponsive\<ColorScheme \| CSS['borderTopColor']\>`      |          |             |
| `bdts`              | `WithResponsive\<CSS['borderTopStyle']\>`                     |          |             |
| `bdtw`              | `WithResponsive\<CSS['borderTopWidth']\>`                     |          |             |
| `bg`                | `WithResponsive\<ColorScheme \| CSS['background']\>`          |          |             |
| `bga`               | `WithResponsive\<CSS['backgroundAttachment']\>`               |          |             |
| `bgc`               | `WithResponsive\<ColorScheme \| CSS['backgroundColor']\>`     |          |             |
| `bgi`               | `WithResponsive\<CSS['backgroundImage']\>`                    |          |             |
| `bgp`               | `WithResponsive\<CSS['backgroundPosition']\>`                 |          |             |
| `bgr`               | `WithResponsive\<CSS['backgroundRepeat']\>`                   |          |             |
| `bgsz`              | `WithResponsive\<CSS['backgroundSize']\>`                     |          |             |
| `block`             | `boolean`                                                     |          |             |
| `bottom`            | `WithResponsive\<CSS['bottom']\>`                             |          |             |
| `bs`                | `WithResponsive\<CSS['borderStyle']\>`                        |          |             |
| `bsz`               | `WithResponsive\<CSS['boxSizing']\>`                          |          |             |
| `bw`                | `WithResponsive\<CSS['borderWidth']\>`                        |          |             |
| `c`                 | `WithResponsive\<ColorScheme \| CSS['color']\>`               |          |             |
| `children`          | `ReactNode`                                                   |          |             |
| `className`         | `string`                                                      |          |             |
| `classPrefix`       | `string`                                                      |          |             |
| `cleanable`         | `boolean`                                                     |          |             |
| `colgap`            | `WithResponsive\<CSS['columnGap']\>`                          |          |             |
| `container`         | `HTMLElement \| (() =\> HTMLElement)`                         |          |             |
| `containerPadding`  | `number`                                                      |          |             |
| `defaultOpen`       | `boolean`                                                     |          |             |
| `direction`         | `WithResponsive\<CSS['flexDirection']\>`                      |          |             |
| `disabled`          | `boolean`                                                     |          |             |
| `display`           | `WithResponsive\<CSS['display']\>`                            |          |             |
| `ff`                | `WithResponsive\<CSS['fontFamily']\>`                         |          |             |
| `flex`              | `WithResponsive\<CSS['flex']\>`                               |          |             |
| `fs`                | `WithResponsive\<CSS['fontSize']\>`                           |          |             |
| `fw`                | `WithResponsive\<CSS['fontWeight']\>`                         |          |             |
| `gap`               | `WithResponsive\<CSS['gap']\>`                                |          |             |
| `grow`              | `WithResponsive\<CSS['flexGrow']\>`                           |          |             |
| `h`                 | `WithResponsive\<CSS['height']\>`                             |          |             |
| `hideFrom`          | `Breakpoints`                                                 |          |             |
| `id`                | `string`                                                      |          |             |
| `inset`             | `WithResponsive\<CSS['inset']\>`                              |          |             |
| `insetx`            | `WithResponsive\<CSS['insetInline']\>`                        |          |             |
| `insety`            | `WithResponsive\<CSS['insetBlock']\>`                         |          |             |
| `justify`           | `WithResponsive\<CSS['justifyContent']\>`                     |          |             |
| `left`              | `WithResponsive\<CSS['left']\>`                               |          |             |
| `lh`                | `WithResponsive\<CSS['lineHeight']\>`                         |          |             |
| `locale`            | `Partial\<L\>`                                                |          |             |
| `lts`               | `WithResponsive\<CSS['letterSpacing']\>`                      |          |             |
| `m`                 | `WithResponsive\<CSS['margin']\>`                             |          |             |
| `maxh`              | `WithResponsive\<CSS['maxHeight']\>`                          |          |             |
| `maxw`              | `WithResponsive\<CSS['maxWidth']\>`                           |          |             |
| `mb`                | `WithResponsive\<CSS['marginBottom']\>`                       |          |             |
| `me`                | `WithResponsive\<CSS['marginInlineEnd']\>`                    |          |             |
| `minh`              | `WithResponsive\<CSS['minHeight']\>`                          |          |             |
| `minw`              | `WithResponsive\<CSS['minWidth']\>`                           |          |             |
| `ml`                | `WithResponsive\<CSS['marginLeft']\>`                         |          |             |
| `mr`                | `WithResponsive\<CSS['marginRight']\>`                        |          |             |
| `ms`                | `WithResponsive\<CSS['marginInlineStart']\>`                  |          |             |
| `mt`                | `WithResponsive\<CSS['marginTop']\>`                          |          |             |
| `mx`                | `WithResponsive\<CSS['marginInline']\>`                       |          |             |
| `my`                | `WithResponsive\<CSS['marginBlock']\>`                        |          |             |
| `onBlur`            | `FocusEventHandler\<any\>`                                    |          |             |
| `onClose`           | `() =\> void`                                                 |          |             |
| `onEnter`           | `(node: HTMLElement) =\> void`                                |          |             |
| `onEntered`         | `(node: HTMLElement) =\> void`                                |          |             |
| `onEntering`        | `(node: HTMLElement) =\> void`                                |          |             |
| `onExit`            | `(node: HTMLElement) =\> void`                                |          |             |
| `onExited`          | `(node: HTMLElement) =\> void`                                |          |             |
| `onExiting`         | `(node: HTMLElement) =\> void`                                |          |             |
| `onFocus`           | `FocusEventHandler\<any\>`                                    |          |             |
| `onOpen`            | `() =\> void`                                                 |          |             |
| `opacity`           | `WithResponsive\<CSS['opacity']\>`                            |          |             |
| `open`              | `boolean`                                                     |          |             |
| `order`             | `WithResponsive\<CSS['order']\>`                              |          |             |
| `p`                 | `WithResponsive\<CSS['padding']\>`                            |          |             |
| `pb`                | `WithResponsive\<CSS['paddingBottom']\>`                      |          |             |
| `pe`                | `WithResponsive\<CSS['paddingInlineEnd']\>`                   |          |             |
| `pl`                | `WithResponsive\<CSS['paddingLeft']\>`                        |          |             |
| `placeholder`       | `ReactNode`                                                   |          |             |
| `placement`         | `Placement`                                                   |          |             |
| `popupAutoWidth`    | `boolean`                                                     |          |             |
| `popupClassName`    | `string`                                                      |          |             |
| `popupStyle`        | `React.CSSProperties`                                         |          |             |
| `pos`               | `WithResponsive\<CSS['position']\>`                           |          |             |
| `pr`                | `WithResponsive\<CSS['paddingRight']\>`                       |          |             |
| `preventOverflow`   | `boolean`                                                     |          |             |
| `ps`                | `WithResponsive\<CSS['paddingInlineStart']\>`                 |          |             |
| `pt`                | `WithResponsive\<CSS['paddingTop']\>`                         |          |             |
| `px`                | `WithResponsive\<CSS['paddingInline']\>`                      |          |             |
| `py`                | `WithResponsive\<CSS['paddingBlock']\>`                       |          |             |
| `ref`               | `React.Ref\<PickerHandle \| undefined\>`                      |          |             |
| `renderExtraFooter` | `() =\> ReactNode`                                            |          |             |
| `right`             | `WithResponsive\<CSS['right']\>`                              |          |             |
| `rounded`           | `WithResponsive\<Size \| CSS['borderRadius'] \| 'full'\>`     |          |             |
| `rowgap`            | `WithResponsive\<CSS['rowGap']\>`                             |          |             |
| `self`              | `WithResponsive\<CSS['alignSelf']\>`                          |          |             |
| `shadow`            | `WithResponsive\<Size \| CSS['boxShadow']\>`                  |          |             |
| `showFrom`          | `Breakpoints`                                                 |          |             |
| `shrink`            | `WithResponsive\<CSS['flexShrink']\>`                         |          |             |
| `size`              | `BasicSize`                                                   |          |             |
| `spacing`           | `WithResponsive\<CSS['gap']\>`                                |          |             |
| `style`             | `CSSProperties`                                               |          |             |
| `ta`                | `WithResponsive\<CSS['textAlign']\>`                          |          |             |
| `td`                | `WithResponsive\<CSS['textDecoration']\>`                     |          |             |
| `tdc`               | `WithResponsive\<ColorScheme \| CSS['textDecorationColor']\>` |          |             |
| `tds`               | `WithResponsive\<CSS['textDecorationStyle']\>`                |          |             |
| `toggleAs`          | `ElementType`                                                 |          |             |
| `top`               | `WithResponsive\<CSS['top']\>`                                |          |             |
| `tt`                | `WithResponsive\<CSS['textTransform']\>`                      |          |             |
| `w`                 | `WithResponsive\<CSS['width']\>`                              |          |             |
| `z`                 | `WithResponsive\<CSS['zIndex']\>`                             |          |             |

## FormControlBaseProps

| Prop           | Type                                          | Required | Description |
|----------------|-----------------------------------------------|----------|-------------|
| `defaultValue` | `T`                                           |          |             |
| `disabled`     | `boolean`                                     |          |             |
| `name`         | `string`                                      |          |             |
| `onChange`     | `(value: T,  event: SyntheticEvent) =\> void` |          |             |
| `plaintext`    | `boolean`                                     |          |             |
| `readOnly`     | `boolean`                                     |          |             |
| `value`        | `T`                                           |          |             |

## FormControlPickerProps

| Prop                 | Type                                                          | Required | Description |
|----------------------|---------------------------------------------------------------|----------|-------------|
| `data`               | `TData[]`                                                     | ✓        |             |
| `align`              | `WithResponsive\<CSS['alignItems']\>`                         |          |             |
| `appearance`         | `PickerAppearance`                                            |          |             |
| `as`                 | `As`                                                          |          |             |
| `basis`              | `WithResponsive\<CSS['flexBasis']\>`                          |          |             |
| `bc`                 | `WithResponsive\<ColorScheme \| CSS['borderColor']\>`         |          |             |
| `bd`                 | `WithResponsive\<CSS['border']\>`                             |          |             |
| `bdb`                | `WithResponsive\<CSS['borderBottom']\>`                       |          |             |
| `bdbc`               | `WithResponsive\<ColorScheme \| CSS['borderBottomColor']\>`   |          |             |
| `bdbs`               | `WithResponsive\<CSS['borderBottomStyle']\>`                  |          |             |
| `bdbw`               | `WithResponsive\<CSS['borderBottomWidth']\>`                  |          |             |
| `bdl`                | `WithResponsive\<CSS['borderLeft']\>`                         |          |             |
| `bdlc`               | `WithResponsive\<ColorScheme \| CSS['borderLeftColor']\>`     |          |             |
| `bdls`               | `WithResponsive\<CSS['borderLeftStyle']\>`                    |          |             |
| `bdlw`               | `WithResponsive\<CSS['borderLeftWidth']\>`                    |          |             |
| `bdr`                | `WithResponsive\<CSS['borderRight']\>`                        |          |             |
| `bdrc`               | `WithResponsive\<ColorScheme \| CSS['borderRightColor']\>`    |          |             |
| `bdrs`               | `WithResponsive\<CSS['borderRightStyle']\>`                   |          |             |
| `bdrw`               | `WithResponsive\<CSS['borderRightWidth']\>`                   |          |             |
| `bdt`                | `WithResponsive\<CSS['borderTop']\>`                          |          |             |
| `bdtc`               | `WithResponsive\<ColorScheme \| CSS['borderTopColor']\>`      |          |             |
| `bdts`               | `WithResponsive\<CSS['borderTopStyle']\>`                     |          |             |
| `bdtw`               | `WithResponsive\<CSS['borderTopWidth']\>`                     |          |             |
| `bg`                 | `WithResponsive\<ColorScheme \| CSS['background']\>`          |          |             |
| `bga`                | `WithResponsive\<CSS['backgroundAttachment']\>`               |          |             |
| `bgc`                | `WithResponsive\<ColorScheme \| CSS['backgroundColor']\>`     |          |             |
| `bgi`                | `WithResponsive\<CSS['backgroundImage']\>`                    |          |             |
| `bgp`                | `WithResponsive\<CSS['backgroundPosition']\>`                 |          |             |
| `bgr`                | `WithResponsive\<CSS['backgroundRepeat']\>`                   |          |             |
| `bgsz`               | `WithResponsive\<CSS['backgroundSize']\>`                     |          |             |
| `block`              | `boolean`                                                     |          |             |
| `bottom`             | `WithResponsive\<CSS['bottom']\>`                             |          |             |
| `bs`                 | `WithResponsive\<CSS['borderStyle']\>`                        |          |             |
| `bsz`                | `WithResponsive\<CSS['boxSizing']\>`                          |          |             |
| `bw`                 | `WithResponsive\<CSS['borderWidth']\>`                        |          |             |
| `c`                  | `WithResponsive\<ColorScheme \| CSS['color']\>`               |          |             |
| `children`           | `ReactNode`                                                   |          |             |
| `childrenKey`        | `string`                                                      |          | children    |
| `className`          | `string`                                                      |          |             |
| `classPrefix`        | `string`                                                      |          |             |
| `cleanable`          | `boolean`                                                     |          |             |
| `colgap`             | `WithResponsive\<CSS['columnGap']\>`                          |          |             |
| `container`          | `HTMLElement \| (() =\> HTMLElement)`                         |          |             |
| `containerPadding`   | `number`                                                      |          |             |
| `defaultOpen`        | `boolean`                                                     |          |             |
| `defaultValue`       | `T`                                                           |          |             |
| `direction`          | `WithResponsive\<CSS['flexDirection']\>`                      |          |             |
| `disabled`           | `boolean`                                                     |          |             |
| `disabledItemValues` | `ToArray\<NonNullable\<I\>\>`                                 |          |             |
| `display`            | `WithResponsive\<CSS['display']\>`                            |          |             |
| `ff`                 | `WithResponsive\<CSS['fontFamily']\>`                         |          |             |
| `flex`               | `WithResponsive\<CSS['flex']\>`                               |          |             |
| `fs`                 | `WithResponsive\<CSS['fontSize']\>`                           |          |             |
| `fw`                 | `WithResponsive\<CSS['fontWeight']\>`                         |          |             |
| `gap`                | `WithResponsive\<CSS['gap']\>`                                |          |             |
| `grow`               | `WithResponsive\<CSS['flexGrow']\>`                           |          |             |
| `h`                  | `WithResponsive\<CSS['height']\>`                             |          |             |
| `hideFrom`           | `Breakpoints`                                                 |          |             |
| `id`                 | `string`                                                      |          |             |
| `inset`              | `WithResponsive\<CSS['inset']\>`                              |          |             |
| `insetx`             | `WithResponsive\<CSS['insetInline']\>`                        |          |             |
| `insety`             | `WithResponsive\<CSS['insetBlock']\>`                         |          |             |
| `justify`            | `WithResponsive\<CSS['justifyContent']\>`                     |          |             |
| `labelKey`           | `string`                                                      |          | label       |
| `left`               | `WithResponsive\<CSS['left']\>`                               |          |             |
| `lh`                 | `WithResponsive\<CSS['lineHeight']\>`                         |          |             |
| `locale`             | `Partial\<L\>`                                                |          |             |
| `lts`                | `WithResponsive\<CSS['letterSpacing']\>`                      |          |             |
| `m`                  | `WithResponsive\<CSS['margin']\>`                             |          |             |
| `maxh`               | `WithResponsive\<CSS['maxHeight']\>`                          |          |             |
| `maxw`               | `WithResponsive\<CSS['maxWidth']\>`                           |          |             |
| `mb`                 | `WithResponsive\<CSS['marginBottom']\>`                       |          |             |
| `me`                 | `WithResponsive\<CSS['marginInlineEnd']\>`                    |          |             |
| `minh`               | `WithResponsive\<CSS['minHeight']\>`                          |          |             |
| `minw`               | `WithResponsive\<CSS['minWidth']\>`                           |          |             |
| `ml`                 | `WithResponsive\<CSS['marginLeft']\>`                         |          |             |
| `mr`                 | `WithResponsive\<CSS['marginRight']\>`                        |          |             |
| `ms`                 | `WithResponsive\<CSS['marginInlineStart']\>`                  |          |             |
| `mt`                 | `WithResponsive\<CSS['marginTop']\>`                          |          |             |
| `mx`                 | `WithResponsive\<CSS['marginInline']\>`                       |          |             |
| `my`                 | `WithResponsive\<CSS['marginBlock']\>`                        |          |             |
| `name`               | `string`                                                      |          |             |
| `onBlur`             | `FocusEventHandler\<any\>`                                    |          |             |
| `onChange`           | `(value: T,  event: SyntheticEvent) =\> void`                 |          |             |
| `onClose`            | `() =\> void`                                                 |          |             |
| `onEnter`            | `(node: HTMLElement) =\> void`                                |          |             |
| `onEntered`          | `(node: HTMLElement) =\> void`                                |          |             |
| `onEntering`         | `(node: HTMLElement) =\> void`                                |          |             |
| `onExit`             | `(node: HTMLElement) =\> void`                                |          |             |
| `onExited`           | `(node: HTMLElement) =\> void`                                |          |             |
| `onExiting`          | `(node: HTMLElement) =\> void`                                |          |             |
| `onFocus`            | `FocusEventHandler\<any\>`                                    |          |             |
| `onOpen`             | `() =\> void`                                                 |          |             |
| `opacity`            | `WithResponsive\<CSS['opacity']\>`                            |          |             |
| `open`               | `boolean`                                                     |          |             |
| `order`              | `WithResponsive\<CSS['order']\>`                              |          |             |
| `p`                  | `WithResponsive\<CSS['padding']\>`                            |          |             |
| `pb`                 | `WithResponsive\<CSS['paddingBottom']\>`                      |          |             |
| `pe`                 | `WithResponsive\<CSS['paddingInlineEnd']\>`                   |          |             |
| `pl`                 | `WithResponsive\<CSS['paddingLeft']\>`                        |          |             |
| `placeholder`        | `ReactNode`                                                   |          |             |
| `placement`          | `Placement`                                                   |          |             |
| `plaintext`          | `boolean`                                                     |          |             |
| `popupAutoWidth`     | `boolean`                                                     |          |             |
| `popupClassName`     | `string`                                                      |          |             |
| `popupStyle`         | `React.CSSProperties`                                         |          |             |
| `pos`                | `WithResponsive\<CSS['position']\>`                           |          |             |
| `pr`                 | `WithResponsive\<CSS['paddingRight']\>`                       |          |             |
| `preventOverflow`    | `boolean`                                                     |          |             |
| `ps`                 | `WithResponsive\<CSS['paddingInlineStart']\>`                 |          |             |
| `pt`                 | `WithResponsive\<CSS['paddingTop']\>`                         |          |             |
| `px`                 | `WithResponsive\<CSS['paddingInline']\>`                      |          |             |
| `py`                 | `WithResponsive\<CSS['paddingBlock']\>`                       |          |             |
| `readOnly`           | `boolean`                                                     |          |             |
| `ref`                | `React.Ref\<PickerHandle \| undefined\>`                      |          |             |
| `renderExtraFooter`  | `() =\> ReactNode`                                            |          |             |
| `right`              | `WithResponsive\<CSS['right']\>`                              |          |             |
| `rounded`            | `WithResponsive\<Size \| CSS['borderRadius'] \| 'full'\>`     |          |             |
| `rowgap`             | `WithResponsive\<CSS['rowGap']\>`                             |          |             |
| `self`               | `WithResponsive\<CSS['alignSelf']\>`                          |          |             |
| `shadow`             | `WithResponsive\<Size \| CSS['boxShadow']\>`                  |          |             |
| `showFrom`           | `Breakpoints`                                                 |          |             |
| `shrink`             | `WithResponsive\<CSS['flexShrink']\>`                         |          |             |
| `size`               | `BasicSize`                                                   |          |             |
| `spacing`            | `WithResponsive\<CSS['gap']\>`                                |          |             |
| `style`              | `CSSProperties`                                               |          |             |
| `ta`                 | `WithResponsive\<CSS['textAlign']\>`                          |          |             |
| `td`                 | `WithResponsive\<CSS['textDecoration']\>`                     |          |             |
| `tdc`                | `WithResponsive\<ColorScheme \| CSS['textDecorationColor']\>` |          |             |
| `tds`                | `WithResponsive\<CSS['textDecorationStyle']\>`                |          |             |
| `toggleAs`           | `ElementType`                                                 |          |             |
| `top`                | `WithResponsive\<CSS['top']\>`                                |          |             |
| `tt`                 | `WithResponsive\<CSS['textTransform']\>`                      |          |             |
| `value`              | `T`                                                           |          |             |
| `valueKey`           | `string`                                                      |          | value       |
| `w`                  | `WithResponsive\<CSS['width']\>`                              |          |             |
| `z`                  | `WithResponsive\<CSS['zIndex']\>`                             |          |             |

## PopupProps

| Prop             | Type                  | Required | Description |
|------------------|-----------------------|----------|-------------|
| `popupAutoWidth` | `boolean`             |          |             |
| `popupClassName` | `string`              |          |             |
| `popupStyle`     | `React.CSSProperties` |          |             |

## PickerToggleProps

| Prop             | Type                                 | Required | Description           |
|------------------|--------------------------------------|----------|-----------------------|
| `active`         | `boolean`                            |          |                       |
| `caret`          | `boolean`                            |          |                       |
| `caretAs`        | `React.ElementType`                  |          |                       |
| `caretComponent` | `React.FC\<IconProps\>`              |          | Use `caretAs` instead |
| `cleanable`      | `boolean`                            |          |                       |
| `countable`      | `boolean`                            |          |                       |
| `disabled`       | `boolean`                            |          |                       |
| `focusItemValue` | `T \| null`                          |          |                       |
| `hasValue`       | `boolean`                            |          |                       |
| `inputValue`     | `T \| T[]`                           |          |                       |
| `label`          | `React.ReactNode`                    |          |                       |
| `loading`        | `boolean`                            |          |                       |
| `name`           | `string`                             |          |                       |
| `onClean`        | `(event: React.MouseEvent) =\> void` |          |                       |
| `placement`      | `Placement`                          |          |                       |
| `plaintext`      | `boolean`                            |          |                       |
| `readOnly`       | `boolean`                            |          |                       |
| `tabIndex`       | `number`                             |          |                       |

## DataProps

| Prop          | Type      | Required | Description |
|---------------|-----------|----------|-------------|
| `data`        | `TData[]` | ✓        |             |
| `childrenKey` | `string`  |          | children    |
| `labelKey`    | `string`  |          | label       |
| `valueKey`    | `string`  |          | value       |

---
*Auto-generated by `scripts/gen-rsuite-docs.js`.*

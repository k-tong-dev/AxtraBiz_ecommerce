# SelectPicker — Props

| Property           | Type                                        | Default         | Description                                         |
|--------------------|---------------------------------------------|-----------------|-----------------------------------------------------|
| appearance         | `'default' \| 'subtle'`                     | `'default'`     | Set picker appearence                               |
| block              | boolean                                     | -               | Blocking an entire row                              |
| caretAs            | ElementType                                 | -               | Custom component for the caret icon                 |
| cleanable          | boolean                                     | `true`          | Whether the selected value can be cleared           |
| container          | HTMLElement \| (() => HTMLElement)          | -               | Sets the rendering container                        |
| data *             | ItemDataType[]                              | `[]`            | Selectable data                                     |
| defaultOpen        | boolean                                     | -               | Default value of open component                     |
| defaultValue       | ValueType                                   | -               | Default value                                       |
| disabled           | boolean                                     | -               | Whether disabled select                             |
| disabledItemValues | ValueType[]                                 | `[]`            | Disable item by value                               |
| groupBy            | string                                      | -               | Set grouping criteria 'key' for data                |
| label              | ReactNode                                   | -               | A label displayed at the beginning of toggle button |
| labelKey           | string                                      | `'label'`       | Set label key in data                               |
| listProps          | ListProps                                   | -               | List-related properties in react-virtualized        |
| loading            | boolean                                     | -               | Whether to display a loading state indicator        |
| locale             | PickerLocaleType                            | -               | Define the localization settings                    |
| maxHeight          | number                                      | `320`           | The maximum height of the Dropdown                  |
| menuAutoWidth      | boolean                                     | `true`          | Set the width of the menu automatically             |
| menuClassName      | string                                      | -               | A css class to apply to the Menu DOM node           |
| menuMaxHeight      | number                                      | `320`           | The max height of the menu                          |
| menuStyle          | CSSProperties                               | -               | A style to apply to the Menu DOM node               |
| onChange           | (value, event) => void                      | -               | Callback fired when value changes                   |
| onClean            | (event) => void                             | -               | Callback fired when value is cleared                |
| onClose            | () => void                                  | -               | Callback fired when close component                 |
| onOpen             | () => void                                  | -               | Callback fired when open component                  |
| onSearch           | (keyword, event) => void                    | -               | Callback fired when search                          |
| onSelect           | (value, item, event) => void                | -               | Callback fired when item is selected                |
| open               | boolean                                     | -               | Whether open the component                          |
| placeholder        | string                                      | `'Select'`      | Setting placeholders                                |
| placement          | Placement                                   | `'bottomStart'` | The placement of component                          |
| preventOverflow    | boolean                                     | -               | Prevent floating element overflow                   |
| renderExtraFooter  | () => ReactNode                             | -               | Custom render extra footer                          |
| renderMenu         | (menu) => ReactNode                         | -               | Customizing the Rendering Menu list                 |
| renderMenuGroup    | (groupTitle, item) => ReactNode             | -               | Custom render menu group                            |
| renderMenuItem     | (label, item) => ReactNode                  | -               | Custom render menu items                            |
| renderValue        | (value, item, selectedElement) => ReactNode | -               | Custom render selected items                        |
| searchable         | boolean                                     | `true`          | Whether display search input box                    |
| searchBy           | (keyword, label, item) => boolean           | -               | Custom search rules                                 |
| size               | `'lg' \| 'md' \| 'sm' \| 'xs'`              | `'md'`          | A picker can have different sizes                   |
| sort               | (isGroup) => (a, b) => number               | -               | Sort options                                        |
| toggleAs           | ElementType                                 | `<a>`           | You can use a custom element for this component     |
| value              | ValueType                                   | -               | Value (Controlled)                                  |
| valueKey           | string                                      | `'value'`       | Set value key in data                               |
| virtualized        | boolean                                     | -               | Whether using Virtualized List                      |

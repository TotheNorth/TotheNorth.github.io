| 参数       | 说明                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| title      | 模态窗标题                                                                                               |
| open       | 模态窗是否展示                                                                                           |
| onSuccess  | 点击确认按钮回调                                                                                         |
| onCancel   | 点击取消按钮回调                                                                                         |
| readonly   | 表单是否只读（不建议使用表单只读，推荐使用 Detai 或 ModalDetail 组件）                                   |
| schema     | 表单配置项，详见[NewForm](https://github.com/Hokkaii/agul-ui/blob/main/src/components/NewForm/README.md) |
| forwordRef | 表单的 ref 引用，提供 validate 和 resetFields 两个方法，分别用于表单的校验后提交和重置校验状态           |
| formData   | 表单初始值                                                                                               |

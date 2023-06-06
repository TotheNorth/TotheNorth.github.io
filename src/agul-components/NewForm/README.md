### 基本介绍

NewForm 是基于 xRender (1.x)的[FormRender](https://x-render.oschina.io/form-render/) 构建的基于 schema 的表单组件，旨在通过简易的数据描述构建强大的表单不再依赖于冗杂的 jsx 组合。

### 参数

| 参数             | 描述                                                                                                                                                                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| schema           | 描述表单的基本信息、结构和校验[详见 FormRender](https://x-render.oschina.io/form-render/schema/schema)，在此基础上，NewForm 新增了一些其他字段以满足业务需求，详见[其他 schema 字段](https://igitlab.iauto.com/cloud/node_modules/iauto-web-components/NewForm/widgets/README.md) |
| readonly         | 表单是否只读（不建议使用表单只读，推荐使用 Detai 或 ModalDetail 组件）                                                                                                                                                                              |
| forwordRef       | 表单的 ref 引用，提供 validate 和 resetFields 两个方法，分别用于表单的校验后提交和重置校验状态                                                                                                                                                      |
| formData         | 表单初始值                                                                                                                                                                                                                                          |
| onSubmit         | 表单提交回调，回调函数存在两个参数分别是表单 data 和校验信息 errors，如果 errors 为否或空则校验通过；值为否不显示提交按钮                                                                                                                           |
| submitText       | 提交按钮文案                                                                                                                                                                                                                                        |
| onCancel         | 取消按钮回调，值为否不显示取消按钮                                                                                                                                                                                                                  |
| cancelText       | 取消按钮文案                                                                                                                                                                                                                                        |
| removeHiddenData | schema 中使用 hidden 关键字隐藏的字段是否提交                                                                                                                                                                                                       |
| onChange         | 表单值变化回调                                                                                                                                                                                                                                      |
| extraButtons     | 其他自定义按钮 (排列在提交按钮与取消按钮之后)                                                                                                                                                                                                       |
| widgets          | 自定义表单的子组件                                                                                                                                                                                                                                  |

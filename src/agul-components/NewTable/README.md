### 主要参数说明

| 参数                      | 说明                                                                                                                                                                                                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url(string)               | 数据源地址，变更会触发新的数据请求刷新列表                                                                                                                                                                                                                                      |
| method(post 或 get)       | 请求方式，默认为 get                                                                                                                                                                                                                                                            |
| path(string)              | 数据源路径                                                                                                                                                                                                                                                                      |
| pagePath(string)          | 页码数据源路径                                                                                                                                                                                                                                                                  |
| params(object)            | 请求参数，变更会触发新的数据请求刷新列表,深比较触发数据请求页面刷新                                                                                                                                                                                                             |
| columns(object[])         | 同 antd，添加 format 字段可自动处理时间格式(YYYY-MM-DD) ;注意这里时间会通过 UTC +8 时区处理然后 format                                                                                                                                                                          |
| height(number)            | 表格高度，超出 scroll                                                                                                                                                                                                                                                           |
| rowSelect(boolean)        | 是否开启添加左侧复选框列                                                                                                                                                                                                                                                        |
| needOrder(boolean)        | 是否开启添加左侧序号列                                                                                                                                                                                                                                                          |
| operate(object[])         | 操作栏按钮配置，依据业务类型主要提供新增（add）、编辑（edit） 、详情（detail）、删除（delete）、下载（download）、文本预览（file）等功能，也可以支持自定义组件                                                                                                                  |
| ref                       | 组件 ref 引用，提供 checkedData（复选框列选中条目集合）、 reload（重置排序页码数据刷新表格）、update（刷新表格）以及行数据                                                                                                                                                      |
| childTable(object)        | 子表格配置，需要配置两个属性 field（条目中哪个属性作为子表格数据源） 和 columns，这里只提供单一层级的子表格                                                                                                                                                                     |
| rowConfig(object[])       | 允许对列表列进行配置，值类型同 columns，额外添加 disabled 字段用于控制配置列按钮是否可用                                                                                                                                                                                        |
| tableOperateBoxId(string) | 配置列按钮容器 id，不填则绝对定位于表格右上角之外                                                                                                                                                                                                                               |
| exportBtn(object)         | 导出按钮；url、params、method、fileName（一般不需要，会从响应头中取默认文件名称，即便添加也会优先从响应头中取，此配置是为了防止后台相应缺失该数据。如果后台的响应头`Content-Disposition`中无文件名信息且`exportBtn.filename`为空则不允许下载文件）、headers（请求时额外请求头） |
| tableExportBoxId(string)  | 导出按钮容器 id，不填则绝对定位于表格右上角之外                                                                                                                                                                                                                                 |

### operate 按钮说明

##### 编辑

- type: edit
- text: 按钮文案
- routerPath: 跳转至新的路由页进行编辑操作的页面地址，该项存在时则 schema、url、method 和 widgets 均失效
- field: 创建一个 key 为 field、value 为 row[field]的键值对，这里 row 为表格行数据。routerPath 存在时，该键值对用于路由参数传递；detailUrl 存在时拼接给该路径用于请求详情并合并该键值对，合并后的数据注入至弹出框表单的 formData 中充当请求参数
- schema: 使用弹出框表单，schema 为 Newform 的[配置项](https://igitlab.iauto.com/cloud/node_modules/iauto-web-components/-/blob/dev/src/components/NewForm/README.md)
- url: 弹出框表单的提交请求地址
- detailUrl: 接口请求地址
- method: 请求方式(一般编辑操作为 put，但也存在为其他方式的情况，不填默认为 put)
- widgets: 自定义 NewForm 表单的子组件
- condition:"row.status === '0'" ,row 指行数据，字符串表达式决定是否展示该按钮

##### 详情

- type: detail
- text: 按钮文案
- routerPath:
- field:
- condition:"row.status === '0'" ,row 指行数据，字符串表达式决定是否展示该按钮

##### 删除

- type: delete
- text: 按钮文案
- url: 接口请求地址
- method: 请求方式(一般新增操作为 delete，但也存在为其他方式的情况，不填默认为 delete)
- field: 创建一个 key 为 field、value 为 row[field]的键值对，这个键值对充当请求参数
- condition:"row.status === '0'" ,row 指行数据，字符串表达式决定是否展示该按钮

##### 下载

- type: download
- text: 按钮文案
- field:创建一个 key 为 field、value 为 row[field]的键值对。downloadUrl 存在时键值对充当请求参数进行请求，downloadUrl 不存在时以键值对的 value 为请求地址进行请求
- downloadUrl: 通用下载地址
- method: 请求方式
- fileName: 文件名（一般不需要，会从响应头中取默认文件名称，即便添加也会优先从响应头中取，此配置是为了防止后台相应缺失该数据。如果后台的响应头`Content-Disposition`中无文件名信息且`filename`为空则不允许下载文件）
- headers: 请求时额外请求头
- condition: "row.status === '0'" ,row 指行数据，字符串表达式决定是否展示该按钮

##### 文本预览

- type: file
- text: 按钮文案
- field:创建一个 key 为 field、value 为 row[field]的键值对。downloadUrl 存在时键值对充当请求参数进行请求，downloadUrl 不存在时以键值对的 value 为请求地址进行请求
- downloadUrl: 文件地址
- method: 请求方式
- condition:"row.status === '0'" ,row 指行数据，字符串表达式决定是否展示该按钮

##### 自定义 operate 按钮

- type: custom
- widget: React 组件（类或函数）或字符串
- condition:"row.status === '0'" ,row 指行数据，字符串表达式决定是否展示该按钮

#### columns 新增字段

##### otherFilters 自定义字段筛选（放置于表格中头）

- type: input，select，checkbox，dateRange
- field: 数据请求时字段名，不填则为 columns 的 dataIndex
- treeData：checkbox 或 select 的 options 值，数据格式与 antd 一致。
- props：透传至 antd 组件的 props

##### 多字段排序

在 columns 中通过 配置 `sorter: { multiple }` ，在 NewTable 中会把多个排序字段拼接后提交，格式为`field1:desc;feild2:asc;`

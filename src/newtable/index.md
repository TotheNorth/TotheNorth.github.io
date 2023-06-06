---
toc: content
---

# NewTable

## 基本用法

示例使用模拟接口进行数据请求简单的展示效果。

```jsx
import { NewTable } from "@iauto/components";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render(text) {
      return text?.first;
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];
export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10"
    columns={columns}
    path="results"
  />
);
```

## 枚举映射

使用`columns`中的`enums`字段规定好映射关系，显示既定的数据，可以与`tagType`一起使用。

```jsx
import { NewTable } from "@iauto/components";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render(text) {
      return text?.first;
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
    enums: {
      male: "男性",
      female: "女性",
    },
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];
export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10"
    columns={columns}
    path="results"
  />
);
```

## Tag 显示

使用`columns`中的`tagType`字段规定`tag`类型与行数据字段的对应关系，以`tag`形式显示数据，可以与`enums`一起使用。

```jsx
import { NewTable } from "@iauto/components";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render(text) {
      return text?.first;
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
    tagType: {
      male: "success",
      female: "error",
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
    tagType: {
      male: "default",
      female: "process",
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
    tagType: {
      male: "default",
      female: "process",
    },
    enums: {
      male: "男性",
      female: "女性",
    },
  },
];
export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10"
    columns={columns}
    path="results"
  />
);
```

## 操作栏配置

示例使用模拟接口进行数据请求简单的展示效果。

### 增删改查

```jsx
import { NewTable } from "@iauto/components";
import { Divider } from "antd";
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render(text) {
      return text?.first;
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];
const schema = {
  type: "object",
  properties: {
    phone: {
      title: "Phone",
      type: "string",
      required: true,
    },
    gender: {
      title: "Gender",
      type: "string",
      enum: ["male", "female"],
      enumNames: ["male", "female"],
    },
  },
  displayType: "row",
};
const operate = {
  buttons: [
    { type: "add", text: "新增", schema },
    { type: "edit", text: "编辑", schema },
    {
      type: "detail",
      text: "详情",
      routerPath: "/components/global-config",
      field: "phone",
    },
    { type: "delete", text: "删除", field: "id.value", url: "/delete" },
  ],
};
export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10"
    columns={columns}
    path="results"
    operate={operate}
  />
);
```

### 下载操作 & 自定义按钮

<code>下载按钮的实际效果会有偏差，以控制台的传参和请求方式为准。</code>
如果已有的按钮类型不能满足业务需求，可以使用一个`React`组件作为自定义按钮，组件可以从`props`中取到`row(行数据)`、`reload(重置页码刷新表格)` 和 `update(当前页码刷新表格)`以及 `checkedData(行选择数据)`。

```jsx
import { NewTable } from "@iauto/components";
import { Divider } from "antd";
import _ from "lodash";
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render(text) {
      return text?.first;
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];
const schema = {
  type: "object",
  properties: {
    phone: {
      title: "Phone",
      type: "string",
      required: true,
    },
    gender: {
      title: "Gender",
      type: "string",
      enum: ["male", "female"],
      enumNames: ["male", "female"],
    },
  },
  displayType: "row",
};
const CustomBtn = (props) => {
  const callback = () => {
    console.log(props);
    window.open(_.get(props, "row.picture.large"));
  };
  return <a onClick={callback}>查看头像</a>;
};
const operate = {
  buttons: [
    {
      type: "download",
      text: "get 下载",
      downloadUrl:
        "https://github.com/sensorsdata/sa-sdk-javascript/archive/refs/tags/v1.25.2.zip?id=${id}",
      field: "id.value",
      url: "/delete",
    },
    {
      type: "download",
      text: "post 下载",
      headers: { a: 1 },
      method: "post",
      downloadUrl:
        "https://github.com/sensorsdata/sa-sdk-javascript/archive/refs/tags/v1.25.2.zip",
      field: "phone",
      url: "/delete",
    },
    {
      type: "custom",
      widget: CustomBtn,
    },
  ],
};
export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10"
    columns={columns}
    path="results"
    operate={operate}
  />
);
```

## 排序

这里的排序指的是后端排序。

#### 多字段排序

配置`columns`的`sorter.multuple`自动开启多字段排序，具体参数见控制台。

```jsx
import { NewTable } from "@iauto/components";
import { Button } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render(text) {
      return text?.first;
    },
    sorter: {
      multiple: 1, // 任意数值即可
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
    sorter: {
      multiple: 10,
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Phone",
    dataIndex: "phone",
    sorter: {
      multiple: 1,
    },
  },
];
export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10"
    columns={columns}
    path="results"
  />
);
```

#### 单字段排序

配置`columns`的`sorter.multuple`自动开启多字段排序，具体请求参数见控制台。

```jsx
import { NewTable } from "@iauto/components";
import { Button } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render(text) {
      return text?.first;
    },
    sorter: {
      multiple: true,
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
    sorter: true,
  },
  {
    title: "Email",
    dataIndex: "email",
    sorter: true,
  },
  {
    title: "Phone",
    dataIndex: "phone",
    sorter: {
      multiple: true,
    },
  },
];
export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10"
    columns={columns}
    path="results"
  />
);
```

## 自定义筛选

这里的筛选指的是后端筛选。

配置`columns`的`otherFilters`自动开启列筛选功能，具体请求参数见控制台。
`注意`： `type`为 `checkbox`时，会以数组形式传递参数，具体效果见`post`请求时的请求参数，而例中使用接口为 `get`请求。

```jsx
import { NewTable } from "@iauto/components";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render(text) {
      return text?.first;
    },
    otherFilters: {
      type: "input",
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
    otherFilters: {
      type: "select",
      treeData: [
        { label: "A", value: "a" },
        { label: "B", value: "b" },
        { label: "C", value: "c" },
      ],
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    otherFilters: {
      type: "checkbox",
      field: "custom",
      treeData: [
        { label: "A", value: "a" },
        { label: "B", value: "b" },
        { label: "C", value: "c" },
      ],
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    otherFilters: {
      type: "dateRange",
      field: ["start", "end"],
    },
  },
];
export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10"
    columns={columns}
    path="results"
  />
);
```

## 行选择

配置 `rowSelect` 项开启行选择，通过 `ref` 引用获取已选数据，控制台查看打印数据。

```jsx
import { NewTable } from "@iauto/components";
import { Button } from "antd";
import { useRef } from "react";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render(text) {
      return text?.first;
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];
export default () => {
  const ref = useRef(null);
  const show = () => {
    console.log(ref?.current?.checkedData);
  };
  return (
    <>
      <NewTable
        url="https://randomuser.me/api?pagination[total]=200&results=10"
        columns={columns}
        path="results"
        rowSelect
        ref={ref}
      />
      <Button onClick={() => show()}>click me show the selected data</Button>
    </>
  );
};
```

## 首栏添加序号

添加`needOrder`属性为表格自动添加编号。

```jsx
import { NewTable } from "@iauto/components";
import { Button } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render(text) {
      return text?.first;
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];
export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10"
    columns={columns}
    path="results"
    needOrder
  />
);
```

## 配置列

添加`rowConfig`为表格添加`动态配置列`功能。

```jsx
import { NewTable } from "@iauto/components";
import { Button } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render(text) {
      return text?.first;
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Phone",
    dataIndex: "phone",
  },
];
const rowConfig = [
  {
    title: "Name",
    dataIndex: "name",
    render(text) {
      return text?.first;
    },
    disabled: true,
  },
  {
    title: "Gender",
    dataIndex: "gender",
    disabled: true,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Phone",
    dataIndex: "phone",
  },
];
export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10"
    columns={columns}
    path="results"
    rowConfig={rowConfig}
  />
);
```

## API

### NewTable

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>url</td>
    <td>必填，资源接口地址</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>path</td>
    <td>资源在接口出参中的路径</td>
    <td>string</td>
    <td>'data'</td>
  </tr>
  <tr>
    <td>pagePath</td>
    <td>分页数据在接口出参中的路径</td>
    <td>string</td>
    <td>'pageable'</td>
  </tr>
  <tr>
    <td>method</td>
    <td>请求方式</td>
    <td>'get' | 'post'</td>
    <td>'get'</td>
  </tr>
  <tr>
    <td>params</td>
    <td>额外的请求的参数</td>
    <td>Record&lt;string, any&gt;</td>
    <td>-</td>
  </tr>
   <tr>
    <td>extraPagination</td>
    <td>额外的分页器配置项，参考 <a href="https://4x.ant.design/components/table-cn/#pagination" target="_blank">antd分页器</a></td>
    <td>object</td>
    <td>
      <div style="white-space:nowrap;">
      {</br>
        &nbsp;showSizeChanger: true, </br>
        &nbsp;showQuickJumper: true, </br>
        &nbsp;position: ['bottomRight'], </br>
        &nbsp;showTotal: (total)=>`共${total}条`, </br>
        &nbsp;pageSize: 8, </br>
        &nbsp;locale: {jump_to:'前往'},</br>
        &nbsp;pageSizeOptions: [8,16,40,80]</br>
      }
      </div>
    </td>
  </tr>
  <tr>
    <td>columns</td>
    <td>表格列的配置描述</td>
    <td>ColumnsType[]</td>
    <td>-</td>
  </tr>
   <tr>
    <td>operate</td>
    <td>操作栏配置，添加操作列</td>
    <td>OperateProps[]</td>
    <td>-</td>
  </tr>
  <tr>
    <td>rowSelect</td>
    <td>是否开启行选择</td>
    <td>boolean</td>
    <td>false</td>
  </tr>
  <tr>
    <td>rowConfig</td>
    <td>允许对列表列进行配置，值类型同 columns，额外添加 disabled 字段用于控制配置列按钮是否可用</td>
    <td><div style="white-space:nowrap;">ColumnsType[]</div></td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">tableOperateBoxId</div></td>
    <td>为配置列（rowConfig）功能按钮选定一个父容器，这里填该父容器的 id</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>needOrder</td>
    <td>首栏是否添加序号</td>
    <td>boolean</td>
    <td>false</td>
  </tr>
  <tr>
    <td>childTable</td>
    <td>子表格配置</td>
    <td>boolean</td>
    <td>false</td>
  </tr>
  <tr>
    <td>height</td>
    <td>表格高度，超出 scrol</td>
    <td>number</td>
    <td>-</td>
  </tr>
  <tr>
    <td>rowKey</td>
    <td>同antd-rowKey，表格行 key 的取值，可以是字符串或一个函数</td>
    <td>string | function(record): string</td>
    <td>'id'</td>
  </tr>
  <tr>
    <td>ref</td>
    <td>组件引用，可以调用 reload(重置页码刷新) 和 update(当前页码刷新) 两个方法刷新表格，也可以通过 checkedData 拿到行选择数据</td>
    <td>useRef</td>
    <td>-</td>
  </tr>
  <tr>
    <td>exportBtn</td>
    <td>导出按钮</td>
    <td>-</td>
    <td>-</td>
  </tr>
  </tr>
  <tr>
    <td>tableExportBoxId</td>
    <td>为导出（exportBtn）功能按钮选定一个父容器，这里填该父容器的 id</td>
    <td>string</td>
    <td>-</td>
  </tr>

</table>

### OperateProps

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>type</td>
    <td>按钮类型，有增删改查四种默认类型，同时也支持自定义按钮</td>
    <td>'add' | 'edit' | 'detail' | 'delete' | 'download' | 'custom'</td>
    <td>-</td>
  </tr>
  <tr>
    <td>text</td>
    <td>按钮文案，自定义按钮时该配置无效</td>
    <td>'新增'/'编辑'/'详情'/'删除'/'下载'</td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">routerPath</div></td>
    <td>type为 add、edit 或 detail 时，该字段存在要跳转新页面进行<code>新增/编辑/查看详情</code>，字段值代表路由地址，路由参数由 field 字段决定</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>field</td>
    <td>
      当 routerPath 存在时，field 会与 row[field] ( row 指行数据) 组成<code>键值对</code>，这个键值对作为路由参数传递。</br> </br>
      当 routerPath 不存在时，要分情况讨论：</br> </br>
      1. <code>新增/编辑/详情/删除</code>时: 如果 field 不存在则直接使用 url 进行<code>提交/详情</code>请求。如果 field 存在且 url 中存在 {xxx} 字符串则 {xxx} 字符串会被替换为 row[feild] 值；如果 url 中不存在 {xxx} 字符串且请求类型( method )为 post 或 put 则 feild 与 row[feild] 值组成的键值对会被加入到 body 中然后进行<code>提交/详情</code>请求。</br></br>
      2. <code>下载</code>时: 如果 field 不存在则不允许下载；如果 field 存在且 url 中存在 {xxx} 字符串则 {xxx} 字符串会被替换为 row[feild] 值( url 不存在 {xxx} 字符串则不替换，如果请求类型( method )为 post 或 put 则 feild 与 row[feild] 值组成的键值对会被加入到 body 中)进行请求；如果 url 不存在则会取 row[feild] 值作为请求地址。</br>
      </br>
    注：xxx 指可以是任何字符串，例如一个 url 是 '/api/getData:{id}' 且 row[feild] 为 1，则最后实际请求的地址为 '/api/getData:10'
    </td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>schema</td>
    <td>当 routerPath 不存在时，以弹窗的形式进行<code>新增/编辑/查看详情</code>，schema表示对表单的描述</td>
    <td><a href="/components/newform#newform-1">schema</a></td>
    <td>'id'</td>
  </tr>
   <tr>   
    <td>widgets</td>
     <td>自定义组件，当模态窗表单的内置组件无法满足时使用</td>
    <td><a href="/components/newform#newform-1">widgets</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>url</td>
    <td><code>新增/编辑/删除</code>操作中最后调用的接口地址，<code>详情</code>操作中 url 字段用于请求详情接口</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>detailUrl</td>
    <td>
      <code>编辑</code> 操作时，如果 field 存在且 detailUrl 中存在 {xxx} 字符串则 {xxx} 字符串会被替换为 row[feild] 值；如果 url 中不存在 {xxx} 字符串且请求类型( method )为 post 或 put 则 feild 与 row[feild] 值组成的键值对会被加入到 body 中然后进行<code>详情请求</code>。
    </td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>method</td>
    <td><code>新增/编辑/删除</code> 操作允许规定请求方式/td>
    <td>string</td>
    <td><div style="white-space:nowrap;">'post'/'put'/'delete'</div></td>
  </tr>
</table>

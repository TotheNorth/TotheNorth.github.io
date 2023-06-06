---
toc: content
---

# VirtualTable

配置与 [antd-table](https://ant.design/components/table-cn#api) 一致，只增加虚拟列表特性，用于大数据展示。

```jsx
import { VirtualTable } from "@iauto/components";
const columns = [
  { title: "A", dataIndex: "key" },
  { title: "B", dataIndex: "key" },
  { title: "C", dataIndex: "key" },
  { title: "D", dataIndex: "key" },
];

const data = Array.from({ length: 100000 }, (_, key) => ({ key }));

export default () => (
  <VirtualTable
    columns={columns}
    dataSource={data}
    scroll={{ x: "max-content", y: 300 }}
  />
);
```

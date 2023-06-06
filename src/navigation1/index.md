---
toc: content
---

# Navigation

## 基本用法

```jsx
import { Navigation } from "@iauto/components";
import { Button } from "antd";

export default () => (
  <Navigation
    routes={[
      { path: "/", name: "首页" },
      { path: "/components/navigation1", name: "面包屑" },
    ]}
  />
);
```

## API

##### Navigation

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>routes</td>
    <td>路由表配置，路由按数组的下标顺序在面包屑中展示</td>
    <td>{ name: string; path: string }[]</td>
    <td>-</td>
  </tr>
  <tr>
    <td>style</td>
    <td>面包屑组件外层样式</td>
    <td>CSSProperties</td>
    <td>-</td>
  </tr>
</table>

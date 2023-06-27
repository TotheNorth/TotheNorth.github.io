---
toc: content
---

# ConfigProvider

## 基本使用

由于组件库的一些组件代理了开发者的某些`敏感交互行为`，例如`NewTable`代理了数据请求，而如果开发者希望数据请求时添加请求头，则该组件将不能被正常使用。这就需要提供一个入口用于配置一些全局信息的入口来配置例如请求头等`环境信息`或者其他后续的`全局配置信息`。
`ConfigProvider`使用 `React` 的 [context](https://zh-hans.react.dev/reference/react/createContext) 特性，只需在应用外围包裹一次即可全局生效。

```
import React from "react";
import { ConfigProvider } from "@iauto/react-ui";
export function rootContainer(container: any) {
  return React.createElement(
    ConfigProvider,
    {
      requestHeaders: { "x-user-id": "1" },
      needReqSign: false,
    },
    container
  );
}
```

上述配置为组件库的组件请求行为以及`useNewRequest-hook`添加请求头并禁止添加签名（默认带签名）。
需要注意，在引用`useNewRequest`单独使用时，`needReqSign`全局配置会被`useNewRequest`的`needSignature`属性配置覆盖掉。

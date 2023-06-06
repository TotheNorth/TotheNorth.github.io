---
toc: content
---

# AgulWrapperConfigContext

由于组件库的一些组件代理了开发者的某些`敏感交互行为`，例如`NewTable`代理了数据请求，而如果开发者希望数据请求时添加请求头，则该组件将不能被正常使用。这就需要提供一个入口用于配置一些全局信息的入口来配置例如请求头等`环境信息`或者其他后续的`全局配置信息`。
`AgulWrapperConfigContext`使用 `React` 的 [context](https://zh-hans.react.dev/reference/react/createContext) 特性，只需在应用外围包裹一次即可全局生效。

```
import { AgulWrapperConfigContext } from "@iauto/components";
import React from 'react';

// ...
const Demo: React.FC = () => (
  <AgulWrapperConfigContext.Provider value={{ requestHeaders: {token: 'xxx', refreshToken: 'xxx'} }}>
    <App />
  </AgulWrapperConfigContext.Provider>
);

export default Demo;
```

目前`AgulWrapperConfigContext`仅起到为部分组件的数据请求行为配置请求头的作用，通过以上配置添加`requestHeaders`的`context-value`就可以达到该目的。

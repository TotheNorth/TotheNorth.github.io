---
toc: content
---

## ModalWithForm

因`弹窗形式表单`常见于项目中，所以将`NewForm`与`antd-Modal`两个组件组合为`ModalWithForm`，表单数据见控制台。

```jsx
import { ModalWithForm } from "@iauto/components";
import { useRef, useState } from "react";
import { Button } from "antd";
const schema = {
  type: "object",
  properties: {
    input1: {
      title: "简单输入框",
      type: "string",
      required: true,
    },
    select1: {
      title: "单选",
      type: "string",
      enum: ["a", "b", "c"],
      enumNames: ["早", "中", "晚"],
    },
  },
  displayType: "row",
  column: 1,
  labelWidth: 100,
};

export default () => {
  const formRef = useRef(null);
  const [open, setOpen] = useState(false);
  const onSuccess = () => {
    formRef?.current?.validate().then((res) => {
      console.log(res);
      if (!res.errors || !res.errors.length) {
        console.log(res);
        setOpen(!open);
      }
    });
  };

  return (
    <>
      <ModalWithForm
        title="示例表单"
        width="800px"
        height="500px"
        schema={schema}
        open={open}
        onCancel={() => setOpen(!open)}
        onSuccess={onSuccess}
        ref={formRef}
      />
      <Button onClick={() => setOpen(!open)}>click me to show the form</Button>
    </>
  );
};
```

## API

### ModalWithForm

`TableWithForm`的配置参数基本是`NewTable`的所有参数（原`operate`改为`tableOperate`）加上`NewForm`的`schema`与`widgets`，因此此类参数不再具体展开说明，这里着重介绍`TableWithForm`的一些特有配置参数。

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th><div style="white-space:nowrap;">默认值</div></th>
  </tr>
<tr>
    <td>schema</td>
    <td>表单描述</td>
    <td>object</td>
    <td>-</td>
  </tr>
  <tr>
    <td>formData</td>
    <td>表单值</td>
    <td>object</td>
    <td>-</td>
  </tr>
 <tr>
    <td>widgets</td>
    <td>自定义组件，详见[自定义组件](https://xrender.fun/form-render/advanced-widget)。</td>
    <td><div style="white-space:nowrap;">Record&lt;string, ReactNode&gt;</div></td>
    <td>-</td>
  </tr>
  <tr>
    <td>open</td>
    <td>模态窗是否展示</td>
    <td>boolean</td>
    <td>-</td>
  </tr>
  <tr>
    <td>width</td>
    <td>同 antd-Modal 的width，模态窗宽度</td>
    <td>number | string | undefined</td>
    <td>'40vw'</td>
  </tr>
  <tr>
    <td>height</td>
    <td>模态窗 <b>content</b> 区域的高度，超出 scroll</td>
    <td><div style="white-space:nowrap;">number | string | undefined</div></td>
    <td>'45vh'</td>
  </tr>
  <tr>
    <td>title</td>
    <td>模态窗标题</td>
    <td>ReactNode</td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">onSuccess</div></td>
    <td>确定按钮回调</td>
    <td>()=>void</td>
    <td>-</td>
  </tr>
   <tr>
    <td>onCancel</td>
    <td>取消按钮回调</td>
    <td>()=>void</td>
    <td>-</td>
  </tr>
   <tr>
    <td>disabled</td>
    <td>表单是否不可编辑</td>
    <td>boolean</td>
    <td>false</td>
  </tr>

</table>

---
toc: content
---

# PageContainer

使用`js对象`或者`json数据`对页面的内容和布局进行描述，进而渲染出完整页面；
目前已有`Form`、`TableWithForm`、`StepsForm`、`Detail`、`Tabs`、`Chart`、`CustomCard`等几种`可配置 Card`，可以使用 [antd-layout](https://4x.ant.design/components/layout-cn/) 或 [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout) 对已有 Card 进行布局。

## 单个表单表格卡片

表单表格卡片`cardType` 为 `"form-table"`

```jsx
import { PageContainer } from "@iauto/components";
const initData = {
  cards: {
    layout: {
      type: "antd",
      value: [{ span: 24 }],
    },
    values: [
      {
        cardType: "form-table",
        component: {
          url: "https://randomuser.me/api?pagination[total]=200&results=10",
          path: "results",
          pagePath: "pageable",
          value: {
            dataSource: [],
            formConfig: {
              schema: {
                type: "object",
                properties: {
                  name: {
                    title: "名称",
                    type: "string",
                    props: {
                      allowClear: true,
                    },
                  },
                  priority: {
                    labelWidth: 80,
                    title: "优先级",
                    type: "number",
                    enum: [2, 1, 0],
                    enumNames: ["高", "中", "低"],
                    props: {
                      allowClear: true,
                    },
                  },
                },
                column: 2,
                labelWidth: 50,
                displayType: "row",
              },
            },
            tableConfig: {
              operate: {
                mode: "text",
                buttons: [
                  {
                    type: "detail",
                    text: "查看",
                    routerPath: "/strategy/strategyManage/detail",
                    field: "id",
                  },
                  {
                    type: "edit",
                    text: "编辑",
                    routerPath: "/strategy/strategyManage/edit",
                    field: "id",
                    condition: "[0,3].includes(row.status)",
                  },
                  {
                    type: "delete",
                    text: "删除",
                    url: "/strategy-ms/v2/admin/strategy/{id}",
                    field: "id",
                  },
                ],
              },
              columns: [
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
              ],
            },
          },
        },
      },
    ],
  },
};
export default () => <PageContainer data={initData} />;
```

## 单个表单卡片

表单卡片`cardType` 为 `"detail"`

```jsx
import { PageContainer } from "@iauto/components";
const initData = {
  cards: {
    layout: {
      type: "antd",
      value: [{ span: 24 }],
    },
    values: [
      {
        cardType: "form",
        component: {
          url: "/strategy-ms/v2/admin/strategy/{id}:edit",
          method: "put",
          field: "id",
          path: "data",
          value: {
            detailUrl: "/strategy-ms/v2/admin/strategy/{id}",
            schema: {
              type: "object",
              properties: {
                name: {
                  title: "策略名称",
                  type: "string",
                  required: true,
                },
                version: {
                  title: "策略版本",
                  type: "string",
                  required: true,
                },
                description: {
                  title: "描述信息",
                  type: "string",
                  format: "textarea",
                  required: true,
                  max: 500,
                  props: {
                    showCount: true,
                    maxLength: 500,
                    style: {
                      width: "100%",
                    },
                  },
                },
                uploadType: {
                  title: "上传方式",
                  type: "number",
                  enum: [0, 1, 2],
                  enumNames: ["实时上传", "条件上传", "立即上传"],
                  required: true,
                },
                upload: {
                  title: "上传配置",
                  type: "object",
                  properties: {
                    interval: {
                      hidden: "{{formData.uploadType === 0}}",
                      required: true,
                      title: "间隔时间",
                      type: "number",
                      default: 10000,
                      min: 10000,
                      max: 500000,
                      props: {
                        addonAfter: "ms",
                      },
                    },
                    maxSize: {
                      title: "最大存储",
                      type: "number",
                      props: {
                        addonAfter: "KB",
                      },
                    },
                    condition: {
                      type: "string",
                      title: "触发条件",
                      widget: "CodeEditor",
                    },
                    partition: {
                      title: "分片大小",
                      type: "number",
                      props: {
                        addonAfter: "KB",
                      },
                    },
                  },
                },
              },
              column: 1,
              labelWidth: 100,
              displayType: "row",
            },
          },
        },
      },
    ],
  },
};
export default () => <PageContainer data={initData} />;
```

## 单个多步骤表单卡片

多步骤表单卡片`cardType` 为 `"form"`

```jsx
import { PageContainer } from "@iauto/components";
const initData = {
  cards: {
    layout: {
      type: "antd",
      value: [{ span: 24 }],
    },
    values: [
      {
        cardType: "steps-form",
        component: {
          url: "/strategy-ms/v2/admin/strategy/{id}:edit",
          method: "put",
          field: "id",
          path: "data",
          value: {
            widgets: { StrategyScopes: "strategyScopes" },
            detailUrl: "/strategy-ms/v2/admin/strategy/{id}",
            schemas: [
              {
                type: "object",
                properties: {
                  name: {
                    title: "策略名称",
                    type: "string",
                    required: true,
                  },
                  version: {
                    title: "策略版本",
                    type: "string",
                    required: true,
                  },
                  description: {
                    title: "描述信息",
                    type: "string",
                    format: "textarea",
                    required: true,
                    max: 500,
                    props: {
                      showCount: true,
                      maxLength: 500,
                      style: {
                        width: "100%",
                      },
                    },
                  },
                },
                column: 1,
                labelWidth: 100,
                displayType: "row",
              },
              {
                type: "object",
                properties: {
                  uploadType: {
                    title: "上传方式",
                    type: "number",
                    enum: [0, 1, 2],
                    enumNames: ["实时上传", "条件上传", "立即上传"],
                    required: true,
                  },
                  upload: {
                    title: "上传配置",
                    type: "object",
                    properties: {
                      interval: {
                        hidden: "{{formData.uploadType === 0}}",
                        required: true,
                        title: "间隔时间",
                        type: "number",
                        default: 10000,
                        min: 10000,
                        max: 500000,
                        props: {
                          addonAfter: "ms",
                        },
                      },
                      maxSize: {
                        title: "最大存储",
                        type: "number",
                        props: {
                          addonAfter: "KB",
                        },
                      },
                      condition: {
                        type: "string",
                        title: "触发条件",
                        widget: "CodeEditor",
                      },
                      partition: {
                        title: "分片大小",
                        type: "number",
                        props: {
                          addonAfter: "KB",
                        },
                      },
                    },
                  },
                },
                column: 1,
                labelWidth: 100,
                displayType: "row",
              },
            ],
          },
        },
      },
    ],
  },
};
export default () => <PageContainer data={initData} />;
```

## 单个详情卡片

详情卡片`cardType` 为 `"form"`

```jsx
import { PageContainer } from "@iauto/components";
const initData = {
  cards: {
    layout: {
      type: "antd",
      value: [{ span: 24 }],
    },
    values: [
      {
        cardType: "detail",
        component: {
          url:
            "https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1",
          path: "info",
          field: "",
          value: {
            init(formData) {},
            tableConfig: {},
            dataSource: {},
            names: {
              page: "页面信息",
              results: "结果信息",
              seed: "来源",
              version: "版本",
            },
            enums: {
              // status: StatusEnum,
              // triggerType: triggerTypeEnum,
              // uploadType: uploadTypeEnum,
              // type: storageTypeEnum,
            },
            objectConfig: {},
          },
        },
      },
    ],
  },
};
export default () => <PageContainer data={initData} />;
```

## 单个 Tabs 卡片

Tabs 卡片`cardType` 为 `"tabs"`

```jsx
import { PageContainer } from "@iauto/components";
const initData = {
  cards: {
    layout: {
      type: "antd",
      value: [{ span: 24 }],
    },
    values: [
      {
        cardType: "tabs",
        component: {
          value: [
            {
              cardType: "form-table",
              title: "form-table-card",
              component: {
                url:
                  "https://randomuser.me/api?pagination[total]=200&results=10",
                path: "results",
                pagePath: "pageable",
                value: {
                  dataSource: [],
                  formConfig: {
                    schema: {
                      type: "object",
                      properties: {
                        name: {
                          title: "名称",
                          type: "string",
                          props: {
                            allowClear: true,
                          },
                        },
                        priority: {
                          labelWidth: 80,
                          title: "优先级",
                          type: "number",
                          enum: [2, 1, 0],
                          enumNames: ["高", "中", "低"],
                          props: {
                            allowClear: true,
                          },
                        },
                      },
                      column: 2,
                      labelWidth: 50,
                      displayType: "row",
                    },
                  },
                  tableConfig: {
                    operate: {
                      mode: "text",
                      buttons: [
                        {
                          type: "detail",
                          text: "查看",
                          routerPath: "/strategy/strategyManage/detail",
                          field: "id",
                        },
                        {
                          type: "edit",
                          text: "编辑",
                          routerPath: "/strategy/strategyManage/edit",
                          field: "id",
                          condition: "[0,3].includes(row.status)",
                        },
                        {
                          type: "delete",
                          text: "删除",
                          url: "/strategy-ms/v2/admin/strategy/{id}",
                          field: "id",
                        },
                      ],
                    },
                    columns: [
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
                    ],
                  },
                },
              },
            },
            {
              cardType: "detail",
              title: "detail-card",
              component: {
                url:
                  "https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1",
                path: "info",
                field: "",
                value: {
                  init(formData) {},
                  tableConfig: {},
                  dataSource: {},
                  names: {
                    page: "页面信息",
                    results: "结果信息",
                    seed: "来源",
                    version: "版本",
                  },
                  enums: {
                    // status: StatusEnum,
                    // triggerType: triggerTypeEnum,
                    // uploadType: uploadTypeEnum,
                    // type: storageTypeEnum,
                  },
                  objectConfig: {},
                },
              },
            },
          ],
        },
      },
    ],
  },
};
export default () => <PageContainer data={initData} />;
```

## 多图表卡片

图表卡片 `cardType` 为 `"form"`

```jsx
import { PageContainer } from "@iauto/components";
const initData = {
  cards: {
    layout: {
      type: "rgl",
      value: [
        { w: 15, h: 13, x: 0, y: 0 },
        { w: 8, h: 9, x: 16, y: 0, static: true },
        { w: 15, h: 4, x: 0, y: 13, static: true },
        { w: 8, h: 8, x: 16, y: 9, static: true },
        { w: 7.5, h: 6, x: 0, y: 17, static: true },
        { w: 7.5, h: 6, x: 8, y: 17, static: true },
        { w: 8, h: 6, x: 16, y: 17, static: true },
      ],
    },
    values: [
      {
        cardType: "chart",
        component: {
          value: {
            option: {
              grid: { width: "90%", height: "88%" },
              xAxis: {
                type: "category",
                boundaryGap: false,
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  data: [820, 932, 901, 934, 1290, 1330, 1320],
                  type: "line",
                  areaStyle: {},
                },
              ],
            },
          },
        },
      },
      {
        cardType: "chart",
        component: {
          value: {
            option: {
              grid: { width: "90%", height: "80%" },
              xAxis: {},
              yAxis: {},
              series: [
                {
                  data: [
                    [10, 40],
                    [50, 100],
                    [40, 20],
                  ],
                  type: "line",
                },
              ],
            },
          },
        },
      },
      {
        cardType: "chart",
        component: {
          value: {
            option: {
              grid: { width: "90%", height: "60%" },
              xAxis: {
                type: "category",
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  data: [120, 200, 150, 80, 70, 110, 130],
                  type: "bar",
                  showBackground: true,
                  backgroundStyle: {
                    color: "rgba(180, 180, 180, 0.2)",
                  },
                },
              ],
            },
          },
        },
      },
      {
        cardType: "chart",
        component: {
          value: {
            option: {
              grid: { width: "90%", height: "80%" },
              xAxis: {
                type: "category",
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  data: [150, 230, 224, 218, 135, 147, 260],
                  type: "line",
                },
              ],
            },
          },
        },
      },
      {
        cardType: "chart",
        component: {
          value: {
            option: {
              grid: { width: "90%", height: "75%" },
              xAxis: {
                type: "category",
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  data: [150, 230, 224, 218, 135, 147, 260],
                  type: "line",
                },
              ],
            },
          },
        },
      },
      {
        cardType: "chart",
        component: {
          value: {
            option: {
              xAxis: {},
              yAxis: {},
              grid: { width: "90%", height: "75%" },
              series: [
                {
                  symbolSize: 20,
                  data: [
                    [10.0, 8.04],
                    [8.07, 6.95],
                    [13.0, 7.58],
                    [9.05, 8.81],
                    [11.0, 8.33],
                    [14.0, 7.66],
                    [13.4, 6.81],
                    [10.0, 6.33],
                    [14.0, 8.96],
                    [12.5, 6.82],
                    [9.15, 7.2],
                    [11.5, 7.2],
                    [3.03, 4.23],
                    [12.2, 7.83],
                    [2.02, 4.47],
                    [1.05, 3.33],
                    [4.05, 4.96],
                    [6.03, 7.24],
                    [12.0, 6.26],
                    [12.0, 8.84],
                    [7.08, 5.82],
                    [5.02, 5.68],
                  ],
                  type: "scatter",
                },
              ],
            },
          },
        },
      },
      {
        cardType: "chart",
        component: {
          value: {
            option: {
              grid: { width: "90%", height: "75%" },
              radar: {
                indicator: [
                  { name: "Sales", max: 6500 },
                  { name: "Administration", max: 16000 },
                  { name: "Information Technology", max: 30000 },
                  { name: "Customer Support", max: 38000 },
                  { name: "Development", max: 52000 },
                  { name: "Marketing", max: 25000 },
                ],
              },
              series: [
                {
                  name: "Budget vs spending",
                  type: "radar",
                  data: [
                    {
                      value: [4200, 3000, 20000, 35000, 50000, 18000],
                      name: "Allocated Budget",
                    },
                    {
                      value: [5000, 14000, 28000, 26000, 42000, 21000],
                      name: "Actual Spending",
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    ],
  },
};
export default () => <PageContainer data={initData} />;
```

### 基本参数

| 参数     | 说明                                   |
| -------- | -------------------------------------- |
| pageData | 全局共享数据源（功能存在误删，待找回） |
| cards    | 页面组合的卡片信息                     |

#### cards 参数

| 参数   | 说明                                                                                                                                                                                                                 |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| layout | 两个值 type 和 value，type 可填 antd 和 rgl，对应的 value 分别是 [antd](https://4x.ant.design/components/grid-cn/) 的栅格配置和[react-grid-layout](https://github.com/react-grid-layout/react-grid-layout)的布局配置 |
| values | 页面组合的每个卡片信息                                                                                                                                                                                               |

##### values 参数

| 参数      | 说明                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cardType  | 卡片类型，提供 form-table（表单+表格组合）、form（表单）、steps-form（分步式表单），video（视频播放），falls-list（瀑布式列表），tabs（多标签页，嵌入 values 参数渲染卡片即可），detail（详情页）等                                                                                                                                                                                                            |
| min       | 最小化卡片按钮功能                                                                                                                                                                                                                                                                                                                                                                                             |
| max       | 最大化卡片按钮功能                                                                                                                                                                                                                                                                                                                                                                                             |
| close     | 关闭卡片按钮功能                                                                                                                                                                                                                                                                                                                                                                                               |
| border    | 卡片边框宽度                                                                                                                                                                                                                                                                                                                                                                                                   |
| component | 卡片主要配置项，不同的卡片的类型的 component 的 url、path、method 和 pagepath 是 common 的（需要的话）。</br>但 value 配置项依据于不同的 cardType 值是不同的，例如 cardType 为 form-table 的卡片中，value 需要提供 formConfig 和 tableConfig 分别对应表单信息和表格信息，formConfig 包括了表单栏的按钮信息和 表单的schema 信息，tableConfig 需要 operate 和 columns |

##### 以form-table类型的card为例：

```
import { FORMAT_DATETIME } from "@/utils/constant";
const ActivateStatusEnum = { 0: "激活", 1: "未激活" };

// 实名认证状态 0-未实名 1-实名
export default {
  pageData: {},
  cards: {
    layout: [{ w: 24, h: 13, x: 0, y: 0 }],
    values: [
      {
        cardType: "form-table",
        min: false,
        max: false,
        close: false,
        border: 1,
        component: {
          url: "/vehicle-ms/v1/vehicle",
          path: "data",
          pagePath: "pageable",
          value: {
            dataSource: [],
            formConfig: {
              addBtn: {
                text: "添加车辆",
                // routerPath: "/demo",
                url: "/vehicle-ms/v1/vehicle", //post
                schema: {
                  type: "object",
                  properties: {
                    carTypeId: {
                      title: "车型",
                      type: "number",
                      format: "select",
                      required: true,
                      treeData: {
                        url: "/vehicle-model-ms/v1/brand/model/_list",
                        path: "data",
                        labelFeild: "brandCarType",
                        valueFeild: "carTypeId",
                      },
                      props: {
                        allowClear: true,
                      },
                    },
                    vin: {
                      title: "vin",
                      type: "string",
                      required: true,
                      rules: [
                        {
                          pattern: "^[0-9a-zA-Z]{17}$",
                          message: "vin码必须是17位的数字或英文",
                        },
                      ],
                    },
                  },
                  column: 1,
                  labelWidth: 150,
                  displayType: "row",
                },
              },
              schema: {
                type: "object",
                properties: {
                  keyword: {
                    title: "",
                    type: "string",
                    width: "30%",
                    labelWidth: 0.1,
                    props: {
                      placeholder: "请输入关键字搜索",
                      allowClear: true,
                    },
                  },
                },
              },
            },
            tableConfig: {
              operate: {
                mode: "text",
                buttons: [
                  {
                    type: "edit",
                    text: "编辑",
                    detailUrl: "/vehicle-ms/v1/vehicle/{id}",
                    saveUrl: "/vehicle-ms/v1/vehicle",
                    field: "id",
                    schema: {
                      type: "object",
                      properties: {
                        carTypeId: {
                          title: "车型",
                          type: "number",
                          format: "select",
                          required: true,
                          disabled: true,
                          treeData: {
                            url: "/vehicle-model-ms/v1/brand/model/_list",
                            path: "data",
                            labelFeild: "brandCarType",
                            valueFeild: "carTypeId",
                          },
                          props: {
                            allowClear: true,
                          },
                        },
                        
                        verifiedStatus: {
                          title: "实名认证状态",
                          enum: [0, 1],
                          enumNames: ["未实名", "实名"],
                          widget: "radio",
                          type: "number",
                        },
                      },
                      column: 1,
                      labelWidth: 150,
                      displayType: "row",
                    },
                  },
                  {
                    type: "delete",
                    text: "删除",
                    url: "/vehicle-ms/v1/vehicle/{id}",
                    field: "id",
                  }
                ],
              },
              columns: [
                {
                  title: "品牌名",
                  dataIndex: "brandName",
                },
                {
                  title: "车型名",
                  dataIndex: "carTypeName",
                },
                {
                  title: "车辆vin码	",
                  dataIndex: "vin",
                },
                {
                  title: "激活状态",
                  dataIndex: "activateStatus",
                  render: (text) => ActivateStatusEnum[text],
                },
                {
                  title: "激活时间",
                  dataIndex: "activateTime",
                  format: FORMAT_DATETIME,
                },
              ],
            },
          },
        },
      },
    ],
  },
};

```

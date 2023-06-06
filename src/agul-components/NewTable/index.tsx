/**
 * @author: hujunlei
 * @desc: 此组件在antd-table基础上集成一些常用功能进行了二次封装，只需传入url、path等必要参数即可实现整个table业务。主要功能有：分页、排序、文本超出省略号、hover显示、checked（开发者在外部需要使用ref来获取checked数据）、定制化操作栏等。
 * @params data:固定数据,url:请求地址 columns:antd表格配置项  path:数据在服务器出参中的路径   pagePath:分页数据在服务器出参中的路径 rowSelect:是否可以check选择数据  params请求参数(get请求) operate:最右侧操作栏,needOrder:是否需要编号列,childTable:子表格字段名
 */
import { FC, Ref, CSSProperties } from "react";
import { createPortal } from "react-dom";
import {
  useEffect,
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useContext,
  createElement,
} from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Checkbox,
  Divider,
  message,
  Input,
  Select,
  Button,
  Modal,
  Space,
  Row,
  Col,
  DatePicker,
} from "antd";
import Message from "@/agul-methods/Message";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import type { PaginationProps } from "antd";
import { useDeepCompareEffect, useUpdateEffect } from "ahooks";
import ModalWithForm from "@/agul-components/ModalWithForm";
import ModalDetail from "@/agul-components/ModalDetail";
import ModalVideo from "@/agul-components/ModalVideo";
import ModalFileParse from "@/agul-components/ModalFileParse";
import { timeUtcOffect } from "@/agul-utils/utils";
import request from "@/agul-utils/request";
import { WidgetsContext, AgulWrapperConfigContext } from "@/agul-utils/context";
import moment from "moment";
import EmptyImg from "../../agul-assets/imgs/empty.png";
import { filterFormData, isObject } from "@/agul-utils/utils";
const ButtonStyle: CSSProperties = {
  display: "inline-block",
  textAlign: "center",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  minWidth: 30,
};
const NoneButtonStyle: CSSProperties = {
  padding: "0 10px",
  display: "inline-block",
  minWidth: 30,
  textAlign: "center",
};
const ButtonBoxStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
};
const PAGE_SIZE_OPTIONS = [8, 16, 40, 80];
const showTotal = (total: number, range: [number, number]) => `共${total}条`;
const DefaultTagStyle: CSSProperties = {
  lineHeight: "22px",
  borderRadius: 12,
  width: "fit-content",
  border: "2px solid #e7e7e7",
  padding: "0 10px",
};
const ProcessTagStyle: CSSProperties = {
  lineHeight: "22px",
  borderRadius: 12,
  width: "fit-content",
  border: "2px solid #e7e7e7",
  padding: "0 10px",
  color: "#19b98d",
};
const SuccessTagStyle: CSSProperties = {
  lineHeight: "22px",
  borderRadius: 12,
  backgroundColor: "#17b88c",
  color: "#fff",
  width: "fit-content",
  padding: "0 10px",
};
const ErrorTagStyle: CSSProperties = {
  lineHeight: "22px",
  borderRadius: 12,
  color: "#e60012",
  width: "fit-content",
  border: "2px solid #e7e7e7",
  padding: "0 10px",
};
const getTag = (val: any, enums: any, tagType: any): any => {
  if (isObject(tagType)) {
    return getTag(val, enums, tagType[val]);
  } else if (_.isString(tagType)) {
    switch (tagType) {
      case "default":
        return _.isNil(val) ? (
          "-"
        ) : (
          <div style={DefaultTagStyle}>
            {isObject(enums) ? enums[val] : val}
          </div>
        );
      case "success":
        return _.isNil(val) ? (
          "-"
        ) : (
          <div style={SuccessTagStyle}>
            {isObject(enums) ? enums[val] : val}
          </div>
        );
      case "process":
        return _.isNil(val) ? (
          "-"
        ) : (
          <div style={ProcessTagStyle}>
            {isObject(enums) ? enums[val] : val}
          </div>
        );
      case "error":
        return _.isNil(val) ? (
          "-"
        ) : (
          <div style={ErrorTagStyle}>{isObject(enums) ? enums[val] : val}</div>
        );
      default:
        return _.isNil(val) ? "-" : val;
    }
  } else {
    return _.isNil(val) ? "-" : val;
  }
};
const BoxId = "agul_new_table_operate_and_export_btn_box";
const BoxStyle: CSSProperties = {
  position: "absolute",
  margin: 0,
  top: -45,
  right: 0,
};
const { RangePicker } = DatePicker;
type Params = Record<string, any>;
interface Operate {
  mode?: "icon" | "text";
  buttons: any[];
}
const footerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
};
const evil = (data: any, strFn: string) => {
  const Fn = Function;
  return new Fn("row", "return " + strFn)(data);
};
const RegOfUrl = /\{.*\}/g;
const DefaultMsgConfig = {
  open: false,
  onOk() {},
  onCancel() {},
  msg: "",
};

const SortEnum: any = {
  descend: "desc",
  ascend: "asc",
};
const CommonColorStyle: any = {
  color: "#00b4e1",
};

const DefaultPage: any = {
  showSizeChanger: true,
  showQuickJumper: true,
  position: ["bottomRight"],
  showTotal,
  current: 1,
  pageSize: 8,
  total: 0,
  locale: {
    jump_to: "前往",
  },
  pageSizeOptions: PAGE_SIZE_OPTIONS,
};
const DefaultModalConfig = {
  title: "",
  open: false,
  onSuccess: () => {},
  onCancel: () => {},
  readonly: false,
  schema: {},
  formData: {},
  widgets: {},
};
const DefaultDetailConfig = {
  title: "",
  open: false,
  onSuccess: () => {},
  onCancel: () => {},
  data: {},
};
const DefaultVideoConfig = {
  title: "",
  open: false,
  onSuccess: () => {},
  onCancel: () => {},
  data: {},
};
const DefaultFileConfig = {
  title: "",
  open: false,
  onSuccess: () => {},
  onCancel: () => {},
  data: {},
};
const NewTable: FC<{
  url: string;
  path?: string;
  pagePath?: string;
  params?: Params;
  method?: "get" | "post";
  columns: any[];
  rowSelect?: boolean;
  operate?: Operate;
  forwordRef?: Ref<unknown>;
  needOrder?: boolean;
  childTable?: any;
  height?: number;
  rowKey?: string;
  rowConfig?: any;
  tableOperateBoxId?: string;
  exportBtn?: any;
  tableExportBoxId?: string;
  extraPagination?: PaginationProps;
}> = (props) => {
  const {
    url = "",
    method = "get",
    path = "data",
    pagePath = "pageable",
    params,
    columns = [],
    rowSelect = false,
    operate,
    forwordRef = null,
    needOrder = false,
    childTable = "",
    height,
    rowKey = "id",
    exportBtn,
    tableExportBoxId,
    rowConfig,
    tableOperateBoxId,
    extraPagination,
    ...otherProps
  } = props;
  const Wrapper = useContext(AgulWrapperConfigContext) as any;
  const requestHeaders = _.get(Wrapper, "requestHeaders", {}) || {};
  const getCurrentIcon = (item: any, callback: any) => {
    const commonProps = {
      style: CommonColorStyle,
      onClick: callback,
      ...item?.props,
    };
    switch (item?.type) {
      case "add":
        return <PlusOutlined {...commonProps} />;
      case "edit":
        return <EditOutlined {...commonProps} />;
      case "detail":
        return <SearchOutlined {...commonProps} />;
      case "delete":
        return <DeleteOutlined {...commonProps} />;
      case "download":
        return <DownloadOutlined {...commonProps} />;
      case "play":
        return <PlayCircleOutlined {...commonProps} />;
      case "file":
        return <SearchOutlined {...commonProps} />;
      default:
        return null;
    }
  };
  // 自定义列表单项信息
  const [customFilterValues, setCustomFilterValues] = useState<any>({});
  // 请求额外参数
  const [currentParams, setCurrentParams] = useState<Params | undefined>(
    params
  );
  useEffect(() => {
    setCurrentParams({ ...params, ...customFilterValues });
  }, [params]);
  // 表单弹窗
  const [modalConfig, setModalConfig] = useState<any>(DefaultModalConfig);
  // detail弹窗
  const [detailConfig, setDetailConfig] = useState<any>(DefaultDetailConfig);
  // 数据源
  const [currentData, setCurrentData] = useState<any>([]);
  // 表单引用（校验）
  const formRef = useRef<any>();
  const [pagination, setPagination] = useState({
    ...DefaultPage,
    ...extraPagination,
  });
  const paginationRef = useRef<any>({
    ...DefaultPage,
    ...extraPagination,
  });
  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);
  // 数据请求
  const sortValue = useRef<string>("");
  const getData = (page: any, paramsValue: any) => {
    if (!url) {
      console.warn("请给NewTable组件正确的url属性");
      return;
    }
    const { pageSize, current } = page;
    filterFormData(paramsValue);
    const currentParams = {
      ...paramsValue,
      pageSize,
      pageNumber: current,
    };
    if (sortValue.current) {
      _.set(currentParams, "sort", sortValue.current);
    }
    const params =
      method === "get"
        ? {
            params: currentParams,
          }
        : {
            data: currentParams,
          };

    request(url, {
      method,
      ...params,
      headers: { ...requestHeaders },
    })
      .then((res: any) => {
        if (needOrder) {
          setCurrentData(
            _.map(_.get(res, path, []), (item, index) => ({
              ...item,
              $order: index + 1 + (current - 1) * pageSize,
            }))
          );
        } else {
          setCurrentData(_.get(res, path, []));
        }
        setPagination((state: any) => ({
          ...state,
          pageSize: _.get(res, [pagePath, "pageSize"], 8),
          current: _.get(res, [pagePath, "pageNumber"], 1),
          total: _.get(res, [pagePath, "total"], 0),
        }));
      })
      .catch((err) => {
        console.error(err.message);
        setCurrentData([]);
        setPagination(DefaultPage);
      });
  };
  // params发生变更则立即刷新并重置页码以及排序信息
  useUpdateEffect(() => {
    getData(DefaultPage, currentParams);
    setPagination(DefaultPage);
  }, [currentParams, url]);
  // 分页逻辑

  const onChange = (page: any, filters: any, sorter: any) => {
    let sort = "";
    if (_.isArray(sorter)) {
      _.forEach(sorter, (item) => {
        sort += `${_.get(item, "field")}:${SortEnum[_.get(item, "order")]};`;
      });
    } else if (_.get(sorter, "order")) {
      sort = `${_.get(sorter, "field")}:${SortEnum[_.get(sorter, "order")]};`;
    }
    sortValue.current = sort;
    getData(page, currentParams);
  };
  // 维护checked的数据源及其变更
  const [allChecked, setAllChecked] = useState(false);
  useEffect(() => {
    const chekedAll = _.every(
      currentData,
      (item) => item.checked || !item.checked
    );
    if (chekedAll) {
      setAllChecked(_.get(currentData, [0, "checked"]));
    }
  }, [currentData]);
  const changeChecked = (sort: any, checked: any) => {
    setCurrentData((state: any) => {
      const newState = state.map((item: any, index: number) => {
        if (index === sort) {
          return { ...item, checked };
        }
        return item;
      });
      return newState;
    });
  };
  const allChangeChecked = ({
    target: { checked },
  }: {
    target: { checked: boolean };
  }) => {
    setAllChecked(checked);
    setCurrentData((state: any) => {
      const newState = state.map((item: any) => {
        return { ...item, checked };
      });
      return newState;
    });
  };

  const navigate = useNavigate();
  const toAdd = (operate: any, row: any) => {
    if (typeof row !== "object") {
      row = {};
    }
    if (operate?.routerPath) {
      const url = operate?.field
        ? `${operate?.routerPath}?${operate?.field}=${_.get(
            row,
            operate?.field
          )}`
        : operate?.routerPath;
      navigate(url);
      return;
    }
    const callback = () => {
      formRef?.current
        ?.validate()
        .then((res: any) => {
          if (!res?.errors || !res?.errors?.length) {
            const url = operate?.url!.replaceAll(
              RegOfUrl,
              _.get(row, operate?.field)
            );
            const reqData = {
              headers: { ...requestHeaders },
              method: operate?.method || "post",
            };
            if (["put", "post"].includes(operate?.method) || !operate?.method) {
              _.set(reqData, "data", res);
              if (!RegOfUrl.test(operate?.url) && operate?.field) {
                _.set(
                  reqData,
                  `data.${operate?.field}`,
                  _.get(row, operate?.field)
                );
              }
            }
            request(url as string, reqData)
              .then(() => {
                Message.success({
                  title: "操作成功",
                });
                setModalConfig(DefaultModalConfig);
                getData(paginationRef.current, currentParams);
              })
              .catch((err) => {
                console.error(err.message);
              });
          }
        })
        .catch((err: any) => {});
    };
    setModalConfig({
      title: operate?.text,
      open: true,
      onSuccess: callback,
      onCancel: () => setModalConfig(DefaultModalConfig),
      readonly: false,
      schema: operate?.schema,
      widgets: operate?.widgets,
    });
  };
  const toEdit = (operate: any, row: any) => {
    if (typeof row !== "object") {
      row = {};
    }
    if (operate?.routerPath) {
      const url = operate?.field
        ? `${operate?.routerPath}?${operate?.field}=${_.get(
            row,
            operate?.field
          )}`
        : operate?.routerPath;
      navigate(url);
      return;
    }
    const callback = () => {
      formRef?.current
        ?.validate()
        .then((res: any) => {
          if (!res?.errors || !res?.errors?.length) {
            const currentUrl = operate?.url!.replaceAll(
              RegOfUrl,
              _.get(row, operate?.field)
            );
            const reqData = {
              headers: { ...requestHeaders },
              method: operate?.method || "put",
            };
            if (["put", "post"].includes(operate?.method) || !operate?.method) {
              _.set(reqData, "data", res);
              if (!RegOfUrl.test(operate?.url) && operate?.field) {
                _.set(
                  reqData,
                  `data.${operate?.field}`,
                  _.get(row, operate?.field)
                );
              }
            }
            request(currentUrl, reqData)
              .then(() => {
                Message.success({
                  title: "操作成功",
                });
                setModalConfig(DefaultModalConfig);
                getData(paginationRef.current, currentParams);
              })
              .catch((err) => {
                console.error(err.message);
              });
          }
        })
        .catch((err: any) => {});
    };
    if (operate?.detailUrl) {
      const detailUrl = operate?.detailUrl!.replaceAll(
        RegOfUrl,
        _.get(row, operate?.field)
      );
      const reqData = {
        headers: { ...requestHeaders },
        method: operate?.detailMethod || "get",
      };
      if (
        ["put", "post"].includes(operate?.detailMethod) &&
        !RegOfUrl.test(operate?.detailUrl) &&
        operate?.field
      ) {
        _.set(reqData, "data", {
          [operate?.field]: _.get(row, operate?.field),
        });
      }
      request(detailUrl as string, reqData)
        .then((res) => {
          let data = _.get(res, operate?.path || "data");
          if (!data) {
            data = {};
          }
          setModalConfig({
            title: operate?.text,
            open: true,
            onSuccess: callback,
            onCancel: () => setModalConfig(DefaultModalConfig),
            readonly: false,
            schema: operate?.schema,
            widgets: operate?.widgets,
            formData: data,
          });
        })
        .catch((err) => {
          console.error(err.message);
        });
    } else {
      setModalConfig({
        title: operate?.text,
        open: true,
        onSuccess: callback,
        onCancel: () => setModalConfig(DefaultModalConfig),
        readonly: false,
        schema: operate?.schema,
        widgets: operate?.widgets,
        formData: row,
      });
    }
  };
  const toShow = (operate: any, row: any) => {
    if (typeof row !== "object") {
      row = {};
    }
    if (operate?.routerPath) {
      const url = operate?.field
        ? `${operate?.routerPath}?${operate?.field}=${_.get(
            row,
            operate?.field
          )}`
        : operate?.routerPath;
      navigate(url);
      return;
    }
    if (operate?.url) {
      const detailUrl = operate?.field
        ? operate?.url!.replaceAll(RegOfUrl, _.get(row, operate?.field))
        : operate?.url;
      const reqData = {
        headers: { ...requestHeaders },
        method: operate?.method || "get",
      };
      if (
        ["put", "post"].includes(operate?.method) &&
        !RegOfUrl.test(operate?.url) &&
        operate?.field
      ) {
        _.set(reqData, "data", {
          [operate?.field]: _.get(row, operate?.field),
        });
      }
      request(detailUrl, reqData)
        .then((res: any) => {
          setDetailConfig({
            title: operate?.text,
            open: true,
            onSuccess: () => setDetailConfig(DefaultDetailConfig),
            onCancel: () => setDetailConfig(DefaultDetailConfig),
            data: {
              ...operate,
              dataSource: _.get(res, operate?.path || "data"),
              url: null,
            },
          });
        })
        .catch((err) => {
          setDetailConfig(DefaultDetailConfig);
          console.error(err.message);
        });
    } else {
      setDetailConfig({
        title: operate?.text,
        open: true,
        onSuccess: () => setDetailConfig(DefaultDetailConfig),
        onCancel: () => setDetailConfig(DefaultDetailConfig),
        data: { ...operate, dataSource: row },
      });
    }
  };
  const [msgModalConfig, setMsgModalConfig] = useState<any>(DefaultMsgConfig);
  const toDelete = (operate: any, row: any) => {
    if (typeof row !== "object") {
      row = {};
    }
    setMsgModalConfig({
      msg: `确定要${operate?.text}该项吗？`,
      open: true,
      onOk() {
        const deleteUrl = operate?.url.replaceAll(
          RegOfUrl,
          _.get(row, operate?.field)
        );
        const reqData = {
          headers: { ...requestHeaders },
          method: operate?.method ? operate?.method : "delete",
        };
        if (
          ["put", "post"].includes(operate?.method) &&
          !RegOfUrl.test(operate?.url) &&
          operate?.field
        ) {
          _.set(reqData, "data", {
            [operate?.field]: _.get(row, operate?.field),
          });
        }
        request(deleteUrl as string, reqData)
          .then(() => {
            Message.success({
              title: "操作成功",
            });
            setMsgModalConfig(DefaultMsgConfig);
            getData(DefaultPage, currentParams);
          })
          .catch((err) => {
            console.error(err.message);
          });
      },
      onCancel: () => setMsgModalConfig(DefaultMsgConfig),
    });
  };
  const toDownload = (operate: any, row: any) => {
    if (typeof row !== "object") {
      row = {};
    }
    let downloadUrl;
    const options: any = {
      headers: {
        ...operate?.headers,
      },
    };
    if (operate?.field) {
      if (operate?.url) {
        downloadUrl = operate?.url.replaceAll(
          RegOfUrl,
          _.get(row, operate?.field)
        );
      } else {
        downloadUrl = _.get(row, operate?.field);
      }
    }
    if (!downloadUrl) {
      message.warn("该资源地址无效!");
      return;
    }
    if (
      operate?.url &&
      !RegOfUrl.test(operate?.url) &&
      ["put", "post"].includes(operate?.method)
    ) {
      options.method = "post";
      options.body = JSON.stringify({
        [operate?.field]: _.get(row, operate?.field),
      });
    }
    let download: string;
    fetch(downloadUrl, options)
      .then((res) => {
        const disposition = res.headers.get("Content-Disposition");
        let str =
          typeof disposition === "string"
            ? disposition.split(";")[1]
            : row?.filename;
        let filename = "";
        if (str) {
          filename = !str.split("fileName=")[1]
            ? str.split("filename=")[1]
            : str.split("fileName=")[1];
        }
        filename = filename ? filename : row?.filename || row?.fileName;
        download = decodeURIComponent(filename);
        return res.blob();
      })
      .then((blob) => {
        if (!download) {
          Message.error({
            title: "下载错误，请联系开发人员！",
          });
          return;
        }
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = download;
        a.target = "_blank";
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };
  // operate逻辑
  const toOperate = (item: any, row: any) => {
    switch (item?.type) {
      case "add":
        toAdd(item, row);
        return;
      case "edit":
        toEdit(item, row);
        return;
      case "detail":
        toShow(item, row);
        return;
      case "delete":
        toDelete(item, row);
        return;
      case "download":
        toDownload(item, row);
        return;
      default:
        return;
    }
  };
  //  嵌套子表格逻辑
  const expandable = useMemo(() => {
    const expandedRowRender = (record: any) => {
      _.forEach(
        _.isArray(childTable?.columns) ? [...childTable?.columns] : [],
        (item) => {
          const { render, format } = item;
          if (format) {
            item.render = render
              ? render
              : (val: any) =>
                  !_.isNil(val) ? timeUtcOffect(val).format(format) : "-";
          }
        }
      );
      return (
        <div style={{ paddingLeft: 70 }}>
          <Table
            dataSource={_.get(record, childTable?.field, [])}
            columns={
              _.isArray(childTable?.columns) ? [...childTable?.columns] : []
            }
            pagination={false}
            size="small"
          />
        </div>
      );
    };
    return {
      expandedRowRender,
      defaultExpandedRowKeys: ["0"],
    };
  }, [childTable]);
  if (childTable) {
    _.forEach(currentData, (item, index) => {
      item.key = index.toString();
    });
  }

  useImperativeHandle(forwordRef, () => exportProps, [currentData, forwordRef]);
  // 自定义列选择框确认回调
  const fitersOnchange = () => {
    setCurrentParams({ ...params, ...customFilterValues });
  };
  // 自定义列的下拉框筛选
  const getColumnsFilterDropdown = (filterProps: any, key: string) => {
    const { type, field, treeData, props } = filterProps;
    const currentField = field || key;
    switch (type) {
      case "input":
        return ({ close }: any) => (
          <div style={{ padding: 12, overflow: "hidden" }}>
            <Input
              allowClear
              style={{ width: 150, display: "flex" }}
              value={customFilterValues[currentField]}
              onChange={(e) =>
                setCustomFilterValues((state: any) => ({
                  ...state,
                  [currentField]: e.target.value,
                }))
              }
              {...props}
            />
            <Button
              type="primary"
              size="small"
              onClick={() => {
                fitersOnchange();
                close();
              }}
              style={{ marginTop: 14, float: "right" }}
            >
              确认
            </Button>
          </div>
        );
      case "select":
        return ({ close }: any) => (
          <div style={{ padding: 12, overflow: "hidden" }}>
            <Select
              allowClear
              style={{ width: 150, display: "block" }}
              value={customFilterValues[currentField]}
              onChange={(value) =>
                setCustomFilterValues((state: any) => ({
                  ...state,
                  [currentField]: value,
                }))
              }
              options={treeData}
              {...props}
            />
            <Button
              type="primary"
              size="small"
              onClick={() => {
                fitersOnchange();
                close();
              }}
              style={{ marginTop: 14, float: "right" }}
            >
              确认
            </Button>
          </div>
        );
      case "checkbox":
        return ({ close }: any) => (
          <div style={{ padding: 12, overflow: "hidden" }}>
            <Checkbox.Group
              style={{ width: 150, display: "block" }}
              options={treeData}
              value={customFilterValues[currentField]}
              onChange={(value) =>
                setCustomFilterValues((state: any) => ({
                  ...state,
                  [currentField]: value,
                }))
              }
              {...props}
            />
            <Button
              type="primary"
              size="small"
              onClick={() => {
                fitersOnchange();
                close();
              }}
              style={{ marginTop: 14, float: "right" }}
            >
              确认
            </Button>
          </div>
        );
      case "dateRange":
        const currentValue =
          customFilterValues[
            _.get(field, [0]) ? _.get(field, [0]) : "startTime"
          ] &&
          customFilterValues[_.get(field, [1]) ? _.get(field, [1]) : "endTime"]
            ? [
                moment(
                  customFilterValues[
                    _.get(field, [0]) ? _.get(field, [0]) : "startTime"
                  ]
                ),
                moment(
                  customFilterValues[
                    _.get(field, [1]) ? _.get(field, [1]) : "endTime"
                  ]
                ),
              ]
            : [];
        return ({ close }: any) => (
          <div style={{ padding: 12, overflow: "hidden" }}>
            <RangePicker
              allowClear
              style={{ display: "flex" }}
              value={currentValue}
              onChange={(date: any, dateStrings: string) => {
                if (_.isEmpty(_.pickBy(dateStrings))) {
                  setCustomFilterValues((state: any) => {
                    delete state[
                      _.get(field, [0]) ? _.get(field, [0]) : "startTime"
                    ];
                    delete state[
                      _.get(field, [1]) ? _.get(field, [1]) : "endTime"
                    ];
                    return { ...state };
                  });
                } else {
                  setCustomFilterValues((state: any) => ({
                    ...state,
                    [_.get(field, [0])
                      ? _.get(field, [0])
                      : "startTime"]: moment(dateStrings[0])
                      .utcOffset(8)
                      .format(),
                    [_.get(field, [1]) ? _.get(field, [1]) : "endTime"]: moment(
                      dateStrings[1]
                    )
                      .utcOffset(8)
                      .format(),
                  }));
                }
              }}
              {...props}
            />
            <Button
              type="primary"
              size="small"
              onClick={() => {
                fitersOnchange();
                close();
              }}
              style={{ marginTop: 14, float: "right" }}
            >
              确认
            </Button>
          </div>
        );
      default:
        return () => (
          <div style={{ padding: 12, overflow: "hidden" }}>
            <Input
              value={customFilterValues[currentField]}
              onChange={(e) =>
                setCustomFilterValues((state: any) => ({
                  ...state,
                  [currentField]: e.target.value,
                }))
              }
            />
            <Button
              type="primary"
              size="small"
              onClick={() => fitersOnchange()}
              style={{ marginTop: 14, float: "right" }}
            >
              确认
            </Button>
          </div>
        );
    }
  };
  // 依据配置项整形columns
  const [rowSelectShow, setRowSelectShow] = useState<boolean>(false);
  const [rowSelectItems, setRowSelectItems] = useState<any>({
    old: _.map(
      _.isArray(columns) ? [...columns] : [],
      (item) => item.dataIndex || item.key
    ),
    new: _.map(
      _.isArray(columns) ? [...columns] : [],
      (item) => item.dataIndex || item.key
    ),
  });
  const onRowConfirm = () => {
    setRowSelectItems((state: any) => ({ ...state, old: state.new || [] }));
    setRowSelectShow(false);
  };
  const onRowCancel = () => {
    setRowSelectItems((state: any) => ({ ...state, new: state.old || [] }));
    setRowSelectShow(false);
  };
  const extraColumnKeys = useMemo(() => {
    return _.map(
      _.filter(rowConfig || [], (item) =>
        _.includes(rowSelectItems.old || [], item?.dataIndex || item?.key)
      ),
      (item) => item.dataIndex || item.key
    );
  }, [rowSelectItems.old]);
  const totalColumns = rowConfig
    ? _.filter(_.isArray(columns) ? [...columns] : [], (item) =>
        _.includes(extraColumnKeys, item?.dataIndex || item?.key)
      )
    : _.isArray(columns)
    ? [...columns]
    : [];
  if (needOrder && !_.some(totalColumns, { dataIndex: "$order" })) {
    totalColumns.unshift({
      title: "编号",
      dataIndex: "$order",
    });
  }
  if (rowSelect && !_.some(totalColumns, { dataIndex: "$rowSelect" })) {
    totalColumns.unshift({
      title: <Checkbox checked={allChecked} onChange={allChangeChecked} />,
      width: 100,
      fixed: "left",
      dataIndex: "$rowSelect",
      render: (text: any, row: any, index: number) => {
        return (
          <Checkbox
            checked={row.checked}
            onChange={({ target: { checked: value } }) =>
              changeChecked(index, value)
            }
          />
        );
      },
    });
  }
  // 父组件通过ref和自定义操作栏按钮可以获取的组件组件属性，这里严格规定为checked的data和立即刷新list的方法
  const exportProps = {
    checkedData: _.filter(currentData, { checked: true }),
    reload: () => {
      // setSorterValue({});
      getData(DefaultPage, currentParams);
    },
    update: () => {
      getData(paginationRef.current, currentParams);
    },
  };

  const Widgets = useContext(WidgetsContext) as any;
  if (operate && !_.some(totalColumns, { dataIndex: "$operate" })) {
    totalColumns.push({
      title: "操作",
      dataIndex: "$operate",
      fixed: "right",
      width:
        operate?.mode === "icon"
          ? _.get(operate, "buttons.length", 0) * 20
          : _.reduce(
              _.get(operate, "buttons"),
              (sum, n) =>
                sum +
                (_.get(n, "text.length") ? _.get(n, "text.length") * 14 : 60) +
                16,
              0
            ) + 32,

      render: (text: any, row: any) => {
        const currentButtons = operate?.buttons || [];
        return row ? (
          <div style={ButtonBoxStyle} className="agul-newtable-operate-box">
            {_.map(currentButtons, (item, index) => {
              return (
                <>
                  {item?.condition && !evil(row, item.condition) ? (
                    <a style={NoneButtonStyle}>-</a>
                  ) : item?.type === "custom" ? (
                    typeof item?.widget === "string" ? (
                      Widgets && Widgets[item?.widget] ? (
                        createElement(Widgets[item?.widget], {
                          ...exportProps,
                          row,
                        })
                      ) : (
                        item?.widget
                      )
                    ) : typeof item?.widget === "function" ? (
                      createElement(item?.widget, {
                        ...exportProps,
                        row,
                      })
                    ) : null
                  ) : operate?.mode === "icon" ? (
                    getCurrentIcon(
                      item,
                      _.debounce(() => toOperate(item, row), 200)
                    )
                  ) : (
                    <a
                      onClick={_.debounce(() => toOperate(item, row), 200)}
                      style={ButtonStyle}
                      {...item?.props}
                    >
                      {item?.text}
                    </a>
                  )}
                  {index === _.get(currentButtons, "length", 0) - 1 ? null : (
                    <Divider type="vertical" />
                  )}
                </>
              );
            })}
          </div>
        ) : null;
      },
    });
  }
  const currentColumns = _.map(totalColumns, (item) => {
    const { render, format, enums, tagType, otherFilters } = item;
    if (otherFilters) {
      item.filterDropdown = getColumnsFilterDropdown(
        otherFilters,
        item?.dataIndex || item?.key
      );
    }
    if (format) {
      return {
        ...item,
        render: render
          ? render
          : (val: any) =>
              !_.isNil(val) ? timeUtcOffect(val).format(format) : "-",
      };
    }
    if (tagType) {
      return {
        ...item,
        render: render ? render : (val: any) => getTag(val, enums, tagType),
      };
    }
    if (isObject(enums)) {
      return {
        ...item,
        render: render
          ? render
          : (val: any) => (!_.isNil(val) ? enums[val] : "-"),
      };
    }
    return {
      ...item,
    };
  });
  const toExport = () => {
    const options: any = {
      headers: {
        ...exportBtn?.headers,
      },
    };

    let params = exportBtn?.params ? exportBtn?.params : {};
    params = { ...params, ...currentParams };
    if (exportBtn?.method === "post") {
      options.method = "post";
      options.body = JSON.stringify(params);
    }
    let download: any;
    fetch(exportBtn?.url, options)
      .then((res) => {
        const disposition = res.headers.get("Content-Disposition");
        let str =
          typeof disposition === "string"
            ? disposition.split(";")[1]
            : exportBtn?.filname;
        let filename = "";
        if (str) {
          filename = !str.split("fileName=")[1]
            ? str.split("filename=")[1]
            : str.split("fileName=")[1];
        }
        filename = filename
          ? filename
          : exportBtn?.filename || exportBtn?.fileName;
        download = decodeURIComponent(filename);
        return res.blob();
      })
      .then((blob) => {
        if (!download) {
          Message.error({
            title: "文件名缺失、下载错误，请联系开发人员！",
          });
          return;
        }
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = download;
        a.target = "_blank";
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };
  const boxRef = useRef<any>();
  const [showBtn, setShowBtn] = useState<boolean>(false);
  useEffect(() => {
    setShowBtn(true);
  }, []);
  return (
    <div style={{ position: "relative" }}>
      <Modal
        width="40vw"
        open={rowSelectShow}
        title="自定义列表字段"
        onCancel={onRowCancel}
        destroyOnClose
        footer={
          <div style={footerStyle}>
            <Space>
              <Button onClick={onRowCancel}>取消</Button>
              <Button type="primary" onClick={onRowConfirm}>
                确认
              </Button>
            </Space>
          </div>
        }
      >
        <Checkbox.Group
          value={rowSelectItems.new || []}
          onChange={(values: any) =>
            setRowSelectItems((state: any) => ({ ...state, new: values }))
          }
        >
          <Row>
            {_.map(rowConfig, (item) => (
              <Col span={24}>
                <Checkbox
                  value={item?.dataIndex || item?.key}
                  style={{ marginBottom: 14 }}
                  disabled={!!item?.disabled}
                >
                  {item?.title}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Modal>
      <div id={BoxId} style={BoxStyle} ref={boxRef}></div>
      {exportBtn
        ? tableExportBoxId && !!document.getElementById(tableExportBoxId)
          ? createPortal(
              <Button type="primary" onClick={() => toExport()}>
                {exportBtn?.text || "导出"}
              </Button>,
              document.getElementById(tableExportBoxId)!
            )
          : !!document.getElementById(BoxId)
          ? createPortal(
              <Button type="primary" onClick={() => toExport()}>
                {exportBtn?.text || "导出"}
              </Button>,
              document.getElementById(BoxId)!
            )
          : null
        : null}
      {rowConfig && showBtn
        ? tableOperateBoxId && !!document.getElementById(tableOperateBoxId)
          ? createPortal(
              <Button
                type="primary"
                onClick={() => {
                  setRowSelectShow(true);
                }}
              >
                配置列
              </Button>,
              document.getElementById(tableOperateBoxId)!
            )
          : !!document.getElementById(BoxId)
          ? createPortal(
              <Button
                type="primary"
                onClick={() => {
                  setRowSelectShow(true);
                }}
                style={{
                  marginLeft:
                    exportBtn &&
                    tableExportBoxId &&
                    !!document.getElementById(tableExportBoxId)
                      ? 14
                      : 0,
                }}
              >
                配置列
              </Button>,
              boxRef.current
            )
          : null
        : null}
      <Table
        scroll={{ x: "max-content", y: height }}
        dataSource={currentData}
        columns={currentColumns}
        pagination={url ? (pagination as any) : false}
        onChange={url ? onChange : () => {}}
        expandable={childTable ? expandable : undefined}
        rowKey={rowKey}
        locale={{
          emptyText: (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <img style={{ width: 320, height: 220 }} src={EmptyImg} alt="" />
              <div style={{ fontSize: 14, color: "#888", textAlign: "center" }}>
                暂无数据
              </div>
            </div>
          ),
        }}
        {...otherProps}
      />
      <ModalWithForm {...modalConfig} ref={formRef} />
      <ModalDetail {...detailConfig} />
      <Modal
        destroyOnClose
        width="40vw"
        title="温馨提示"
        footer={null}
        {...msgModalConfig}
      >
        <div style={{ fontSize: 13, color: "#575757", textAlign: "center" }}>
          {msgModalConfig.msg}
        </div>
        <div
          style={{
            margin: "30px auto 14px",
            width: 200,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button onClick={() => msgModalConfig.onCancel()}>取消</Button>
          <Button onClick={() => msgModalConfig.onOk()} type="primary">
            确认
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default forwardRef((props: any, ref: any) => (
  <NewTable {...(props as any)} forwordRef={ref} />
));

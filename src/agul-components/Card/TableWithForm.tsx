import {
  useState,
  useRef,
  useMemo,
  useContext,
  createElement,
  CSSProperties,
} from "react";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button, message } from "antd";
import Message from "@/agul-methods/Message";
import { v4 as uuid } from "uuid";
import NewForm from "@/agul-components/NewForm";
import NewTable from "@/agul-components/NewTable";
import ModalWithForm from "@/agul-components/ModalWithForm";
import GloablLoading from "@/agul-methods/Loading";
import { WidgetsContext, AgulWrapperConfigContext } from "@/agul-utils/context";
import request from "@/agul-utils/request";
import "./common.less";

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
function uploadFile(event: any, url: string, reset: () => void, headers = {}) {
  const file =
    event.target.files[0] || event.dataTransfer.files[0] || this.file.files[0];
  // 使用FormData方式上传，并设置相应的参数
  const fData = new FormData();
  fData.set("file", file); // 设置上传属性
  GloablLoading.show();
  request(url, {
    method: "post",
    data: fData,
    headers: { ...headers },
  })
    .then(() => {
      Message.success({
        title: "操作成功",
      });
      reset();
      GloablLoading.hide();
    })
    .catch((err) => {
      console.error(err.message);
      GloablLoading.hide();
    });
}
function getJSONtoUpload(
  event: any,
  importInfo: any,
  reset: () => void,
  headers = {}
) {
  const file =
    _.get(event, ["target", "files", 0]) ||
    _.get(event, ["dataTransfer", "files", 0]) ||
    _.get(this, ["file", "files", 0]);
  importInfo
    ?.getJSON(file)
    .then((res: any) => {
      request(importInfo?.url, {
        method: "post",
        data: res,
        headers: { ...headers },
      })
        .then(() => {
          Message.success({
            title: "操作成功",
          });
          reset();
        })
        .catch((err) => {
          console.error(err.message);
        });
    })
    .catch((err: Error) => {
      if (err.message) {
        message.warn(err.message);
      }
    });
}
const RegOfUrl = /\{.*\}/g;
const TableWithForm: React.FC<{
  data: any;
  style: CSSProperties;
}> = ({ data, style }) => {
  const location = useLocation();
  const paramObj = _.get(location, ["query"]);
  const mapping = data?.mapping || {};
  const fileRef = useRef<any>(null);
  const formRef = useRef<any>(null);
  const modalFormRef = useRef<any>(null);
  const [modalConfig, setModalConfig] = useState<any>(DefaultModalConfig);
  const [params, setParams] = useState<any>({});
  const [showTable, setShowTable] = useState<boolean>(false);
  const onMount = () => {
    const init = _.get(schema, "action.init", () => {});
    const data = formRef?.current?.getValues();
    init(data);
    setParams({
      ...data,
    });
    setShowTable(true);
  };
  const field = data?.component?.field;
  const url = data?.component?.url!.replaceAll(
    RegOfUrl,
    _.get(paramObj, [field])
  ) as string;
  const path = data?.component?.path;
  const pagePath = data?.component?.pagePath;
  const columns = data?.component?.value?.tableConfig?.columns;
  const childTable = data?.component?.value?.tableConfig?.childTable;
  const rowSelect = data?.component?.value?.tableConfig?.rowSelect;
  const schema = data?.component?.value?.formConfig?.schema;
  const widgets = data?.component?.value?.formConfig?.widgets;
  const addBtn = data?.component?.value?.formConfig?.addBtn;
  const exportBtn = data?.component?.value?.formConfig?.exportBtn;
  const importBtn = data?.component?.value?.formConfig?.importBtn;
  const Widgets = useContext(WidgetsContext);
  const extraBtns = data?.component?.value?.formConfig?.extraBtns || [];
  const tableOperate = data?.component?.value?.tableConfig?.operate;
  const rowConfig = data?.component?.value?.tableConfig?.rowConfig;
  const needOrder = data?.component?.value?.tableConfig?.needOrder;
  const method = data?.component?.value?.tableConfig?.method;
  const navigate = useNavigate();
  const Wrapper = useContext(AgulWrapperConfigContext) as any;
  const requestHeaders = _.get(Wrapper, "requestHeaders", {}) || {};
  const toSubmit = () => {
    formRef?.current
      ?.validate()
      .then((res: any) => {
        if (!res?.errors || !res?.errors?.length) {
          _.set(res, "___agul_ui_time____", new Date().getTime());
          setParams(_.pickBy(res, (item) => !_.isNil(item)));
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const reset = () => {
    formRef?.current?.resetFields();
    setParams({ ___agul_ui_time____: new Date().getTime() });
  };
  const toAdd = () => {
    if (addBtn?.routerPath) {
      navigate(addBtn?.routerPath);
      return;
    }
    const callback = () => {
      modalFormRef?.current
        ?.validate()
        .then((res: any) => {
          if (res instanceof FormData || !res?.errors || !res?.errors?.length) {
            request(addBtn?.url, {
              method: addBtn?.method ? addBtn?.method : "post",
              data: res,
              headers: { ...requestHeaders },
            })
              .then(() => {
                Message.success({
                  title: "操作成功",
                });
                setModalConfig(DefaultModalConfig);
                reset();
              })
              .catch((err) => {
                console.error(err.message);
              });
          }
        })
        .catch((err: any) => {
          console.error(err.message);
        });
    };
    setModalConfig({
      title: addBtn?.text,
      open: true,
      schema: addBtn?.schema,
      widgets: addBtn?.widgets,
      onSuccess: callback,
      onCancel: () => setModalConfig(DefaultModalConfig),
      readonly: false,
    });
  };
  const toImport = () => {
    fileRef?.current?.click();
  };
  const currentParams = useMemo(() => {
    return data?.component?.params
      ? { ...data?.component?.params, ...params }
      : params;
  }, [params]);
  const tableOperateBoxId = uuid();
  return (
    <div className="agul-table-with-form-card" style={style}>
      {schema ? (
        <div className="agul-table-with-form-box">
          <div className="agul-table-form">
            <NewForm
              schema={schema}
              widgets={widgets}
              ref={formRef}
              globalDataFeilds={mapping.form}
              onMount={onMount}
            />
          </div>
          <div className="agul-table-with-operate-box" id={tableOperateBoxId}>
            <Button onClick={() => toSubmit()}>查询</Button>
            {addBtn ? (
              <Button type="primary" onClick={toAdd} {...addBtn?.props}>
                {addBtn?.text || "新建"}
              </Button>
            ) : null}
            {importBtn ? (
              <Button
                type="primary"
                onClick={() => toImport()}
                {...importBtn?.props}
              >
                {importBtn?.text || "导入"}
              </Button>
            ) : null}
            {_.map(extraBtns, (com) =>
              typeof com === "string"
                ? Widgets && Widgets[com]
                  ? createElement(Widgets[com] as any, {
                      reset,
                      upDate: toSubmit,
                    })
                  : com
                : typeof com === "function"
                ? createElement(com as any, { reset, upDate: toSubmit })
                : null
            )}
          </div>
        </div>
      ) : null}
      {showTable ? (
        <NewTable
          rowKey="id"
          url={url}
          params={currentParams}
          columns={columns}
          operate={tableOperate}
          rowConfig={rowConfig}
          path={path}
          pagePath={pagePath}
          rowSelect={rowSelect}
          childTable={childTable}
          needOrder={needOrder}
          method={method}
          tableOperateBoxId={tableOperateBoxId}
          tableExportBoxId={tableOperateBoxId}
          exportBtn={exportBtn}
        />
      ) : null}
      <ModalWithForm {...modalConfig} ref={modalFormRef} />
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileRef}
        onChange={(event) =>
          importBtn?.dataType === "json"
            ? getJSONtoUpload(event, importBtn, reset, requestHeaders)
            : uploadFile(event, importBtn?.url, reset, requestHeaders)
        }
      />
    </div>
  );
};
export default TableWithForm;

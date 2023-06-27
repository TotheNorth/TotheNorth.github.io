import { useState, useRef, useMemo, CSSProperties, useContext } from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import Message from "@/agul-methods/Message";
import NewForm from "@/agul-components/NewForm";
import NewTable from "@/agul-components/NewTable";
import ModalWithForm from "@/agul-components/ModalWithForm";
import useNewRequest from "@/agul-hooks/useNewRequest";
import "./styles.less";

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

const TableWithForm: React.FC<{
  url: string;
  method?: string;
  path?: string;
  pagePath?: string;
  columns: any;
  childTable?: any;
  style?: CSSProperties;
  rowSelect?: boolean;
  schema?: any;
  widgets?: any;
  addBtn?: any;
  extraBtns?: any;
  tableOperate?: any;
  rowConfig?: any;
  exportBtn?: any;
  needOrder?: boolean;
  tableHeight?: number;
  params?: Record<string, string | number>;
  tableRef?: any;
}> = ({
  url,
  method = "get",
  path = "data",
  pagePath = "pageable",
  columns = [],
  childTable,
  rowSelect = false,
  schema,
  style,
  widgets,
  addBtn,
  extraBtns,
  tableOperate,
  rowConfig,
  exportBtn,
  needOrder = false,
  tableHeight,
  params,
  tableRef,
}) => {
  const formRef = useRef<any>(null);
  const modalFormRef = useRef<any>(null);
  const [modalConfig, setModalConfig] = useState<any>(DefaultModalConfig);
  const [extraParams, setExtraParams] = useState<any>({});
  const showTableRef = useRef<boolean>(false);
  const onMount = () => {
    toSubmit();
    showTableRef.current = true;
  };
  const navigate = useNavigate();
  const request = useNewRequest();
  const toSubmit = () => {
    formRef?.current
      ?.validate()
      .then((res: any) => {
        if (!res?.errors || !res?.errors?.length) {
          // _.set(res, "___agul_ui_time____", new Date().getTime());
          setExtraParams(_.pickBy(res, (item) => !_.isNil(item)));
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const reset = () => {
    formRef?.current?.resetFields();
    // setExtraParams({ ___agul_ui_time____: new Date().getTime() });
    setExtraParams({});
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
  const configBox = useRef(null);
  const currentParams = useMemo(() => {
    return params ? { ...params, ...extraParams } : extraParams;
  }, [extraParams]);
  return (
    <div className="agul-table-with-form-container" style={style}>
      {schema ? (
        <div className="agul-table-with-form-box">
          <div className="agul-table-form">
            <NewForm
              schema={schema}
              widgets={widgets}
              ref={formRef}
              onMount={onMount}
            />
          </div>
          <div className="agul-table-with-operate-box" ref={configBox}>
            <Button onClick={() => toSubmit()}>查询</Button>
            {addBtn ? (
              <Button type="primary" onClick={toAdd} {...addBtn?.props}>
                {addBtn?.text || "新建"}
              </Button>
            ) : null}
            {extraBtns}
          </div>
        </div>
      ) : null}
      {showTableRef?.current ? (
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
          exportBtn={exportBtn}
          childTable={childTable}
          needOrder={needOrder}
          method={method}
          rowConfigBox={configBox.current}
          exportBox={configBox.current}
          height={tableHeight}
          ref={tableRef}
        />
      ) : null}

      <ModalWithForm {...modalConfig} ref={modalFormRef} />
    </div>
  );
};
export default TableWithForm;

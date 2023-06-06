import React, {
  CSSProperties,
  useEffect,
  useState,
  useContext,
  createElement,
  useRef,
} from "react";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import Message from "@/agul-methods/Message";
import { useNavigate } from "react-router-dom";
import GloablLoading from "@/agul-methods/Loading";
import NewForm from "@/agul-components/NewForm";
import request from "@/agul-utils/request";
import { WidgetsContext, AgulWrapperConfigContext } from "@/agul-utils/context";
import "./common.less";

const RegOfUrl = /\{.*\}/g;
const Form: React.FC<{
  data: any;
  style: CSSProperties;
}> = ({ data, style }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({});
  const mapping = data?.mapping || {};
  const url = data?.component?.url;
  const path = data?.component?.path;
  const field = data?.component?.field;
  const method = data?.component?.method;
  const disabled = data?.component?.value?.disabled;
  const schema = data?.component?.value?.schema;
  const widgets = data?.component?.value?.widgets;
  const extraBtns = data?.component?.value?.extraBtns || [];
  const location = useLocation();
  const paramObj = _.get(location, ["query"]);
  const detailUrl = data?.component?.value?.detailUrl?.replaceAll(
    RegOfUrl,
    _.get(paramObj, [field])
  );
  const currentUrl = RegOfUrl.test(url)
    ? url.replaceAll(RegOfUrl, _.get(paramObj, [field]))
    : url;
  const Wrapper = useContext(AgulWrapperConfigContext) as any;
  const requestHeaders = _.get(Wrapper, "requestHeaders", {}) || {};
  useEffect(() => {
    if (detailUrl) {
      GloablLoading.show();
      request(detailUrl, {
        method: "get",
        headers: { ...requestHeaders },
      })
        .then((res) => {
          GloablLoading.hide();
          const newFormData = _.get(res, path);
          if (newFormData) {
            setFormData(newFormData);
          }
        })
        .catch((err) => {
          GloablLoading.hide();
          console.error(err.message);
        });
    }
  }, [detailUrl]);
  const toSubmit = (data: any, errors: any) => {
    if (errors && errors.length) {
      return;
    }
    GloablLoading.show();
    request(currentUrl, {
      method: method ? method : detailUrl ? "put" : "post",
      data,
      headers: { ...requestHeaders },
    })
      .then(() => {
        Message.success({
          title: "操作成功",
        });
        GloablLoading.hide();
        GloablLoading.hide();
        navigate(-1);
      })
      .catch((err) => {
        console.error(err.message);
        GloablLoading.hide();
      });
  };
  const Widgets = useContext(WidgetsContext);
  const formRef = useRef<any>(null);
  return (
    <div className="agul-form-card" style={style}>
      <NewForm
        ref={formRef}
        schema={schema}
        widgets={widgets}
        formData={formData}
        onSubmit={disabled ? undefined : toSubmit}
        onCancel={disabled ? undefined : () => navigate(-1)}
        globalDataFeilds={mapping.form}
        disabled={disabled}
        extraButtons={_.map(extraBtns, (com) =>
          typeof com === "string"
            ? Widgets && Widgets[com]
              ? createElement(Widgets[com] as any, { formRef })
              : com
            : typeof com === "function"
            ? createElement(com as any, { formRef })
            : null
        )}
      />
    </div>
  );
};

export default Form;

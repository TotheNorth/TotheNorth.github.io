import React, {
  CSSProperties,
  useEffect,
  useState,
  useContext,
  createElement,
  useRef,
} from "react";
import _ from "lodash";
import { Button, Steps } from "antd";
import Message from "@/agul-methods/Message";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import GloablLoading from "@/agul-methods/Loading";
import useNewRequest from "@/agul-hooks/useNewRequest";
import NewForm from "@/agul-components/NewForm";
import { WidgetsContext } from "@/agul-utils/context";
import "./common.less";

const RegOfUrl = /\{.*\}/g;
const StepsForm: React.FC<{
  data: any;
  style: CSSProperties;
}> = ({ data, style }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<any>({});
  const url = data?.component?.url;
  const method = data?.component?.method;
  const field = data?.component?.field;
  const path = data?.component?.path;
  const detailMethod = data?.component?.detailMethod;
  const schemas = data?.component?.value?.schemas || [];
  const widgets = data?.component?.value?.widgets;
  const disabled = data?.component?.value?.disabled;
  const extraBtns = data?.component?.value?.extraBtns || [];
  const location = useLocation();
  const paramObj = _.get(location, ["query"]);
  const detailUrl = data?.component?.detailUrl?.replaceAll(
    RegOfUrl,
    _.get(paramObj, [field])
  );
  const currentUrl = data?.component?.url.replaceAll(
    RegOfUrl,
    _.get(paramObj, [field])
  );
  const request = useNewRequest();
  useEffect(() => {
    if (detailUrl) {
      const reqData = {
        method: detailMethod || "get",
      };
      if ("post" === detailMethod || !detailMethod) {
        if (!RegOfUrl.test(detailUrl) && field) {
          _.set(reqData, `data`, { [field]: _.get(paramObj, [field]) });
        }
      }
      GloablLoading.show();
      request(detailUrl, reqData)
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
  const toSubmit = (data: any, errors: any, lastStep: boolean) => {
    if (errors && errors.length) {
      return;
    }
    setFormData((value: any) => {
      return {
        ...value,
        ...data,
      };
    });
    if (lastStep) {
      GloablLoading.show();
      const reqData = {
        method: method ? method : detailUrl ? "put" : "post",
        data: { ...formData, ...data },
      };
      if (!RegOfUrl.test(url) && field) {
        _.set(reqData, `data.${field}`, _.get(paramObj, [field]));
      }
      request(currentUrl, reqData)
        .then(() => {
          Message.success({
            title: "操作成功",
          });
          GloablLoading.hide();
          navigate(-1);
        })
        .catch((err) => {
          GloablLoading.hide();
          console.error(err.message);
        });
    } else {
      setStep((num) => num + 1);
    }
  };
  const Widgets = useContext(WidgetsContext);
  const formRef = useRef<any>(null);
  return (
    <div className="agul-steps-form-card" style={style}>
      <Steps
        current={step}
        items={_.map(schemas, ({ stepName }) => ({
          title: stepName,
        }))}
        style={{ marginBottom: "24px" }}
      />
      <NewForm
        disabled={disabled}
        schema={schemas[step]}
        formData={formData}
        onSubmit={(data: any, errors: any) =>
          toSubmit(data, errors, _.isEqual(step, schemas.length - 1))
        }
        widgets={widgets}
        submitText={_.isEqual(step, schemas.length - 1) ? "提交" : "下一步"}
        onCancel={() => navigate(-1)}
        extraButtons={[
          <Button
            disabled={!step}
            onClick={() => {
              setStep((num) => num - 1);
            }}
          >
            上一步
          </Button>,
          _.map(extraBtns, (com) =>
            typeof com === "string"
              ? Widgets && Widgets[com]
                ? createElement(Widgets[com] as any, { formRef })
                : com
              : typeof com === "function"
              ? createElement(com as any, { formRef })
              : null
          ),
        ]}
      />
    </div>
  );
};

export default StepsForm;

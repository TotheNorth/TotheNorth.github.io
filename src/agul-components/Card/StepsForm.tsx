import React, { CSSProperties, useEffect, useState, useContext } from "react";
import _ from "lodash";
import { Button, Steps } from "antd";
import Message from "@/agul-methods/Message";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import GloablLoading from "@/agul-methods/Loading";
import request from "@/agul-utils/request";
import NewForm from "@/agul-components/NewForm";
import { AgulWrapperConfigContext } from "@/agul-utils/context";

import "./common.less";

const RegOfUrl = /\{.*\}/g;
const StepsForm: React.FC<{
  data: any;
  style: CSSProperties;
}> = ({ data, style }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<any>({});
  const mapping = data?.mapping || {};
  const url = data?.component?.url;
  const method = data?.component?.method;
  const field = data?.component?.field;
  const path = data?.component?.path;
  const schemas = data?.component?.value?.schemas || [];
  const widgets = data?.component?.value?.widgets;
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
      request(currentUrl, {
        method: method ? method : detailUrl ? "put" : "post",
        data: { ...formData, ...data },
        headers: { ...requestHeaders },
      })
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
        schema={schemas[step]}
        formData={formData}
        onSubmit={(data: any, errors: any) =>
          toSubmit(data, errors, _.isEqual(step, schemas.length - 1))
        }
        widgets={widgets}
        submitText={_.isEqual(step, schemas.length - 1) ? "提交" : "下一步"}
        onCancel={() => navigate(-1)}
        globalDataFeilds={mapping.form}
        extraButtons={[
          <Button
            disabled={!step}
            onClick={() => {
              setStep((num) => num - 1);
            }}
          >
            上一步
          </Button>,
        ]}
      />
    </div>
  );
};

export default StepsForm;

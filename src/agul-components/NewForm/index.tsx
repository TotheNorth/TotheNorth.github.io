import React, {
  useRef,
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
  ReactNode,
  useMemo,
  useContext,
  ComponentType,
} from "react";
import FormRender, { useForm } from "form-render";
import _ from "lodash";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import JsonEditor from "./widgets/JsonEditor";
import CustomCascader from "./widgets/CustomCascader";
import CustomTreeSelect from "./widgets/CustomTreeSelect";
import CustomStringSelect from "./widgets/CustomStringSelect";
import CustomNumberSelect from "./widgets/CustomNumberSelect";
import AsyncSelect from "./widgets/AsyncSelect";
import CodeEditor from "./widgets/CodeEditor";
import { WidgetsContext } from "@/agul-utils/context";
import { isObject } from "@/agul-utils/utils";
import "./index.less";

const CustomUpload = (props: any) => {
  const { onChange, accept, value } = props;
  const fileRef = useRef<any>(null);
  const reset = () => {
    onChange(null);
  };
  function uploadFile(event: any) {
    const file =
      _.get(event, ["target", "files", 0]) ||
      _.get(event, ["dataTransfer", "files", 0]) ||
      _.get(this, ["file", "files", 0]);
    if (file) {
      onChange(file);
    } else {
      reset();
    }
  }
  return (
    <div>
      <input
        type="file"
        accept={accept}
        style={{ display: "none" }}
        ref={fileRef}
        onChange={uploadFile}
      />
      {value ? (
        <span>
          {value?.name}&nbsp;
          <DeleteOutlined onClick={reset} style={{ cursor: "pointer" }} />
        </span>
      ) : (
        <Button onClick={() => fileRef?.current?.click()}>选择文件</Button>
      )}
    </div>
  );
};
const NewForm: React.FC<{
  schema: any;
  forwordRef?: any;
  formData?: any;
  onSubmit?: any;
  submitText?: ReactNode;
  onCancel?: any;
  cancelText?: ReactNode;
  onChange?: any;
  extraButtons?: ReactNode[];
  widgets?: Record<string, ComponentType | string>;
  watch?: Record<string, (x: string) => void>;
}> = ({
  schema,
  formData,
  onChange = () => {},
  forwordRef,
  onSubmit,
  submitText,
  onCancel,
  cancelText,
  extraButtons = [],
  widgets = {},
  watch = {},
  ...otherProps
}) => {
  delete (otherProps as any).onFinish;
  const form = useForm();
  const init = _.get(schema, "action.init", () => {});
  const change = _.get(schema, "action.change", () => {});
  const submit = _.get(schema, "action.submit", () => {});
  const currentSchema = useMemo(() => _.cloneDeep(schema), [schema]);
  useLayoutEffect(() => {
    if (formData) {
      if (isObject(formData)) {
        init(formData);
        form.setValues(formData);
      }
    }
  }, [formData]);

  useImperativeHandle(
    forwordRef,
    () => ({
      validate() {
        return form
          .validateFields()
          .then((data: any) => {
            submit(data);
            return data;
          })
          .catch((err: any) => {
            _.set(err, "errors", _.get(err, "errorFields"));
            return err;
          });
      },
      ...form,
    }),
    [forwordRef]
  );
  const onFinish = (values: any) => {
    submit(values);
    onSubmit(values);
  };
  // 因为要实现可控组件的缘故，为了实现onChange回调函数使用了"#"全局的watch监听，因此只支持单字段的监听
  if (isObject(watch)) {
    delete watch["#"];
  }
  const watchFunc = isObject(watch)
    ? {
        "#": {
          handler: (val: any) => {
            if (onChange) {
              change(val);
              onChange(val);
            }
          },
          immediate: false,
        },
        ...watch,
      }
    : {};
  const Widgets = useContext(WidgetsContext) as any;
  const currentWidgets = useMemo(() => {
    const obj: any = {};
    if (!isObject(widgets)) return obj;
    _.forEach(widgets, (item, key) => {
      if (typeof item === "string") {
        obj[key] = (Widgets && Widgets[item]) || "div";
      } else if (typeof item === "function") {
        obj[key] = item;
      }
    });
    return obj;
  }, [widgets]);

  return (
    <div className="agul-new-form">
      <FormRender
        id="newForm"
        onFinish={onFinish as any}
        form={form}
        schema={currentSchema}
        watch={watchFunc}
        removeHiddenData={false}
        widgets={{
          CustomUpload,
          CustomStringSelect,
          CustomNumberSelect,
          CustomTreeSelect,
          CustomCascader,
          JsonEditor,
          CodeEditor,
          AsyncSelect,
          ...currentWidgets,
        }}
        {...otherProps}
      />
      <div id="form-botton-box" className="agul-new-form-button-box">
        {onSubmit ? (
          <Button
            type="primary"
            className="agul-new-form-submit-btn"
            onClick={() => {
              form.submit();
            }}
          >
            {submitText || "提交"}
          </Button>
        ) : null}
        {onCancel ? (
          <Button
            className="agul-new-form-cancel-btn"
            onClick={() => {
              onCancel();
            }}
          >
            {cancelText || "取消"}
          </Button>
        ) : null}
        {extraButtons}
      </div>
    </div>
  );
};

export default forwardRef((props: any, ref: any) => (
  <NewForm {...(props as any)} forwordRef={ref} />
));

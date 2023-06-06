import React, { ReactNode, forwardRef, CSSProperties } from "react";
import { Modal } from "antd";
import _ from "lodash";
import NewForm from "@/agul-components/NewForm";

const modalContentStyle: CSSProperties = {
  height: "70vh",
  overflowY: "auto",
  padding: "14px",
};
const ModalWithForm: React.FC<{
  width?: string | number;
  height?: string | number;
  title: ReactNode | null | string;
  open: boolean;
  onSuccess: any;
  onCancel: any;
  disabled: boolean;
  schema: any;
  widgets?: any;
  formData?: any;
  forwordRef: any;
}> = ({
  width = "40vw",
  height = "45vh",
  title,
  onSuccess,
  onCancel,
  schema,
  widgets,
  disabled,
  open,
  formData,
  forwordRef,
}) => {
  return (
    <Modal
      width={width}
      open={open}
      title={title}
      onOk={onSuccess}
      onCancel={onCancel}
      destroyOnClose
      centered
    >
      <div style={{ ...modalContentStyle, height }}>
        <NewForm
          schema={schema}
          disabled={disabled}
          ref={forwordRef}
          formData={formData}
          widgets={widgets}
        />
      </div>
    </Modal>
  );
};

export default forwardRef((props: any, ref: any) => (
  <ModalWithForm {...(props as any)} forwordRef={ref} />
));

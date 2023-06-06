import React, { ReactNode, forwardRef, CSSProperties } from "react";
import { Modal } from "antd";
import _ from "lodash";
import Detail from "@/agul-components/Detail";

const modalContentStyle: CSSProperties = {
  height: "70vh",
  overflowY: "auto",
  padding: "14px",
};

const ModalWithDetail: React.FC<{
  width?: string | number;
  title: ReactNode | null | string;
  open: boolean;
  onSuccess: any;
  onCancel: any;
  data: any;
}> = ({ title, onCancel, open, data = {}, width = "40vw" }) => {
  return (
    <Modal
      width={width}
      open={open}
      title={title || "详情"}
      onCancel={onCancel}
      destroyOnClose
      footer={null}
      centered
    >
      <div style={modalContentStyle}>
        <Detail {...data} />
      </div>
    </Modal>
  );
};

export default forwardRef((props: any, ref: any) => (
  <ModalWithDetail {...(props as any)} forwordRef={ref} />
));

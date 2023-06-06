import React, { ReactNode, CSSProperties } from "react";
import { Modal } from "antd";
import _ from "lodash";
import FileParse from "@/agul-components/FileParse";
const modalContentStyle: CSSProperties = {
  height: "70vh",
  overflowY: "auto",
  padding: "14px",
};

const ModalVideo: React.FC<{
  title: ReactNode | null | string;
  open: boolean;
  onSuccess: any;
  onCancel: any;
  data: any;
  width?: string | number;
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
        <FileParse {...data} />
      </div>
    </Modal>
  );
};

export default ModalVideo;

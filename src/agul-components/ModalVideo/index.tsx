import React, { ReactNode, CSSProperties } from "react";
import { Modal } from "antd";
import _ from "lodash";
import Video from "@/agul-components/Video";

const modalContentStyle: CSSProperties = {
  height: "70vh",
  overflowY: "auto",
  padding: "14px",
};
const VideoStyle: CSSProperties = {
  width: "100%",
  height: "100%",
};
const ModalVideo: React.FC<{
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
        <Video style={VideoStyle} {...data} />
      </div>
    </Modal>
  );
};

export default ModalVideo;

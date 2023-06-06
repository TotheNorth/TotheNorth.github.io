import ReactDOM from "react-dom";
import { Spin } from "antd";
import { isDOM } from "@/agul-utils/utils";
import "./index.less";

const agul_loading_box_id = "_______agul_loading_box_id_______";
export default {
  show(container?: string | HTMLElement) {
    if (isDOM(document.getElementById(agul_loading_box_id))) {
      return;
    }
    const loadingContainer = document.createElement("div");
    loadingContainer.id = agul_loading_box_id;
    if (container) {
      loadingContainer.className = "agul_loading_wrap";
      this.container = container;
      if (typeof container === "string") {
        if (isDOM(document.getElementById(container))) {
          (document.getElementById(container) as HTMLElement).classList.add(
            "agul_loading_wrap_parent"
          );
          (document.getElementById(container) as HTMLElement).append(
            loadingContainer
          );
        } else {
          console.error("该元素不存在，无法显示loading！");
        }
      } else {
        (container as HTMLElement).classList.add("agul_loading_wrap_parent");
        (container as HTMLElement).append(loadingContainer);
      }
    } else {
      loadingContainer.className = "agul_loading_fixed_wrap";
      document.body.append(loadingContainer);
    }
    ReactDOM.render(<Spin size="large" />, loadingContainer);
  },
  hide() {
    if (document.getElementById(agul_loading_box_id)) {
      if (this.container) {
        if (typeof this.container === "string") {
          if (isDOM(document.getElementById(this.container))) {
            (document.getElementById(
              this.container
            ) as HTMLElement).classList.remove("agul_loading_wrap_parent");
            (document.getElementById(
              this.container
            ) as HTMLElement).removeChild(
              document.getElementById(agul_loading_box_id) as HTMLElement
            );
          }
        } else {
          (this.container as HTMLElement).classList.remove(
            "agul_loading_wrap_parent"
          );
          (this.container as HTMLElement).removeChild(
            document.getElementById(agul_loading_box_id) as HTMLElement
          );
        }
        this.container = null;
      } else {
        document.body.removeChild(
          document.getElementById(agul_loading_box_id) as HTMLElement
        );
      }
    }
  },
};

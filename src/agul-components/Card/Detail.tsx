import React, {
  CSSProperties,
  useContext,
  createElement,
  useState,
} from "react";
import _ from "lodash";
import Detail from "@/agul-components/Detail";
import { WidgetsContext } from "@/agul-utils/context";

import "./common.less";
const DetailCard: React.FC<{
  data: any;
  style: CSSProperties;
}> = ({ data, style }) => {
  const Widgets = useContext(WidgetsContext);
  const [detaiData, setData] = useState({});
  const getData = (data: any) => {
    setData(data);
  };
  const extraButtons = [
    ..._.map(data?.component?.value?.extraBtns || [], (com) =>
      typeof com === "string"
        ? Widgets && Widgets[com]
          ? createElement(Widgets[com] as any, { data: detaiData })
          : com
        : typeof com === "function"
        ? createElement(com as any, { data: detaiData })
        : null
    ),
  ];
  return (
    <div className="agul-detail-card" style={style}>
      <Detail
        url={data?.component?.url}
        path={data?.component?.path}
        field={data?.component?.field}
        method={data?.component?.method}
        params={data?.component?.params}
        names={data?.component?.value?.names}
        enums={data?.component?.value?.enums}
        tableConfig={data?.component?.value?.tableConfig}
        objectConfig={data?.component?.value?.objectConfig}
        init={data?.component?.value?.init}
        extraButtons={extraButtons}
        getDetailValue={getData}
      />
    </div>
  );
};

export default DetailCard;

import React, { useMemo, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalState, useGlobalDispatch } from "@/agul-utils/context";
import "./common.less";
const AMap: React.FC<{
  data: any;
  style: CSSProperties;
}> = ({ data, style }) => {
  const state = useGlobalState();
  const navigate = useNavigate();
  const { timestamp } = state;
  const options = useMemo(() => {
    return data?.component?.value?.data;
  }, [data]);
  const url = useMemo(() => {
    return data?.component?.value?.url;
  }, [data]);
  return (
    <div className="agul-falls-list-card" style={style}>
      {options.map((item: any) => (
        <div className="agul-falls-box">
          <div className="agul-falls-title">{item.title}</div>
          <div className="agul-falls-card">
            {item?.value.map((item_1: any) => (
              <div
                className="agul-falls-card-item"
                onClick={() => {
                  navigate(url);
                }}
              >
                {item_1}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AMap;

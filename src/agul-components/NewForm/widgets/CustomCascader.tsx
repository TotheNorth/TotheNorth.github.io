import { useEffect, useState, useContext } from "react";
import _ from "lodash";
import { Cascader } from "antd";
import request from "@/agul-utils/request";
import { AgulWrapperConfigContext } from "@/agul-utils/context";

const BoxStyle = { width: "100%", display: "flex" };
const CascaderStyle = { flexGrow: "1" };
function getCascaderData(
  data: any,
  labelFeilds: string[],
  valueFeilds: string[],
  level: number = 0
) {
  _.forEach(labelFeilds, () => {
    for (let z = 0; z < data.length; z++) {
      const y = data[z];
      y.label = _.get(y, labelFeilds[level]);
      y.value = _.get(y, valueFeilds[level]);
      if (level < labelFeilds.length - 1 && !_.isEmpty(y.children)) {
        y.children = getCascaderData(
          y.children,
          labelFeilds,
          valueFeilds,
          level + 1
        );
      } else {
        delete y.children;
      }
    }
  });
  return data;
}

const CustomCascader = (props: any) => {
  const {
    addons: { getFieldError },
    schema: { treeData },
    id,
    disabled,
    onChange,
    value,
    placeholder,
  } = props;
  const [cascaderOptions, setCascaderOptions] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const Wrapper = useContext(AgulWrapperConfigContext) as any;
  const requestHeaders = _.get(Wrapper, "requestHeaders", {}) || {};
  useEffect(() => {
    setLoading(true);
    request(treeData?.url, {
      method: "get",
      headers: { ...requestHeaders },
    })
      .then((res) => {
        setLoading(false);
        const treeValue = _.get(res, treeData?.path, []);
        if (treeValue) {
          setCascaderOptions(
            getCascaderData(
              treeValue,
              treeData?.labelFeilds,
              treeData?.valueFeilds
            )
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  }, []);
  const toChange = (value: string[]): void => {
    if (value) {
      onChange(value);
    } else {
      onChange(undefined);
    }
  };
  return (
    <div id="agul-ui-newform-cascader-container" style={BoxStyle}>
      <Cascader
        status={!_.isEmpty(getFieldError(id)) ? "error" : ""}
        options={cascaderOptions}
        value={value}
        onChange={toChange as any}
        style={CascaderStyle}
        disabled={disabled}
        placeholder={placeholder}
        loading={loading}
      />
    </div>
  );
};
export default CustomCascader;

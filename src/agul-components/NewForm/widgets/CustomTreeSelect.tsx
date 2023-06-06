import { useState, useEffect, useContext } from "react";
import { useUpdateEffect } from "ahooks";
import { TreeSelect } from "antd";
import request from "@/agul-utils/request";
import _ from "lodash";
import { getTreeData } from "@/agul-utils/utils";
import { AgulWrapperConfigContext } from "@/agul-utils/context";
const { SHOW_CHILD } = TreeSelect;
const CustomDateTime = (props: any) => {
  const {
    onChange,
    value,
    disabled,
    schema: { treeData, dependencies },
    addons: { dependValues = [], isFieldsTouched },
    placeholder,
  } = props;
  const [treeDataSource, setTreeDataSource] = useState<any[]>([]);
  const Wrapper = useContext(AgulWrapperConfigContext) as any;
  const requestHeaders = _.get(Wrapper, "requestHeaders", {}) || {};
  const getData = () => {
    const params = treeData?.params ? treeData?.params : {};
    _.forEach(dependencies, (item, index) => {
      if (dependValues[index]) {
        _.set(params, _.last(item.split(".")) as string, dependValues[index]);
      }
    });
    request(treeData?.url, {
      method: "get",
      params,
      headers: { ...requestHeaders },
    })
      .then((res) => {
        const treeValue = _.get(res, treeData?.path, []);
        if (treeValue) {
          setTreeDataSource(
            getTreeData(treeValue, treeData?.labelFeild, treeData?.valueFeild)
          );
        }
      })
      .catch((err) => {
        setTreeDataSource([]);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  useUpdateEffect(() => {
    if (isFieldsTouched()) {
      onChange(undefined);
    }
    getData();
  }, dependValues);
  return (
    <TreeSelect
      disabled={disabled}
      treeData={treeDataSource}
      value={value}
      onChange={onChange}
      treeCheckable
      showCheckedStrategy={SHOW_CHILD}
      placeholder={placeholder}
      style={{
        width: "100%",
      }}
      treeDefaultExpandAll
    />
  );
};
export default CustomDateTime;

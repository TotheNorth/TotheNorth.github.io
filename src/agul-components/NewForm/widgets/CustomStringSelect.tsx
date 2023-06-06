import { useEffect, useState, useContext } from "react";
import { useUpdateEffect } from "ahooks";
import { Select } from "antd";
import _ from "lodash";
import request from "@/agul-utils/request";
import { AgulWrapperConfigContext } from "@/agul-utils/context";

function getStr(data: any, feilds: any[]) {
  const obj: any = {};
  _.forEach(feilds, (item) => {
    obj[item] = data[item];
  });
  return JSON.stringify(obj);
}

const CustomDateTime = (props: any) => {
  const {
    onChange,
    value,
    disabled,
    schema: { treeData, dependencies },
    addons: { dataPath, getFieldError, dependValues = [], isFieldsTouched },
    allowClear,
    placeholder,
  } = props;
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const Wrapper = useContext(AgulWrapperConfigContext) as any;
  const requestHeaders = _.get(Wrapper, "requestHeaders", {}) || {};
  const getData = () => {
    const params = treeData?.params ? treeData?.params : {};
    _.forEach(dependencies, (item, index) => {
      if (dependValues[index]) {
        _.set(params, _.last(item.split(".")) as string, dependValues[index]);
      }
    });
    setLoading(true);
    request(treeData?.url, {
      method: "get",
      params,
      headers: { ...requestHeaders },
    })
      .then((res) => {
        const data = _.map(_.get(res, treeData?.path || "data", []), (x) => ({
          label: String(_.get(x, treeData?.labelFeild || "name")),
          value: _.isArray(treeData?.valueFeild)
            ? getStr(x, treeData?.valueFeild)
            : String(_.get(x, treeData?.valueFeild || "id")),
        }));
        setDataSource(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setDataSource([]);
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
    <Select
      status={!_.isEmpty(getFieldError(dataPath)) ? "error" : ""}
      style={{ width: "100%" }}
      value={value}
      onChange={onChange}
      disabled={disabled}
      options={dataSource}
      allowClear={!!allowClear}
      placeholder={placeholder}
      loading={loading}
    />
  );
};
export default CustomDateTime;

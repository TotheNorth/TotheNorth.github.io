import { useState, useContext } from "react";
import { Select } from "antd";
import request from "@/agul-utils/request";
import { AgulWrapperConfigContext } from "@/agul-utils/context";
import _ from "lodash";

function getStr(data: any, feilds: any[]) {
  const obj: any = {};
  _.forEach(feilds, (item) => {
    obj[item] = data[item];
  });
  return JSON.stringify(obj);
}
const SearchInput = (props: any) => {
  const {
    onChange,
    value,
    disabled,
    schema: { treeData, dependencies },
    addons: { dataPath, getFieldError, dependValues },
    allowClear,
    placeholder,
  } = props;
  const Wrapper = useContext(AgulWrapperConfigContext) as any;
  const requestHeaders = _.get(Wrapper, "requestHeaders", {}) || {};
  const [dataSource, setDataSource] = useState<any[]>([]);
  const fetch = (keyword: string) => {
    const params = treeData?.params ? treeData?.params : {};
    _.forEach(dependencies, (item, index) => {
      if (dependValues[index]) {
        _.set(params, _.last(item.split(".")) as string, dependValues[index]);
      }
    });
    _.set(
      params,
      treeData?.keywordFeild ? treeData?.keywordFeild : "keyword",
      keyword
    );
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
      })
      .catch(() => {
        setDataSource([]);
      });
  };
  const handleSearch = (newValue: string) => {
    if (newValue) {
      fetch(newValue);
    } else {
      setDataSource([]);
    }
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <Select
      status={!_.isEmpty(getFieldError(dataPath)) ? "error" : ""}
      showSearch
      style={{ width: "100%" }}
      value={value}
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={_.debounce(handleSearch, 200)}
      onChange={handleChange}
      notFoundContent={null}
      options={dataSource}
      disabled={disabled}
      allowClear={allowClear}
    />
  );
};

export default SearchInput;

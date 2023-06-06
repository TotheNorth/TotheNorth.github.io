import React, { useState, CSSProperties, useMemo, useContext } from "react";
import { Tree, message } from "antd";
import { useDeepCompareEffect } from "ahooks";
import _ from "lodash";
import NewForm from "@/agul-components/NewForm";
import { useGlobalState, useGlobalDispatch } from "@/agul-utils/context";
import request from "@/agul-utils/request";
import { AgulWrapperConfigContext } from "@/agul-utils/context";

import GloablLoading from "@/agul-methods/Loading";
import { getTreeData } from "@/agul-utils/utils";
import "./common.less";
// 获取要提交的数据
function getList(treeData: any[], targetKeys: any = []) {
  let value: any[] = [];
  _.forEach(treeData, (item) => {
    item.id = item?.key;
    if (item?.children) {
      // if (targetKeys.includes(item?.key)) {
      //   value = [...value, item];
      // }
      value = [...value, ...getList(item?.children, targetKeys)];
      delete item.chidren;
    } else {
      if (targetKeys.includes(item?.key)) {
        value = [...value, item];
      }
    }
  });
  return value;
}
const TreeWidthForm: React.FC<{
  data: any;
  style: CSSProperties;
}> = ({ data, style }) => {
  const state = useGlobalState();
  const dispatch = useGlobalDispatch();
  const mapping = _.get(data, "mapping", {});
  const url = _.get(data, "component.url");
  const path = _.get(data, "component.path");
  const defaultParams = _.get(data, "component.params", {});
  const schema = _.get(data, "component.value.formConfig.schema");
  const widgets = _.get(data, "component.value.formConfig.widgets");
  const labelFeild = _.get(data, "component.value.treeConfig.labelFeild");
  const valueFeild = _.get(data, "component.value.treeConfig.valueFeild");
  const max = _.get(data, "component.value.treeConfig.max");
  const [treeData, setTreeData] = useState<any[]>([]);
  const [showTree, setShowTree] = useState<boolean>(true);
  const Wrapper = useContext(AgulWrapperConfigContext) as any;
  const requestHeaders = _.get(Wrapper, "requestHeaders", {}) || {};
  const getData = (params: any = {}) => {
    if (_.isEmpty(params)) return;
    GloablLoading.show();
    request(url, {
      method: "get",
      params: { ...defaultParams, ..._.pickBy(params) },
      headers: { ...requestHeaders },
    })
      .then((res: any) => {
        GloablLoading.hide();
        dispatch((state: any) => ({ ...state, [mapping.tree]: [] }));
        const treeValue = _.get(res, path, []);
        setTreeData(getTreeData(treeValue, labelFeild, valueFeild));
        setShowTree(false);
        setTimeout(() => {
          setShowTree(true);
        }, 0);
      })
      .catch((err) => {
        console.error(err.message);
        GloablLoading.hide();
        setTreeData([]);
      });
  };
  const formStateValue = useMemo(() => {
    const currentValue = {};
    _.forEach(mapping.form, (x) => {
      if (_.get(state, x)) {
        _.set(currentValue, x, _.get(state, x));
      }
    });
    return currentValue;
  }, [mapping.form, state]);
  useDeepCompareEffect(() => {
    setTreeData([]);
    const params = _.pickBy(formStateValue || {});
    getData(params);
  }, [formStateValue]);
  const onCheck = (keys: string[], e: any) => {
    const {
      node: { children },
    } = e;
    const currentKeys = _.map(getList(treeData, keys), (y) => y?.uid);
    if (max < currentKeys.length) {
      if (children) {
        if (_.get(state, [mapping.tree, "length"], 0) === max) {
          message.info(
            `最多可选${max}条信号,请取消勾选其它信号后再选择该信号!`
          );
        } else {
          message.info(`最多可选${max}条信号,已自动删减!`);
        }
        dispatch((state: any) => ({
          ...state,
          [mapping.tree]: currentKeys.slice(0, max),
        }));
      } else {
        message.info(`最多可选${max}条信号,请取消勾选其它信号后再选择该信号!`);
      }
      return;
    }
    dispatch((state: any) => ({
      ...state,
      [mapping.tree]: currentKeys,
    }));
  };
  return (
    <div className="agul-tree-with-form" style={style}>
      <div className="agul-tree-with-form-box">
        <NewForm
          schema={schema}
          globalDataFeilds={mapping.form}
          widgets={widgets}
        />
      </div>
      {showTree ? (
        <Tree
          checkable
          height={600}
          defaultExpandAll
          checkedKeys={_.get(state, mapping.tree, [])}
          selectable={false}
          onCheck={onCheck as any}
          treeData={treeData}
        />
      ) : null}
    </div>
  );
};

export default TreeWidthForm;

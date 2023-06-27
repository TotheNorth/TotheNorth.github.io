import React, { useEffect, useState, useContext } from "react";
import { Descriptions, Tooltip, Table } from "antd";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import useNewRequest from "@/agul-hooks/useNewRequest";
import { timeUtcOffect, isObject } from "@/agul-utils/utils";
import { FORMAT_DATETIME } from "@/agul-utils/constant";
import VirtualTable from "@/agul-components/VirtualTable";
import GloablLoading from "@/agul-methods/Loading";
import "./index.less";

const TextStyle: any = {
  overflow: " hidden",
  whiteSpace: "nowrap",
  textOverflow: " ellipsis",
};
const RegOfUrl = /\{.*\}/g;
const { Item } = Descriptions;
const Detail: React.FC<{
  url?: string;
  dataSource?: any;
  field?: any;
  path?: string;
  method?: "get" | "post";
  params?: Record<string, string | number>;
  names?: any;
  enums?: any;
  tableConfig?: any;
  objectConfig?: any;
  init?: any;
  extraButtons: any;
  getDetailValue?: any;
}> = ({
  url,
  dataSource,
  field,
  path,
  method,
  params,
  names,
  enums,
  tableConfig,
  objectConfig,
  init = () => {},
  extraButtons = [],
  getDetailValue,
}) => {
  const RenderContent = (
    value: any,
    key: any,
    tableConfig: any,
    enums: any
  ) => {
    if (_.isArray(value)) {
      const childTable = _.get(tableConfig, [key, "childTable"]);
      const expandedRowRender = (record: any) => {
        _.forEach(
          _.isArray(childTable?.columns) ? [...childTable?.columns] : [],
          (item) => {
            const { render, format, width } = item;
            if (format) {
              item.width = width ? width : undefined;
              item.render = render
                ? render
                : (val: any) =>
                    val ? (
                      <Tooltip
                        title={timeUtcOffect(val).format(format)}
                        placement="topLeft"
                      >
                        <div
                          style={{
                            ...TextStyle,
                            width: width ? width : undefined,
                          }}
                        >
                          {timeUtcOffect(val).format(format)}
                        </div>
                      </Tooltip>
                    ) : (
                      "-"
                    );
            } else {
              item.width = width ? width : undefined;
              item.render = render
                ? render
                : (val: any) => (
                    <Tooltip title={val} placement="topLeft">
                      <div
                        style={{
                          ...TextStyle,
                          width: width ? width : undefined,
                        }}
                      >
                        {val}
                      </div>
                    </Tooltip>
                  );
            }
          }
        );
        return (
          <div style={{ paddingLeft: 70 }}>
            <Table
              dataSource={record[childTable?.field] || []}
              columns={
                _.isArray(childTable?.columns) ? [...childTable?.columns] : []
              }
              pagination={false}
              size="small"
            />
          </div>
        );
      };
      const expandable = {
        expandedRowRender,
        defaultExpandedRowKeys: ["0"],
      };
      if (childTable) {
        _.forEach(currentData, (item, index) => {
          item.key = index.toString();
        });
      }
      return (
        <VirtualTable
          scroll={{ y: 300 }}
          dataSource={value}
          columns={_.get(tableConfig, [key, "columns"], [])}
          expandable={childTable ? expandable : undefined}
        />
      );
    } else if (isObject(value)) {
      return (
        <div>
          <br />
          <Descriptions column={1}>
            {_.map(value, (item, y) => {
              return objectConfig[key]?.names[y] ? (
                <Item label={<div>{objectConfig[key]?.names[y]}</div>}>
                  {RenderContent(
                    item,
                    y,
                    objectConfig[key]?.tableConfig,
                    enums
                  )}
                </Item>
              ) : null;
            })}
          </Descriptions>
        </div>
      );
    } else {
      return (
        <pre>
          {_.get(enums, [key])
            ? _.get(enums, [key, value])
            : _.includes(key, "Time") && value
            ? timeUtcOffect(value).format(FORMAT_DATETIME)
            : value}
        </pre>
      );
    }
  };
  const [currentData, setCurrentData] = useState<any>(dataSource || {});
  useEffect(() => {
    if (_.isFunction(getDetailValue)) {
      getDetailValue(currentData);
    }
  }, [currentData]);
  const location = useLocation();
  const request = useNewRequest();
  const getData = () => {
    if (!url) {
      return;
    }
    const paramObj = _.get(location, ["query"]);
    const detailUrl = url.replaceAll(RegOfUrl, _.get(paramObj, [field]));
    // GloablLoading.show();
    const reqData = {
      method: method || "get",
    };
    const data = { ...params };
    if (!RegOfUrl.test(url)) {
      _.set(data, field, _.get(paramObj, [field]));
    }
    if (method === "post") {
      _.set(reqData, "data", data);
    } else {
      _.set(reqData, "params", data);
    }
    request(detailUrl, reqData)
      .then((res: any) => {
        // GloablLoading.hide();
        const newDetail = _.get(res, path as string);
        if (newDetail) {
          if (_.isFunction(init)) {
            init(newDetail);
          }
          setCurrentData(newDetail);
        }
      })
      .catch((err) => {
        // GloablLoading.hide();
        setCurrentData({});
        console.error(err.message);
      });
  };
  useEffect(() => {
    if (url) {
      getData();
    }
  }, [url]);
  return (
    <div className="agul-new-detail">
      <Descriptions column={1}>
        {_.map(names, (item, key) => (
          <Item label={<div>{item}</div>}>
            {RenderContent(currentData[key], key, tableConfig, enums)}
          </Item>
        ))}
      </Descriptions>
      <div className="agul-detail-btn-box">
        {_.isArray(extraButtons) ? extraButtons : null}
      </div>
    </div>
  );
};

export default Detail;

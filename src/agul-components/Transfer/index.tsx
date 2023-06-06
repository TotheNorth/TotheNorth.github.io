import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
  useLayoutEffect,
} from "react";
import { Tree, Checkbox, Input, Button } from "antd";
import {
  RightCircleTwoTone,
  LeftCircleTwoTone,
  LeftCircleOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import "./index.less";

const { TreeNode } = Tree;
function renderTreeNodes(data: any, searchValue: string) {
  return data.map((item: any, index: number) => {
    if (item.children) {
      return (
        <TreeNode
          title={
            searchValue && _.includes(item?.title, searchValue) ? (
              <span style={{ color: "red" }}>{item?.title}</span>
            ) : (
              item?.title
            )
          }
          key={item?.key}
          selectable={false}
          checkable={true}
        >
          {renderTreeNodes(item.children, searchValue)}
        </TreeNode>
      );
    }
    return (
      <TreeNode
        title={
          searchValue && _.includes(item?.title, searchValue) ? (
            <span style={{ color: "red" }}>{item?.title}</span>
          ) : (
            item?.title
          )
        }
        key={item?.key}
        selectable={false}
      />
    );
  });
}
function getLeftTreeData(
  treeData: any[],
  targetKeys: string[] | number[],
  serachValue?: string
): any[] {
  const value: any[] = [];
  _.forEach(_.cloneDeep(treeData), (item) => {
    if (item?.children) {
      let arr = [];
      if (_.includes(item?.title, serachValue)) {
        arr = getLeftTreeData(item.children, targetKeys);
        if (arr.length) {
          if (serachValue) {
            item.title = <span style={{ color: "red" }}>{item.title}</span>;
          }
          item.children = arr;
          value.push(item);
        }
      } else {
        arr = getLeftTreeData(item.children, targetKeys, serachValue);
        if (arr.length) {
          item.children = arr;
          value.push(item);
        }
      }
    } else if (
      !_.includes(targetKeys, item.key) &&
      (!serachValue || _.includes(item?.title, serachValue))
    ) {
      if (serachValue && _.includes(item?.title, serachValue)) {
        item.title = <span style={{ color: "red" }}>{item.title}</span>;
      }
      value.push(item);
    }
  });
  return value;
}
function getRightTreeData(
  treeData: any[],
  targetKeys: string[] | number[],
  serachValue?: string
): any[] {
  const value: any[] = [];
  _.forEach(_.cloneDeep(treeData), (item) => {
    if (item?.children) {
      let arr = [];
      if (_.includes(item?.title, serachValue)) {
        arr = getRightTreeData(item.children, targetKeys);
        if (arr.length) {
          if (serachValue) {
            item.title = <span style={{ color: "red" }}>{item.title}</span>;
          }
          item.children = arr;
          value.push(item);
        }
      } else {
        arr = getRightTreeData(item.children, targetKeys, serachValue);
        if (arr.length) {
          item.children = arr;
          value.push(item);
        }
      }
    } else if (
      _.includes(targetKeys, item?.key) &&
      (!serachValue || _.includes(item?.title, serachValue))
    ) {
      if (serachValue && _.includes(item?.title, serachValue)) {
        item.title = <span style={{ color: "red" }}>{item.title}</span>;
      }
      value.push(item);
    }
  });
  return value;
}
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
const Transfer: React.FC<{
  treeData: any;
  targetKeys: any;
  type?: "list" | "tree";
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (data: any[]) => void;
  updateMark?: any;
}> = ({
  treeData = [],
  targetKeys = [],
  disabled = false,
  readOnly = false,
  onChange,
  type = "tree",
}) => {
  const [currentTargetKeys, setCurrentTargetKeys] = useState<any>(
    _.map(targetKeys, (item) => item?.key)
  );
  useEffect(() => {
    setCurrentTargetKeys(_.map(targetKeys, (item) => item?.key || item?.id));
  }, [targetKeys]);
  const [leftCheckedKeys, setLeftCheckedKeys] = useState<string[] | number[]>(
    []
  );
  const [rightCheckedKeys, setRightCheckedKeys] = useState<string[] | number[]>(
    []
  );
  const [leftAllChecked, setLeftAllChecked] = useState<boolean>(false);
  const [rightAllChecked, setRightAllChecked] = useState<boolean>(false);
  const [leftSearchValue, setLeftSearchValue] = useState<string>("");
  const [rightSearchValue, setRightSearchValue] = useState<string>("");
  // list情况 begin
  const leftTreeData = useMemo(() => {
    return _.cloneDeep(treeData);
  }, [treeData]);
  const rightTreeData = useMemo(() => {
    return _.cloneDeep(treeData);
  }, [treeData]);
  const rightListData = useMemo(() => {
    return getList(rightTreeData, currentTargetKeys);
  }, [rightTreeData, currentTargetKeys]);
  // list情况 over
  const paste = () => {
    navigator.clipboard.readText().then((val) => {
      val = val.replace(/\r\n|\r/g, "\n");
      let str: string[] = val.split("\n");
      let arr = new Array(str.length - 1);
      for (let i = 0; i < str.length - 1; i++) {
        let temp = str[i].split("\t");
        arr[i] = temp;
      }
      if (onChange) {
        onChange(
          getList(treeData, [
            ...currentTargetKeys,
            ..._.map(arr, (item) => _.get(item, [0])),
          ])
        );
      }
    });
    // pasteImageRef.current?.dispatchEvent(new Event("paste"))
    console.log("22222222222222222");
  };
  // 全选
  const leftAllCheck = () => {
    setLeftAllChecked((state) => !state);
  };
  const rightAllCheck = () => {
    setRightAllChecked((state) => !state);
  };
  // 右移
  const toRight = (keys: any) => {
    setLeftAllChecked(false);
    setRightAllChecked(false);
    setLeftCheckedKeys([]);
    setRightCheckedKeys([]);
    if (onChange) {
      onChange(getList(treeData, [...currentTargetKeys, ...keys]));
    }
  };
  // 左移
  const toLeft = (keys: any) => {
    setLeftAllChecked(false);
    setRightAllChecked(false);
    setLeftCheckedKeys([]);
    setRightCheckedKeys([]);
    if (onChange) {
      onChange(
        getList(
          treeData,
          _.filter(currentTargetKeys, (item) => {
            return !_.includes(keys, item);
          })
        )
      );
    }
  };
  const leftSearchChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setLeftSearchValue(_.trim(value));
  };
  const rightSearchChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setRightSearchValue(_.trim(value));
  };
  // todo:如何优化defaultExpandAll失效的情况
  const [showTree, setShowTree] = useState(true);
  useEffect(() => {
    setShowTree(false);
    setTimeout(() => {
      setShowTree(true);
    }, 0);
  }, [currentTargetKeys]);
  return (
    <div className="agul-transfer">
      <div className="agul-transfer-left">
        <div className="agul-transfer-title">
          {readOnly || true ? null : (
            <Checkbox
              disabled={disabled}
              checked={leftAllChecked}
              onChange={() => leftAllCheck()}
            />
          )}
          <span>待采集数据</span>
          {readOnly ? null : (
            <Input
              style={{ width: 250 }}
              size="small"
              onChange={leftSearchChange}
              allowClear
              disabled={disabled}
            />
          )}
        </div>
        <div className="agul-transfer-content">
          {_.isEmpty(treeData) ? null : showTree ? (
            <Tree
              checkable
              height={400}
              defaultExpandAll
              checkedKeys={leftCheckedKeys}
              selectable={false}
              onCheck={(checkedKeys) => {
                setLeftCheckedKeys(checkedKeys as any[]);
              }}
            >
              {renderTreeNodes(
                getLeftTreeData(treeData, currentTargetKeys),
                leftSearchValue
              )}
            </Tree>
          ) : null}
        </div>
      </div>
      <div className="agul-transfer-center">
        {leftCheckedKeys?.length && !readOnly && !disabled ? (
          <RightCircleTwoTone
            className="agul-transfer-center-button"
            onClick={() => toRight(leftCheckedKeys)}
          />
        ) : (
          <RightCircleOutlined className="agul-transfer-center-disabled-button" />
        )}
        {rightCheckedKeys?.length && !readOnly && !disabled ? (
          <LeftCircleTwoTone
            className="agul-transfer-center-button"
            onClick={() => toLeft(rightCheckedKeys)}
          />
        ) : (
          <LeftCircleOutlined className="agul-transfer-center-disabled-button" />
        )}
      </div>
      <div className="agul-transfer-right">
        {type === "tree" ? (
          <>
            <div className="agul-transfer-title">
              {readOnly || true ? null : (
                <Checkbox
                  checked={rightAllChecked}
                  onChange={() => rightAllCheck()}
                />
              )}
              <span>已采集数据</span>
              {readOnly ? null : (
                <Input
                  style={{ width: 250 }}
                  size="small"
                  onChange={rightSearchChange}
                  allowClear
                  disabled={disabled}
                />
              )}
              <Button onClick={paste} style={{ float: "right" }}>
                采集数据粘贴
              </Button>
            </div>
            <div className="agul-transfer-content">
              {_.isEmpty(treeData) ? null : showTree ? (
                <Tree
                  checkable
                  height={400}
                  defaultExpandAll
                  checkedKeys={rightCheckedKeys}
                  selectable={false}
                  onCheck={(checkedKeys) => {
                    setRightCheckedKeys(checkedKeys as any[]);
                  }}
                >
                  {renderTreeNodes(
                    getRightTreeData(treeData, currentTargetKeys),
                    rightSearchValue
                  )}
                </Tree>
              ) : null}
            </div>
          </>
        ) : (
          <div>
            <div className="agul-transfer-title">
              <span>已采集数据</span>
            </div>
            {_.map(rightListData, (item) => (
              <div className="agul-transfer-list">
                {readOnly ? (
                  <span>{item.title}</span>
                ) : (
                  <Checkbox
                    disabled={disabled}
                    onChange={(e: CheckboxChangeEvent) =>
                      setRightCheckedKeys((state) => {
                        if (e.target.checked) {
                          return [...state, item.key];
                        } else {
                          return _.filter(state, (x) => x !== item.key);
                        }
                      })
                    }
                  >
                    {item.title}
                  </Checkbox>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transfer;

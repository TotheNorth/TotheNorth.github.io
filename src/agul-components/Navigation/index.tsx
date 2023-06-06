import React, { CSSProperties } from "react";
import _ from "lodash";
import { Breadcrumb } from "antd";
import "./index.less";
import IconImg from "../../agul-assets/imgs/ic_bctitle.png";

const { Item } = Breadcrumb;

type RouterProps = Array<{ name: string; path: string }>;
const Navigation: React.FC<{
  routes: RouterProps;
  style?: CSSProperties;
}> = ({ routes, style }) => {
  return (
    <Breadcrumb style={style} className="agul-ui-navigation-container">
      <div
        className="agul-ui-navigation-icon"
        style={{ backgroundImage: `url(${IconImg})` }}
      ></div>
      {_.map(routes, (item) => (
        <Item>
          <a href={item.path ? item.path : "javascript:void(0)"}>{item.name}</a>
        </Item>
      ))}
    </Breadcrumb>
  );
};

export default Navigation;

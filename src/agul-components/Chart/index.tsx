import _ from "lodash";
import { Tabs } from "antd";
import Content from "./Content";
import "./styles.less";

const { TabPane } = Tabs;
const Chart: React.FC<{
  multiple?: boolean;
  multipleConfig?: Record<string, any>[];
  option?: any;
  getOption?: any;
  url?: string;
  path?: string;
  method?: "get" | "post";
  params?: any;
  formConfig?: any;
}> = ({
  multiple = false,
  multipleConfig = [],
  option,
  getOption,
  url = "",
  path = "data",
  method = "get",
  params = {},
  formConfig = {},
}) => {
  return (
    <div className="agul-chart-container">
      {multiple ? (
        <Tabs defaultActiveKey="0">
          {_.map(multipleConfig, (item) => (
            <TabPane tab={item?.title} key={`${item?.title}`}>
              <Content {...item} />
            </TabPane>
          ))}
        </Tabs>
      ) : (
        <Content
          option={option}
          getOption={getOption}
          url={url}
          path={path}
          method={method}
          params={params}
          formConfig={formConfig}
        />
      )}
    </div>
  );
};
export default Chart;

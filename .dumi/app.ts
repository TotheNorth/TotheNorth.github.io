import React from "react";
import { ConfigProvider } from "@iauto/react-ui";
export function rootContainer(container: any) {
  return React.createElement(
    ConfigProvider,
    {
      requestHeaders: { "x-user-id": "1" },
      needReqSign: false,
      loadingContainerId: "agul-ui-root",
    },
    React.createElement(
      "div",
      {
        id: "agul-ui-root",
        // style: { padding: 20 },
      },
      container
    )
  );
}

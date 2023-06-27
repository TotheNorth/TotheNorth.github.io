/**

* Copyright @ 2023 iAuto (Shanghai) Co., Ltd.

* All Rights Reserved.

*

* Redistribution and use in source and binary forms, with or without

* modification, are NOT permitted except as agreed by

* iAuto (Shanghai) Co., Ltd.

*

* Unless required by applicable law or agreed to in writing, software

* distributed under the License is distributed on an "AS IS" BASIS,

* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

*/

/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from "umi-request";
import _ from "lodash";
import { useContext } from "react";
import Message from "@/agul-methods/Message";
import { AgulWrapperConfigContext } from "@/agul-utils/context";
import { HttpMethodEnum, requestTypeEnum } from "@/agul-enums/http";
import { signType } from "@/agul-utils/constant";
import { useLocation, useNavigate } from "react-router-dom";
import {
  genHeader,
  getParamsToSortStr,
  getTimeStamp,
  getUserIdByJwtToken,
  paramsToSortStr,
  postParamToShaStr,
  randomStr,
  SHA,
  signTmp,
} from "@/agul-utils/rules";
import { getQuerys } from "@/agul-utils/utils";

const notice = (status: number, url: string, errorText: string) => {
  if (process.env.NODE_ENV === "development") {
    Message.error({
      title: `${status}:${url}`,
      subTitle: errorText,
    });
  } else {
    if (errorText) {
      Message.error({ title: errorText });
    }
  }
};

/**
 * @description 业务异常和服务器异常处理程序
 * @returns 错误
 */
type RequestParams = {
  extraHeaders?: Record<string, string | number>;
  needSign?: boolean;
};
export default ({ extraHeaders = {}, needSign }: RequestParams = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const errorHandler = async (error: any) => {
    const { response } = error;
    if (response) {
      const { status, url } = response;
      const { pathname } = location;
      let body: any;
      let errorText: string = "";
      try {
        body = await response.json();
      } catch {
        body = response;
      }
      if (process.env.NODE_ENV === "development") {
        errorText = body?.error?.message || error?.response?.statusText;
      } else {
        errorText = body?.error?.message || body?.error?.error || body?.error;
      }
      if (status === 401) {
        if (pathname === "/login") {
          notice(status, url, errorText);
        } else {
          navigate(`/login?redirect_url=${window.location.href}`);
        }
      }
      notice(status, url, errorText);
    } else {
      Message.error({ title: "服务器异常" });
    }

    return Promise.reject(error);
  };

  const Wrapper = useContext(AgulWrapperConfigContext) as any;
  const requestHeaders = _.get(Wrapper, "requestHeaders", {}) || {};
  const needReqSign = _.get(Wrapper, "needReqSign");
  if (needSign === undefined) {
    if (!_.isNil(needReqSign)) {
      needSign = needReqSign;
    } else {
      needSign = true;
    }
  }
  /**
   * 配置request请求时的默认参数
   */
  const request = extend({
    // prefix: "/api",
    errorHandler, // 默认错误处理
    // credentials: "include", // 默认请求是否带上cookie
    headers: { ...requestHeaders, ...extraHeaders },
  });
  /**
   * request 拦截器
   * options: RequestOptionsInit
   */
  request.interceptors.request.use(
    (url, options) => {
      const userid = getUserIdByJwtToken(); //
      const { method, headers, requestType, data } = options;
      let { params } = options;
      params = { ...getQuerys(url), ...params };
      let encryptionHeaders = {};
      if (needSign) {
        const timestamp = getTimeStamp();
        const nonce = randomStr();
        let paramsStr = "param={}";
        if (method === HttpMethodEnum.get) {
          paramsStr = getParamsToSortStr(params as URLSearchParams);
        }
        if (
          method === HttpMethodEnum.post ||
          method === HttpMethodEnum.put ||
          method === HttpMethodEnum.delete
        ) {
          paramsStr =
            requestType === requestTypeEnum.form
              ? paramsToSortStr(data)
              : postParamToShaStr(data);
        }
        const result = signTmp(paramsStr, timestamp, nonce);
        encryptionHeaders = genHeader(
          timestamp,
          nonce,
          signType,
          SHA(result, userid)
        );
      }
      options.headers = {
        ...headers,
        ...encryptionHeaders,
      };
      return {
        url,
        options: { ...options, interceptors: true },
      };
    },
    { global: false }
  );
  /**
   * response拦截器
   * options: RequestOptionsInit
   */
  request.interceptors.response.use(
    async (response: Response) => {
      return response;
    },
    { global: false }
  );
  return request;
};

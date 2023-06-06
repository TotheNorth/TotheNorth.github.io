import Message from "@/agul-methods/Message";
import { extend } from "umi-request";

const codeMessage: any = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};

/**
 * 业务异常和服务器异常处理程序
 */
const errorHandler = async (error: any): Promise<Response> => {
  const { response } = error;
  if (response?.status === 500) {
    const body = await response.json();
    if (body.error.code === "business.home.protocol.update.status.err") {
      return body;
    }
    Message.error({
      title: body?.error.message,
    });
  } else if (response?.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    Message.error({
      title: `请求错误 ${status}: ${url}`,
      subTitle: errorText,
    });
  } else if (!response) {
    Message.error({
      title: "网络异常",
      subTitle: "您的网络发生异常，无法连接服务器",
    });
  }
  console.error(error);
  throw error;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  prefix: "",
  errorHandler, // 默认错误处理
  // credentials: "include", // 默认请求是否带上cookie
});

/**
 * request拦截器
 * options: RequestOptionsInit
 */
request.interceptors.request.use((url, options) => {
  return {
    url,
    options: { ...options, interceptors: true },
  };
});

/**
 * response拦截器
 * options: RequestOptionsInit
 */
request.interceptors.response.use(async (response: Response) => {
  return response;
});

export default request;

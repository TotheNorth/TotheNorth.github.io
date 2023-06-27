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
 * @description: http method
 */
export enum HttpMethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTION = 'OPTION',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  get = 'get',
  post = 'post',
  put = 'put',
  delete = 'delete',
}

export enum requestTypeEnum {
  json = 'json',
  form = 'form',
}
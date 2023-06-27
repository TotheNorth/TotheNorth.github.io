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

// 分类；  默认：查全部，0：视频分辨率，1：视频帧率；2：雷达类型；3：log级别；4：启用停用flag；5：上传方式；6：触发方式；7：域控列表；8：存储类型
export enum DictionaryEnum {
  resolution = 0,
  frame,
  radar,
  log,
  flag,
  upload,
  trigger,
  controller,
  storage,
}

// 编号（类型  can:CAN数据、soa:SOA数据、app_track:应用埋点、pcap:网络抓包、radar:雷达点云、log:日志、video:视频）
export enum CodeEnum {
  can = 'can',
  soa = 'soa',
  app_track = 'app_track',
  pcap = 'pcap',
  radar = 'radar',
  log = 'log',
  video = 'video',
  edge_compute = 'edge_compute',
}

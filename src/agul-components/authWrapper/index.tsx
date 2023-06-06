/**

 Copyright @ 2020 - 2027 iAuto Software(Shanghai) Co., Ltd.

 All Rights Reserved.

 *

 Redistribution and use in source and binary forms, with or without

 modification, are NOT permitted except as agreed by

 iAuto Software(Shanghai) Co., Ltd.

 *

 Unless required by applicable law or agreed to in writing, software

 distributed under the License is distributed on an “AS IS” BASIS,

 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

 */
import { ReactElement } from 'react';

// 要么传进来完整的权限对象
// 要么直接传true false
interface IProps {
    access: Record<string, boolean> | boolean;
    children: ReactElement;
}

export default ({ access, children }: IProps) => {
    if (typeof access === 'boolean') {
        return access ? <>{children}</> : null;
    } else {
        const id = children?.props?.id;
        if (id) {
            if (access?.[id]) {
                return <>{children}</>;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
};

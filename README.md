# v4 => v5

antd v4升级到v5版本
参考资料：https://ant.design/docs/react/migration-v4-v5-cn

1. 升级依赖
2. 兼容4和5同时使用

必需：
  - 使用`ConfigProvider`增加`prefixCls`前缀隔离
  - 编辑、调试样式插入点配置 使用`StyleProvider`并获取`shadowRoot`
```typescript
let shadowRoot: ShadowRoot | undefined = void 0;
if (env?.runtime?.debug || !env?.runtime) {
  // 编辑、调试在ShadowRoot上获取样式
  const geoWebview = document.querySelector("#_mybricks-geo-webview_");
  shadowRoot = geoWebview?.shadowRoot || void 0;
}

<StyleProvider container={shadowRoot}>
  <MyApp>
</StyleProvider>
```
  - 弹出层配置挂载点，如日历`getPopupContainer`等，`() => env?.canvasElement || document.body`
  - 打包不external掉antd

非必需：
  - 样式对齐，安装`@ant-design/compatible`，使用v4的主题包`ConfigProvider`中`theme`
  - 组件多语言 使用`ConfigProvider的locale`，如果需要继续使用moment还需要在打包配置中增加@ant-design/moment-webpack-plugin插件
```typescript
// dayjs同样
import locale from "antd/locale/zh_CN";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

<ConfigProvider theme={defaultTheme} prefixCls="ant5" locale={locale}>
  {/* {StyleProvider负责获取搭建调试时隔离样式} */}
  <StyleProvider container={shadowRoot}>
    <MyApp>
  </StyleProvider>
</ConfigProvider>
````
  
  
3. 完整配置例子
```typescript
import React, { useEffect, useState } from "react";
import type { DatePickerProps } from "antd";
import { DatePicker, ConfigProvider } from "antd";

// 搭建、调试样式挂载点
import { StyleProvider } from "@ant-design/cssinjs";
// 默认主题
import { defaultTheme } from "@ant-design/compatible";

import moment, { Moment } from "moment";
import type { Dayjs } from "dayjs";

// 国际化
import locale from "antd/locale/zh_CN";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

import { Data } from "./constants";

const App = (props: RuntimeParams<Data>) => {
  const { data, inputs, outputs, env } = props;
  const { multiple, size } = data;

  const [defaultValue, setDefaultValue] = useState<Array<any>>([]);

  // 画布渲染的shadowRoot
  let shadowRoot: ShadowRoot | undefined = void 0;
  if (env?.runtime?.debug || !env?.runtime) {
    // 编辑、调试在ShadowRoot上获取样式
    const geoWebview = document.querySelector("#_mybricks-geo-webview_");
    shadowRoot = geoWebview?.shadowRoot || void 0;
  }

  useEffect(() => {
    if (env?.runtime) {
      // 输入
      inputs["defaultValue"] &&
        inputs["defaultValue"]((value: string[]) => {
          setDefaultValue(value.map((item) => moment(item)));
        });
    }
  }, []);

  const onChange: DatePickerProps<Dayjs[]>["onChange"] = (date, dateString) => {
    setDefaultValue(date);
    console.log(date, dateString);
    // 输出
    outputs["onChange"] && outputs["onChange"](dateString);
  };

  return (
    // ConfigProvider 负责隔离样式和对齐v4主题
    <ConfigProvider theme={defaultTheme} prefixCls="ant5" locale={locale}>
      {/* {StyleProvider负责获取搭建调试时隔离样式} */}
      <StyleProvider container={shadowRoot}>
        <DatePicker
          multiple={multiple}
          onChange={onChange}
          maxTagCount="responsive"
          value={defaultValue}
          size={size}
          getPopupContainer={() => env?.canvasElement || document.body} // 弹层挂载点
        />
      </StyleProvider>
    </ConfigProvider>
  );
};

export default App;
```
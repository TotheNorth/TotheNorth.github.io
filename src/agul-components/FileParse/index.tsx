import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { useEffect, useState } from "react";
import GloablLoading from "@/agul-methods/Loading";

const FileParse: React.FC<{
  url: string;
  method?: string;
  params?: object;
}> = ({ url, method, params = {}, ...otherProps }) => {
  const [data, setData] = useState<any>("");
  useEffect(() => {
    if (url) {
      const options: any = {};
      if (method === "post") {
        options.method = "post";
        options.body = JSON.stringify(params);
      }
      GloablLoading.show();
      fetch(url, options)
        .then((res) => res.text())
        .then((res) => {
          GloablLoading.hide();
          setData(res);
        })
        .catch((err) => {
          console.error(err.message);
          setData("");
          GloablLoading.hide();
        });
    }
  }, [url]);
  return (
    <CodeMirror
      value={data || ""}
      readOnly
      minHeight="200px"
      width="100%"
      extensions={[json()]}
      {...otherProps}
    />
  );
};

export default FileParse;

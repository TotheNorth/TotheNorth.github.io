import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { useEffect, useState } from "react";
import GloablLoading from "@/agul-methods/Loading";
import useNewRequest from "@/agul-hooks/useNewRequest";

const FileParse: React.FC<{
  url: string;
  method?: string;
  params?: object;
}> = ({ url, method, params = {}, ...otherProps }) => {
  const [data, setData] = useState<any>("");
  const request = useNewRequest();
  useEffect(() => {
    if (url) {
      const options: any = {
        responseType: "text",
        prefix: "",
      };
      if (method === "get" || !method) {
        options.method = "get";
        options.params = params;
      } else {
        options.method = "post";
        options.data = params;
      }
      GloablLoading.show();
      request(url, options)
        .then((res: any) => {
          setData(res);
        })
        .catch((err: any) => {
          console.error(err.message);
          setData("");
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

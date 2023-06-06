import CodeMirror from "@uiw/react-codemirror";
import _ from "lodash";
import type { CompletionContext } from "@codemirror/autocomplete";
import { ayuLight } from "thememirror";
import { autocompletion } from "@codemirror/autocomplete";
import "./CodeEditor.less";
function myCompletions(context: CompletionContext) {
  let word: any = context.matchBefore(/\w*/);
  console.log(word);
  if (word.from === word.to && !context.explicit) return null;
  return {
    from: word.from,
    options: [
      { label: "match", type: "keyword" },
      { label: "hello", type: "variable", info: "(World)" },
      { label: "magic", type: "text" },
    ],
  };
}

const JsonEditor = (props: any) => {
  const { disabled, readOnly, value, onChange } = props;
  const placeholder = _.get(
    props,
    "schema.props.placeholder",
    "请填入指定格式的数据"
  );
  return (
    <div className="agul-ui-newform-widget-code-editor">
      <CodeMirror
        value={value || ""}
        editable={!disabled && !readOnly}
        height="200px"
        maxHeight="400px"
        placeholder={placeholder}
        width="100%"
        onChange={onChange}
        className="code-editor-content"
        extensions={[ayuLight, autocompletion({ override: [myCompletions] })]}
      />
    </div>
  );
};
export default JsonEditor;

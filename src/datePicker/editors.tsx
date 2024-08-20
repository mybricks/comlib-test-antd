import { Data } from "./constants";

export default {
  "@init"({ style }) {
    style.hight = "auto";
  },
  "@resize": {
    options: ["width", "height"],
  },
  ":root": {
    style: [],
    items: [
      {
        title: "多选",
        type: "Switch",
        value: {
          get({ data }: EditorResult<Data>) {
            return data?.multiple;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.multiple = value;
          },
        },
      },
      {
        title: "大小",
        type: "Select",
        options: [
          { value: "small", label: "小" },
          { value: "middle", label: "中" },
          { value: "large", label: "大" },
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.size;
          },
          set({ data }: EditorResult<Data>, value: Data["size"]) {
            data.size = value;
          },
        },
      },
      {
        title: "值更新",
        type: "_event",
        options: {
          outputId: "onChange",
        },
      },
    ],
  },
};

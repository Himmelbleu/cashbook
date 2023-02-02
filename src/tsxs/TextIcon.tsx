import { defineComponent, resolveComponent, h } from "vue";

function isText(props: any) {
  if (props.text) {
    return (
      <div class="text mt-1" style={{ fontSize: props.textSize + "rem" }}>
        {props.text}
      </div>
    );
  }
}

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: ""
    },
    iconSize: {
      type: Number,
      default: 1
    },
    textSize: {
      type: Number,
      default: 1
    }
  },
  setup(props, ctx) {
    const elIcon = resolveComponent(props.icon);
    return () => (
      <div class="i-icon text-center">
        <div class="f-c-c">
          <el-icon style={{ fontSize: props.iconSize + "rem" }}>{h(elIcon)}</el-icon>
        </div>
        {isText(props)}
      </div>
    );
  }
});

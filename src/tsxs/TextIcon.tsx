import { defineComponent, resolveComponent, h } from "vue";

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  setup(props, ctx) {
    const elIcon = resolveComponent(props.icon);
    return () => (
      <div class="i-icon text-center">
        <div class="f-c-c">
          <el-icon>{h(elIcon)}</el-icon>
        </div>
        <div class="text">{props.text}</div>
      </div>
    );
  }
});

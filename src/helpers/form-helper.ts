import type { FormInstance } from "element-plus";

export const onSubmit = async (formEl: FormInstance | undefined, pass?: Function, error?: Function) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      pass && pass();
    } else {
      error && error();
    }
  });
};

export const validateMoney = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("请输入正确格式的金额！"));
  }
  setTimeout(() => {
    const numLen = value.toString().length;
    if (!(numLen >= 1 && numLen <= 20)) {
      callback(new Error("金额在 1~20 位数！"));
    } else {
      callback();
    }
  }, 20);
};

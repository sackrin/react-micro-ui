type GetMicroUiEnv = (name: string) => string;

const getMicroUiEnv: GetMicroUiEnv = name => window[`__MicroUI${name}Environment__`] || {};

export default getMicroUiEnv;

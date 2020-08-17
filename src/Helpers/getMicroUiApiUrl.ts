type GetMicroUiApiUrl = (name: string) => string;

const getMicroUiApiUrl: GetMicroUiApiUrl = name => window[`__MicroUI${name}URL__`];

export default getMicroUiApiUrl;

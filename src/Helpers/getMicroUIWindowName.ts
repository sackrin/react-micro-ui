type GetMicroUIWindowName = (type: string, path: string, prefix: string) => string;

const getMicroUIWindowName: GetMicroUIWindowName = (type, path, prefix) => `__${prefix}_${path}_${type}__`;

export default getMicroUIWindowName;

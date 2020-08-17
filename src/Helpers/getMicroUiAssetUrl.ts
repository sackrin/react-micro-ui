type GetMicroUiAssetUrl = (name: string) => string;

const getMicroUiAssetUrl: GetMicroUiAssetUrl = name => window[`__MicroUI${name}AssetURL__`];

export default getMicroUiAssetUrl;

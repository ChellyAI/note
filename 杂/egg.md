### 目录

待补充

### 更改内容

- extends/helper/appHttp.js
  - 替换了InvokeRequest函数的请求头中user-agent、uuid、deviceType、systemVersion、appVersion、numVersion、dzvisit、uid、token、sessionId、hand2

- extends/helper/utils.js
  - 替换了signDictionary函数的uid、token

- service/product.js
  - 替换了getDetails函数，请求方式从this.ctx.helper.GET改为this.ctx.helper.APPPOST；请求地址从this.config._by.api.mapi.product.details改为'https://appapi.biyao.com/production/info/getProductDetail.do'

- service/editor/detail.js
  - 替换了togetherGroup函数，请求地址从this.config._by.appapi.mapi.production.togetherGroup改为'https://appapi.biyao.com/production/group/getTogetherGroupProductEditorData.do'
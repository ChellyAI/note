用起来倒没啥太大区别，由于都是返回的Promise对象，因此可以直接链式调用；
```js
import axios from 'axios';

axios.post(
  '/some/url',
  {
    params,
})
  .then((response) => {
    //  some code
  })
//  或者
axios({
  method: 'post',
  url: 'some/url',
  params,
})
  .then((response) => {
    //  some code
  })
```
```js
import fetch from 'dva/fetch';

fetch(url, options).then((response) => {
  //  some code
})
```

比较友好的方式是用async/await来获取response，更直观
```js
await fetch(url, options);
```

通过管道操作符对response作处理也未尝不可
```js
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error();

  error.name = response.status;
  error.response = response;
  throw error;
}

const resolvedResponse await fetch(url, options) |> checkStatus
```

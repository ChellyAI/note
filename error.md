#### 一、前置内容

index.js文件中引入了pages/test/error文件

error文件中，引入了errorHander（handler）文件的setJSExceptionHandler函数、errorfetch文件中的postErrorHandler函数。

setJSExceptionHandler函数用于将JS代码的错误捕获，并上报。

postErrorHandler函数就是用于将捕获的请求错误上报的函数。

```javascript
/*
 * 错误捕获网络请求方法封装
 * 作者：liuxinyu
 * 时间：2021.02.20
 * 参数：
 *    type      错误码 说明：40001 js错误 40002 异步错误 40003 jsBrigde错误 40004 原生模块错误 40005 其他错误
 * 		errMsg    错误信息
 *
 */
import {Platform} from 'react-native';

const postErrorHandler = async (type, errMsg) => {
  let res = await fetch('https://cerpn.biyao.com/report', {
    method: 'POST',
    headers: {
      platform: Platform.OS === 'ios' ? 'iOS' : 'Android',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `errorCode=${type}&errorMsg=${errMsg}`,
  });
  console.log(res);
};
```

error文件中，还定义了一个异步请求捕获错误并上报的逻辑。调用了node_modules中promise/setimmediate/rejection-tracking，

#### 二、问题

在RN监控中，偶尔能看见一个不分android以及iOS平台的报错，其errorMessage为

```
undefined is not an object (evaluating 'n.line')
```

报错的JSBundle文件中的代码指向为'n.line'：

```javascript
__d(function(g,r,i,a,m,e,d){
  var n=r(d[0]),
  o=r(d[1]),
  s=o(r(d[2])),
  t=(n(r(d[3])),r(d[4]),r(d[5])),
  u=o(r(d[6]));

  (0,t.setJSExceptionHandler)(function(n){
    var o,t;

    return s.default.async(function(l){
      for(;;)
      switch(l.prev=l.next){
        case 0:
          return l.next=2,s.default.awrap(BYBaseInfo.getSystemInfo());

        case 2:
          o=l.sent,
          t="Error:errorposition: "+n.line+","+n.column+",\n                errormessage: "
          +n.message+",\n                baseInfo: uuid--"+o.uuid
          +" deviceType-- "+o.deviceType+" systemVersion-- "+o.systemVersion
          +"  appVersion-- "+o.appVersion+" numVersion-- "+o.numVersion
          +",\n                errorurl: "+n.sourceURL,(0,u.default)(40001,t);

        case 5:case"end":return l.stop()
      }
    },null,null,null,Promise)
  },!1),r(d[7]).enable({
    allRejections:!0,
    onUnhandled:function(n){
      var o,t,l,c=arguments;

      return s.default.async(function(n){
        for(;;)
        switch(n.prev=n.next){
          case 0:
            return o=c.length>1&&void 0!==c[1]
              ?c[1]
              :{},'[object Error]'===Object.prototype.toString.call(o)
                ?(Error.prototype.toString.call(o),o.stack)
                :r(d[8])(o),n.next=5,s.default.awrap(BYBaseInfo.getSystemInfo());

          case 5:
            t=n.sent,l="\n    Error:\n      errorposition: "+o.line+","+o.column+",\n      errormessage: "
            +o.message+",\n      baseInfo: uuid--"+t.uuid
            +" deviceType-- "+t.deviceType+" systemVersion-- "+t.systemVersion+"  appVersion-- "+t.appVersion
            +" numVersion-- "+t.numVersion+"\n      errorurl: "+o.sourceURL
            +",\n    ",console.warn(l),(0,u.default)(40002,l);

          case 9:
          case"end":
            return n.stop()
          }},null,null,null,Promise)},
    onHandled:function(n){var o="Promise Rejection Handled (id: "+n+")\nThis means you can ignore any previous messages of the form \"Possible Unhandled Promise Rejection (id: "+n+"):\"";console.warn(o)}
  })
},808,[9,1,103,56,2,809,810,811,812]);
```

对应的打包前的代码为：

```javascript
// 异步请求捕获逻辑
require('promise/setimmediate/rejection-tracking').enable({
  allRejections: true,
  onUnhandled: async (id, error = {}) => {
    let message;
    let stack;

    const stringValue = Object.prototype.toString.call(error);
    if (stringValue === '[object Error]') {
      message = Error.prototype.toString.call(error);
      stack = error.stack;
    } else {
      /* $FlowFixMe(>=0.54.0 site=react_native_oss) This comment suppresses
       * an error found when Flow v0.54 was deployed. To see the error delete
       * this comment and run Flow. */
      message = require('pretty-format')(error);
    }
    let info = await BYBaseInfo.getSystemInfo();
    const warning = `
    Error:
      errorposition: ${error.line},${error.column},
      errormessage: ${error.message},
      baseInfo: uuid--${info.uuid} deviceType-- ${info.deviceType} systemVersion-- ${info.systemVersion}  appVersion-- ${info.appVersion} numVersion-- ${info.numVersion}
      errorurl: ${error.sourceURL},
    `;
    console.warn(warning);
    postErrorHandler(40002, warning);
  },
  onHandled: (id) => {
    const warning =
      `Promise Rejection Handled (id: ${id})\n` +
      'This means you can ignore any previous messages of the form ' +
      `"Possible Unhandled Promise Rejection (id: ${id}):"`;
    console.warn(warning);
  },
});
```

分析promise源码可知，enable中传入的对象作为options，定义的三个属性allRejections、onUnhandled、onHandled被Promise所使用。onUnhandled在原本的onUnhandled中调用。因此，需要排查传入的onUnhandled中error.line为什么报错TypeError。

```javascript
 function onUnhandled(id) {
   if (
     options.allRejections ||
     matchWhitelist(
       rejections[id].error,
       options.whitelist || DEFAULT_WHITELIST
     )
   ) {
     rejections[id].displayId = displayId++;
     if (options.onUnhandled) {
       rejections[id].logged = true;
       options.onUnhandled(
         rejections[id].displayId,
         rejections[id].error
       );
     } else {
       rejections[id].logged = true;
       logError(
         rejections[id].displayId,
         rejections[id].error
       );
     }
   }
 }
```

Promise简要内容：

```javascript
function Promise(func) {
	this._U = 0;
	this._V = 0;	//	promise状态
	this._W = null;
	this._X = null;
	
	if (func === noop) return;
	doResolve(func, this)
}

Promise._Y = null;
Promise._Z = null;
Promise._0 = noop;

function noop() {}

var IS_ERROR = {};
var LAST_ERROR = null;
```

```javascript
function doResulve(func, promise) {
  var done = false;
  
  var res = tryCallTwo(
    func,
    function (value) {
      if (done) return;
      done = true;
      resolve(promise, value);
    },
    function (reason) {
      if (done) return;
      done = true;
      reject(promise, reason);
    },
  );
  
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}
```

```javascript
function tryCallTwo(func, a, b) {
  try {
    func(a, b);
  }
  catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function resolve(self, newValue) {
  if (newValue === self) {
    //	先判断一次，promise不能调用自身
    return reject(self, new TypeError('xxxx'));	
  }
  
  self._V = 1 or 3;
  self.W = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._V = 2;
  self._W = newValue;
  if (Promise._Z) {
    Promise._Z(self, newValue);
  }
  finale(self);
}

function finale(self) {
  if (self._U === 1) {
    handle(self, self._X);
    self._X = null;
  }
  if (self._U === 2) {
    for (var i = 0; i < self._X.length; i++) {
      handle(self, self._X[i]);
    }
    self._X = null;
  }
}

function handle(self, deferred) {
  white (self._V === 3) {
    self = self._W;
  }
  
  if (Promise._Y) {
    Promise._Y(self);
  }
  //	some other code
}
```

rejection-tracking内容：

```javascript
var DEFAULT_WHITELIST = [
  ReferenceError,
  TypeError,
  RangeError,
];

var enabled = false;
function disable() {
  enabled = false;
  Promise._Y = null;
  Promise._Z = null;
}

function enable(options) {
  if (enabled) disable();
  enabled = true;
  
  var id = 0;
  var displayId = 0;
  var rejections = {};
  
  Promise._Y = function (promise) {
    if (Promise._V === 2 && rejections[promise._1]) {
      if (rejections[promise._1].logged) {
        onHandled(promise._1);
      }
      else {
        clearTimeout(rejections[promise._1].timeout);
      }
      delete rejections[promise._1];
    }
  };
  
  Promise._Z = function (promise, err) {
    if (promise._U === 0) {
      promise._1 = id++;
      
      rejections[promise._1] = {
        displayId: null,
        error: err,
        logged: false,	//	标记错误是否被处理了
        timeout: setTimeout(onUnhandled.bind(null, promise._1), matchWhitelist(err, DEFAULT_WHITELIST) ? 100 : 2000),
      };
    }
  };
  
  function onUnhandled(id) {
    if (
    	options.allRejections ||
      matchWhitelist(
      	rejections[id].error,
        options.whitelist || DEFAULT_WHITELIST
      )
    ) {
      rejections[id].displayId = displayId++;
      
      //	如果有自定义的错误处理，则走自定义逻辑，否则默认走logError
      if (options.onUnhandled) {
        rejections[id].logged = true;
        options.onHandled(
        	rejections[id].displayId,
          rejections[id].error,
        );
      }
      else {
        rejections[id].logged = true;
        logError(
        	rejections[id].displayId,
          rejections[id].error,
        );
      }
    }
  };
  
  function onHandled(id) {
    if (rejections[id].logged) {
      if (options.onHandled) {
        options.onHandled(
        	rejections[id].displayId,
          rejections[id].error
        );
      }
      else if (!rejections[id].onUnhandled) {
        console.warn('xxxx');
        console.warn('xxxxx');
      }
    }
  };
}
```

由上述代码可知，Promise._Z会将一个id为从0开始记录id的rejection对象，放到rejections数组中。对象的error就是reject获取到的error，timeout记录延迟执行的onUnhandled函数。

逻辑梳理：

1. Promise触发reject后，如果有Promise._Z定义，则执行它，然后执行finale函数；
2. finale函数中执行handle函数；
3. handle函数中判断，如果有Promise._Y定义，则执行。

问题关键：

自定义的onUnhandled函数已经定义了error的默认值为空对象，为什么会在下面使用处的error.line报错

```
undefined is not an object (evaluating 'n.line')
```


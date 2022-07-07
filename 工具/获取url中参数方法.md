``` javascript
//  新一点的api
function getQueryString(name) {
  const url_string = "https://www.baidu.com/t.html?name=mick&age=20"; // window.location.href
  const url = new URL(url_string);
  return url.searchParams.get(name);
}

console.log(getQueryString('name')) // mick
console.log(getQueryString('age')) // 20

//  正则匹配
function getQueryString(name) {
    var query_string = "?name=mick&age=20"; // window.location.search
  if (!query_string) return null; // 如果无参，返回null
  var re = /[?&]?([^=]+)=([^&]*)/g;
  var tokens;
  while (tokens = re.exec(query_string)) {
    if (decodeURIComponent(tokens[1]) === name) {
      return decodeURIComponent(tokens[2]);
    }
  }
  return null;
}

console.log(getQueryString('name')) // mick
console.log(getQueryString('age')) // 20

//  普通循环
function getQueryString(name) {
  var url_string = "https://www.baidu.com/t.html?name=mick&age=20"; // window.location.href
  var params = url_string.split('?')[1]; // 获取?号后面的参数 name=mick&age=20
  if (!params) return null; // 如果无参，返回null
  var vars = params.split("&"); // 将参数分割成数组 ['name=mick', 'age=20']
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("="); // 将参数的key和值进行分割成 ['name', 'mick']
    var key = decodeURIComponent(pair[0]); // 参数key
    var value = decodeURIComponent(pair[1]); // 参数值
    if (name === key) { // 如果匹配到对应key返回
      return value;
    }
  }
  return null;
}

console.log(getQueryString('name')) // mick
console.log(getQueryString('age')) // 20
```

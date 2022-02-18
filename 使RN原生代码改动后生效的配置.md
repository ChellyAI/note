## 改动代码

1、settings.gradle.kts

```java
//  添加 react-android 项目，引用的是node_modules内的react-native库
include(":react-android")
project(":react-android").projectDir = File(rootProject.projectDir, "./reactModule/react-native-dependencies/node_modules/react-native/ReactAndroid")
//  end
```

2、build.gradle.kts

```java
buildscript {
      dependencies {
        classpath(Dependencies.gradleClzPath)
        classpath(Dependencies.newlensClzPath)
        //  下一行代码是添加的 gradle-download-task 依赖
        classpath("de.undercouch:gradle-download-task:3.1.2")
        //	end
        // 华为 HMS 服务插件
        classpath("com.huawei.agconnect:agcp:1.0.0.300")
    }
}
```

3、reactModule/build.gradle.kts

```java
dependencies {
    implementation(project(":biyaoLibrary"))
      
    //  api("com.facebook.react:react-native:+") {
    //  引入react-android项目，替换掉原来的引用
    api(project(":react-android")) {
    //	end
        exclude(group = "com.squareup.okhttp3", module = "okhttp")
        exclude(group = "com.squareup.okio", module = "okio")
        exclude(group = "com.google.code.gson", module = "gson")
    }
}

//	... other code
//	重写第三方 React Native 模块的依赖，避免仍然打包官方的预编译库导致重名报错
configurations.all {
    exclude(group = "com.facebook.react", module = "react-native")
}
//	end
```

## 配置过程

除了改动以上代码，还有如下操作：

1. 依照RN官方文档要求，添加NDK17.2.4988734，修改 `local.properties` 文件中 ndk.dir指向

```java
sdk.dir=/Users/biyao/Library/Android/sdk
//	start
ndk.dir=/Users/biyao/Library/Android/sdk/ndk/17.2.4988734
//	end
```

2. reactModule/react-native-dependencies/node_modules中的react-native，需要重新下载位于 http://192.168.99.153:4873/ 私有库上的 0.63.5 版本。

执行命令

```java
//  连内网
npm install react-native@0.63.5 --registry http://192.168.99.153:4873/
```



## 本次改动的目的

这次改动，是因为RN官方的安卓原生代码存在bug，因此需要修改RN源码，并让必要app使用我们改动过的RN包。修改过程是按照官方文档《从源代码编译React Native》上的步骤来做的https://reactnative.cn/docs/next/building-from-source
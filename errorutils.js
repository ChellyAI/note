/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict
 * @polyfill
 */

//  计数
let _inGuard = 0;

//  两个类型定义
type ErrorHandler = (error: mixed, isFatal: boolean) => void;
type Fn<Args, Return> = (...Args) => Return;


/**
  * This is the error handler that is called when we encounter an exception
  * when loading a module. This will report any errors encountered before
  * ExceptionsManager is configured.
  */
//  函数默认值
let _globalHandler: ErrorHandler = function onError(
  e: mixed,
  isFatal: boolean,
) {
  throw e;
};

/**
  * The particular require runtime that we are using looks for a global
  * `ErrorUtils` object and if it exists, then it requires modules with the
  * error handler specified via ErrorUtils.setGlobalHandler by calling the
  * require function with applyWithGuard. Since the require module is loaded
  * before any of the modules, this ErrorUtils must be defined (and the handler
  * set) globally before requiring anything.
  */
const ErrorUtils = {
  //  设定函数
  setGlobalHandler(fun: ErrorHandler): void {
    _globalHandler = fun;
  },
  //  获取函数
  getGlobalHandler(): ErrorHandler {
    return _globalHandler;
  },

  //  上报一般错误
  reportError(error: mixed): void {
    _globalHandler && _globalHandler(error, false);
  },

  //  上报重大错误
  reportFatalError(error: mixed): void {
    // NOTE: This has an untyped call site in Metro.
    _globalHandler && _globalHandler(error, true);
  },



  applyWithGuard<TArgs: $ReadOnlyArray<mixed>, TOut>(
    fun: Fn<TArgs, TOut>,
    context?: ?mixed,
    args?: ?TArgs,
    // Unused, but some code synced from www sets it to null.
    unused_onError?: null,
    // Some callers pass a name here, which we ignore.
    unused_name?: ?string,
  ): ?TOut {
    try {
      _inGuard++;
      // $FlowFixMe: TODO T48204745 (1) apply(context, null) is fine. (2) array -> rest array should work
      return fun.apply(context, args);
    } catch (e) {
      ErrorUtils.reportError(e);
    } finally {
      _inGuard--;
    }
    return null;
  },




  applyWithGuardIfNeeded<TArgs: $ReadOnlyArray<mixed>, TOut>(
    fun: Fn<TArgs, TOut>,
    context?: ?mixed,
    args?: ?TArgs,
  ): ?TOut {
    if (ErrorUtils.inGuard()) {
      // $FlowFixMe: TODO T48204745 (1) apply(context, null) is fine. (2) array -> rest array should work
      return fun.apply(context, args);
    } else {
      ErrorUtils.applyWithGuard(fun, context, args);
    }
    return null;
  },


  //  返回是否有保护
  inGuard(): boolean {
    return !!_inGuard;
  },



  guard<TArgs: $ReadOnlyArray<mixed>, TOut>(
    fun: Fn<TArgs, TOut>,
    name?: ?string,
    context?: ?mixed,
  ): ?(...TArgs) => ?TOut {
    // TODO: (moti) T48204753 Make sure this warning is never hit and remove it - types
    // should be sufficient.
    if (typeof fun !== 'function') {
      console.warn('A function must be passed to ErrorUtils.guard, got ', fun);
      return null;
    }
    const guardName = name ?? fun.name ?? '<generated guard>';
    function guarded(...args: TArgs): ?TOut {
      return ErrorUtils.applyWithGuard(
        fun,
        context ?? this,
        args,
        null,
        guardName,
      );
    }

    return guarded;
  },
};

global.ErrorUtils = ErrorUtils;

export type ErrorUtilsT = typeof ErrorUtils;

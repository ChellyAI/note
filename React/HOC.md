## HOC 高阶组件

## HOC 简述

&emsp;&emsp;高阶组件是参数为组件、返回值为新组件的**函数**。

![overview](./HOC/总览.jfif)

&emsp;&emsp;高阶组件的作用：

1. 复用逻辑：它可以批量对原有组件进行加工、包装处理；
2. 强化 props：高阶组件返回的组件，可以劫持上一层传过来的 props，然后混入新的 props，增强组件的功能；
3. 赋能组件：高阶组件可以给被包裹的业务组件提供拓展功能，例如额外的生命周期、额外的事件，但需要和业务组件紧密结合；
4. 控制渲染：在包装组件中，可以对被包裹的组件进行条件渲染、节流渲染、懒加载等功能，例如`react-redux`中的`connect`和`dva`中的`dynamic`懒加载。

### 使用和编写结构

#### 使用

&emsp;&emsp;对于 class 组件，一般使用装饰器对类组件进行包装：

```javascript
@withStyles(styles)
@withRouter
@keepaliveLifeCycle
class Index extends React.Component {
    //	code
}
```

&emsp;&emsp;越靠近组件的，就是越内层的高阶组件。

&emsp;&emsp;函数式组件可以使用：

```javascript
function Index() {
    //	code
}

export default withStyles(styles)(withRouter(keepaliveLifeCycle(Index)))
```

&emsp;&emsp;还有管道操作符很适合，只不过需要配置一下 babel 以支持其语法：

```javascript
function Test() {
    //	code
}

export default Test
	|> Form.create()
	|> connect()
```

#### 编写结构

&emsp;&emsp;不需要参数的高阶组件，编写时只需要嵌套一层即可，例如 `withRouter`：

```javascript
function withRouter() {
    return class wrapComponent extends React.Component {
        //	code
    }
}
```

&emsp;&emsp;需要参数的高阶组件，需要加一层代理：

```javascript
function connect(mapStateToProps) {
    return function connectAdvance(wrapComponent) {
        return class wrapComponent extends React.Component {
            //	code
        }
    }
}
```

&emsp;&emsp;代理的层数可能有很多层，但一层层剥离开，本质还是一样的。

### 两种不同的方式

&emsp;&emsp;常见的高阶组件有两种方式，`正向属性代理`和`反向组件继承`。

#### 正向属性代理

&emsp;&emsp;这种方式就是在组件之上包裹一层代理组件，在代理组件内部就可以进行一些操作，可以理解为父子组件关系：

```javascript
function HOC(wrapComponent) {
    return class Advance extends React.Component {
        state = {
            name: 'caisiqi',
        }
    
    	render() {
            return <wrapComponent {...this.props} {...this.state} />
        }
    }
}
```

**优点**：

- 可与业务组件弱耦合、零耦合，条件渲染、props属性增强只需要对应处理即可，无需知道业务组件做了什么，所以开源的 HOC 一般都是这个模式实现的；
- 适用于 class 组件和函数式组件；
- 可以完全隔离业务组件的渲染，避免了反向继承的副作用，例如生命周期的执行；
- 可以多个嵌套使用，且一般不会限制包装先后顺序。

**缺点**：

- 一般无法直接获取到业务组件的状态，如果想要获取，需要 ref 获取组件实例；
- 无法直接继承静态属性，如果想要继承需手动处理，或者引入第三方库。

#### 反向继承

&emsp;&emsp;反向继承是包装后的组件继承了业务组件本身，所以无需再去实例化业务组件、当前的高阶组件就是继承后、加强型的业务组件。这种方式就必须知道当前业务组件的逻辑了。

```javascript
class Test extends React.Component {
    render() {
        return (
        	<div>
            	hello world!
            </div>
        );
    }
}

function HOC(component) {
    return class wrapComponent extends component {
        //	code
    }
}

export default HOC(Test);
```

**优点**：

- 方便获取组件内部状态，比如 state、props、生命周期、绑定事件等；
- ES6 继承可以良好继承静态属性，我们不用对静态属性和方法进行额外处理。

**缺点**：

- 无状态组件无法使用；
- 和被包装的组件强耦合，需要知道它做什么、内部状态如何；
- 如果多个反向继承的 HOC 嵌套在一起，当前状态会覆盖上一个状态，例如有多个 componentDidMount，当前 componentDidMount 会覆盖上一个，这样副作用串联起来影响很大。

### 总结

对于属性代理HOC，它可以：

- 强化 props、抽离 state；
- 条件渲染、控制渲染、分片渲染、懒加载；
- 劫持事件和生命周期；
- ref 控制组件实例；
- 添加事件监听器、日志；

对于反向继承的HOC，它可以：

- 劫持渲染、操纵渲染树；
- 控制、替换生命周期，直接获取组件状态、绑定事件。

## HOC 的编写实现

&emsp;&emsp;编写 HOC 最好是有一定场景，想满足什么需求，再进行设计。

### 强化 props

#### 混入 props

&emsp;&emsp;这是最常见的功能，承接上层的 props，再混入自己的 props。

```javascript
function Test(props) {
    const { name } = props;
    
    return (
    	<div>
        	我的名字是
        	{name}
		</div>
    );
}

function classHOC(WrapComponent) {
    return class test extends React.Component {
        state = {
            name: 'caisiqi',
        }
    
    	componentDidMount() {
            console.log('classHOC');
        }
    	
    	render() {
            return <WrapComponent {...this.props} {...this.state} />
        }
    }
}

function functionHOC(WrapComponent) {
    return function test(props) {
        const [name, setName] = React.useState('caisiqi');
        
        return (
			<WrapComponent {...props} name={name} />
        )
    }
}
```

#### 抽离 state 控制更新

&emsp;&emsp;高阶组件可以将 HOC 的 state 配合起来，控制业务组件的更新。这种用法在 `react-redux` 中 `connect` 使用到了，用于处理来自 `redux` 中 `state` 更改带来的订阅更新作用。

```javascript
function classHOC(WrapComponent) {
    return class test extends React.Component {
        state = {
            name: 'caisiqi',
        }
    
    	changeName(name) {
            this.setState({
                name,
            });
        }
    
    	render() {
            return (
                <WrapComponent
                	{...this.props}
    				{...this.state}
    				changeName={this.changeName.bind(this)}
    			/>
    		)
        }
    }
}

function Test(props) {
    const [value, setValue] = React.useState(null);
    const {
        name,
        changeName,
    } = props;
    
    return (
        <>
            <div>我叫{name}</div>
			<button onClick={() => changeName(value)}>换名字</button>
		</>
    );
}

export default classHOC(Test);
```

### 控制渲染

&emsp;&emsp;之前说过的两种高阶组件都能实现控制渲染，但具体实现还是有区别的。

#### 条件渲染

&emsp;&emsp;属性代理 HOC，虽然不能在内部操控渲染状态，但是可以在外层控制当前组件是否渲染，可应用于**权限隔离、懒加载、延时加载**等场景。

&emsp;&emsp;下面分三个阶段来逐步深入。

1. 基础：动态渲染

```javascript
class Test extends React.Component {
    render() {
        const { setVisible } = this.props;
        
        return (
        	<>
            	<img src="..." />
            	<button onClick={() => setVisible()}>卸载当前组件</button>
            </>
        )
    }
}

function renderHOC(WrapComponent) {
    return class test extends React.Component {
        state = {
            visible: true,
        }
    
    	setVisible() {
            this.setState({
                visible: !this.state.visible,
            })
        }
    
    	render (
        	<>
            	<button onClick={this.setVisible.bind(this)}>挂在当前组件</button>
				{
                    visible ?
                        <WrapComponent
                    		{...this.props}
                    		setVisible={this.setVisible.bind(this)}
						/>
						: <div>加载中</div>
                }
            </>
        )
    }
}

export default renderHOC(Test);
```

2. 进阶：分片渲染

&emsp;&emsp;实现一个懒加载功能的 HOC，让组件分片渲染，不至于一次渲染大量组件造成白屏效果。

```javascript
class Test extends React.Component {
    componentDidMount() {
        const {
            name,
            tryRender,
        } = this.props;
        
        tryRender();
        
        console.log(name + '渲染了');
    }
    
    render() {
        return (
        	<img src="..." />
        )
    }
}

const Item = renderHOC(Test);

export default () => {
    return (
    	<>
        	<Item name="first" />
        	<Item name="second" />
        	<Item name="third" />
        </>
    )
}
```

```javascript
const renderQueue = [];
let isFirstrender = false;

const tryRender = () => {
    const render = renderQueue.shift();

    if (!render) return;
    setTimeout(() => {
        render();
    }, 3000);
};

function renderHOC(WrapComponent) {
    return function test(props) {
        const [isRender, setRender] = useState(false);
        
        useEffect(() => {
            renderQueue.push(() => {
                setRender(true);
            });
            
            if (!isFirstrender) {
                tryRender();
                isFirstrender = true;
            }
        }, []);
        
        return isRender ? <WrapComponent tryRender={tryRender} {...props} />
        	: <div>加载中</div>
    }
}

export default renderHOC;
```

&emsp;&emsp;实现思路是，初始化的时候，HOC 中将渲染真正组件的渲染函数，放到 `renderQueue` 队列中，然后初始化渲染一次，接下来，每一个业务组件完成 `componentDidMount` 后，会从队列中取下一个渲染函数，渲染下一个业务组件，直到所有的渲染任务全部执行完毕，渲染队列清空，有效的进行分片渲染。这种方式对海量数据展示很有效。

3. 再进阶：异步组件（懒加载）

&emsp;&emsp;dva 里面的 dynamic 就是应用 HOC 实现组件的异步加载，简化提炼代码后如下：

```javascript
export default function AsyncRouter(loadRouter) {
    return class Content extends React.Component {
        state = {
            Component: null,
        }
    
    	componentDidMount() {
            if (this.state.Component) return;
            
            loadRouter()
            	.then(module => module.default)
            	.then(Component => this.setState({Component}))
        }
    
    	render() {
            const {Component} = this.state;
            
            return Component ? <Component {...this.props} /> : null;
        }
    }
}

const Test = AsyncRouter(() => import('../pages/index'));
```


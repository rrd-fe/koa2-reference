# koa2-typescript-reference

A simple Koa2 library implementation written by TypeScript, show you the kernel of Koa2 and how to step by step write a Koa2.

## Get Start

Koa 类库的几个核心特点 : 

* 中间件洋葱圈模型
* context封装
* try catch 错误处理能力

详细实现[参考文章](https://github.com/rrd-fe/blog/blob/master/nodejs/koa2-implementation.md)

下面我们拆分成四步实现一个简易的Koa框架：

### Step 1 基础Server运行

* 目标：提供Koa类，支持通过listen启动Server，use添加一个类中间件处理函数
* 运行：npm run start:1

### Step 2 洋葱圈中间件机制实现

* 目标：支持use添加多个中间件，并按照洋葱圈模式调用
* 运行：npm run start:2

### Step 3 context提供

* 目标：封装request、response，提供context对象贯穿所有中间件调用
* 运行：npm run start:3

### Step 4 同步错误处理能力

* 目标：支持错误监听（app.on('error')）,支持通过try catch进行一场捕获
* 运行：npm run start:4

## TODO

* 采用代理实现、完善KoaRequest、KoaResponse、KoaContext功能提供和封装

module.exports = {
    // baseUrl  type:{string} default:'/' 
    // 将部署应用程序的基本URL
    // 默认情况下，Vue CLI假设您的应用程序将部署在域的根目录下。
    // https://www.my-app.com/。如果应用程序部署在子路径上，则需要使用此选项指定子路径。例如，如果您的应用程序部署在https://www.foobar.com/my-app/，集baseUrl到'/my-app/'.
    
    baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/',
    
    // outputDir: 在npm run build时 生成文件的目录 type:string, default:'dist'
    // outputDir: 'dist',
    
    //是否使用eslint
    lintOnSave: false,
    // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
    productionSourceMap: false,
    // 它支持webPack-dev-server的所有选项

    devServer: {
        port: 8085, // 端口号
     // host: '192.168.20.15', 不配置默认两种都开启
        https: false,
        open: false, //配置自动启动浏览器
    },

   

}
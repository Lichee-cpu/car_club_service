const productConfig = {
    accessKeyId: 'LTAI5tRW4fpE4AcMFHtsHX4G',
    accessKeySecret: 'gmvUyB8p0DPvZ2lJ2ZpBkW5HwhhvgV',
    endpoint: 'oss-cn-hangzhou.aliyuncs.com',
    bucket: 'lichee-img',
    region: 'oss-cn-hangzhou',
  };
   
  const localConfig = {
    accessKeyId: 'LTAI5tRW4fpE4AcMFHtsHX4G',
    accessKeySecret: 'gmvUyB8p0DPvZ2lJ2ZpBkW5HwhhvgV',
    endpoint: 'oss-cn-hangzhou.aliyuncs.com',
    bucket: 'lichee-img',
    region: 'oss-cn-hangzhou',
  };
   
  // 本地运行是没有 process.env.NODE_ENV 的，借此来区分[开发环境]和[生产环境]
  const ossConfig = process.env.NODE_ENV ? productConfig : localConfig;
   
  export default ossConfig;
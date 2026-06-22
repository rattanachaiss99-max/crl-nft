const { defineConfig } = require("@vue/cli-service");
const { ProvidePlugin } = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = defineConfig({
  // ⚙️ แก้ไขตรงนี้: บังคับให้แปลงทุกลักษณะ ยกเว้นโฟลเดอร์ของ three.js 👇
  transpileDependencies: true, // แก้กลับมาเป็น true เหมือนเดิมครับ
  lintOnSave: false,

  // ⚙️ เพิ่มส่วนตั้งค่า Port หน้าบ้านตรงนี้ (หลบพอร์ต 8000 ของ Python หลังบ้าน)
  devServer: {
    port: 8080, 
  },

  // IMP START - Bundler Issues (รักษาค่าคอนฟิกเดิมของ Web3Auth ไว้ทั้งหมด)
  configureWebpack: (config) => {
    config.devtool = "source-map";
    config.resolve.symlinks = false;
    config.resolve.fallback = {
      crypto: false,
      stream: false,
      assert: false,
      os: false,
      https: false,
      http: false,
      url: "url",
      zlib: false,
    };
    config.plugins.push(new ProvidePlugin({ Buffer: ["buffer", "Buffer"] }));
    config.plugins.push(new ProvidePlugin({ process: ["process/browser"] }));
    // IMP END - Bundler Issues
    
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "disabled",
      })
    );
  },
});
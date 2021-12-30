import path from 'path';
import { Configuration, DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import WasmPackPlugin from '@wasm-tool/wasm-pack-plugin';

const webpackConfig = (): Configuration => ({
  entry: {
    popup: './src/popup/index.tsx',
    options: './src/options/index.tsx',
    service_worker: './src/background/service_worker.ts',
  },
  ...(process.env.production || !process.env.development
    ? {}
    : { devtool: 'eval-source-map' }),

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
  },
  output: {
    path: path.join(__dirname, '/build'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
        exclude: /build/,
      },
    ],
  },
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: './public/popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: './public/options.html',
      chunks: ['options'],
    }),
    new DefinePlugin({
      'process.env': process.env.production || !process.env.development,
    }),
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: './src/**/*.{ts,tsx,js,jsx}',
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/manifest.json', to: '' },
        { from: 'public/images', to: 'images' },
      ],
    }),
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, '../wasm'),
      outDir: path.resolve(__dirname, './pkg'),
    }),
  ],
  experiments: {
    asyncWebAssembly: true,
  },
});

export default webpackConfig;

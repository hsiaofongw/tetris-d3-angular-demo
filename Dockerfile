# syntax=docker/dockerfile:1

# 先 build web 前端项目

# 基镜像 NodeJS, 要用 Angular
FROM node:16.15.1

# 工作目录 /app
WORKDIR /app

# 复制 pakcage.json, package-lock.json 到工作目录
COPY ["package.json", "package-lock.json", "./"]

# 安装包依赖
RUN npm install

# 复制源代码
COPY . .

# 让 Angular build 前端并且打包，默认会生成在 ./dist 下面
RUN npm run build

# 二阶段 build, 基镜像 nginx
FROM nginx:latest

# 工作目录（同时也是 webroot）/usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# 复制上阶段 build 的产出到 webroot
COPY --from=0 /app/dist/d3-demo .

# 复制 NginX 配置文件
COPY default.conf /etc/nginx/conf.d

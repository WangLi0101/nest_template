# 使用 Node.js 官方镜像作为基础镜像
FROM node:18

# 安装 pnpm
RUN npm install -g pnpm

# 创建并设置工作目录
WORKDIR /usr/src/app

# 复制 pnpm-lock.yaml 和 package.json 到容器
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制应用程序代码到容器
COPY . .

# 构建 NestJS 项目
RUN pnpm run build

# 设置环境变量
ENV NODE_ENV=production

# 暴露应用程序的端口
EXPOSE 3000

# 启动应用程序
CMD ["pnpm", "run", "start:prod"]

# 构建阶段
FROM node:20 AS builder

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

# 生产阶段
FROM node:20-slim

WORKDIR /usr/src/app

# 安装 pnpm
RUN npm install -g pnpm

# 只复制生产环境必需的文件
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# 从构建阶段复制构建产物
COPY --from=builder /usr/src/app/dist ./dist

# 设置环境变量
ENV NODE_ENV=production

# 暴露应用程序的端口
EXPOSE 3000

# 启动应用程序
CMD ["pnpm", "run", "start:prod"]

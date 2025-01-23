# 최신 Node.js 버전 이미지 사용
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 프로젝트 전체 복사
COPY . .

# Nginx 기본 포트 노출
EXPOSE 3000

# Nginx 실행
CMD ["npm", "run", "dev"]
FROM node:gallium-alpine



ENV NODE_ENV=production

ENV PORT=3000



WORKDIR /app



COPY ["package.json", "yarn.lock", "./"]




RUN yarn



COPY . .



EXPOSE 3000



CMD ["npm", "start"]
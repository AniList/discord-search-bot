ARG VARIANT=latest
FROM oven/bun:${VARIANT}

CMD [ "bun", "src/index.ts" ]
FROM node:20.10.0-alpine3.19 as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN pnpm prune --prod


FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build


FROM base
RUN addgroup --system --gid 1001 remix
RUN adduser --system --uid 1001 remix
USER remix

COPY --from=prod-deps --chown=remix /app/node_modules /app/node_modules
COPY --from=build --chown=remix /app/build /app/build
COPY --from=build --chown=remix /app/public /app/public
COPY --from=build --chown=remix /app/app/db /app/app/db
COPY --from=build --chown=remix /app/package.json /app/pnpm-lock.yaml /app/drizzle.sqlite.config.ts ./

EXPOSE 3000
CMD [ "node_modules/.bin/remix-serve", "build/index.js" ]
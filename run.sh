#!/bin/sh
npm run db:migrate:up
npm run db:seed:up
node build/main.js
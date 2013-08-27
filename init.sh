#!/bin/sh
redis-server &
node source &
node video &
NODE_ENV=production node app &


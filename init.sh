#!/bin/sh
redis-server &
node demos/source &
node demos/video &
NODE_ENV=production node app &


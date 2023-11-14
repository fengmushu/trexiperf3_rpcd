#!/bin/bash

. ./traffic_gen/streams/scripts/trex-common.sh

kill `cat "$STREAM_PID_F"`

rm ${STREAM_PID_F}

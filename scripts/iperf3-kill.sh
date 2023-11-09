#!/bin/bash

. ./scripts/iperf3-common.sh

kill `cat "$STREAM_PID_F"`

rm ${STREAM_PID_F}

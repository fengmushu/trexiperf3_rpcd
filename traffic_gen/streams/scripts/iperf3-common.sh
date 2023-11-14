#!/bin/bash

mkdir -p /tmp/paster/

LOG()
{
	logger -s "$*"
}

STREAM_PID_F="/tmp/paster/iperf3-${STREAM_ID}.lock"
RUNTIME_LOG_F="/tmp/paster/iperf-run.log"

[ -z "${RUN_TIMEOUT}" ] && {
	RUN_TIMEOUT=0
}
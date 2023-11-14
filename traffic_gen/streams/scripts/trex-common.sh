#!/bin/bash

## /tmp/paster/trex_conf.json
mkdir -p /tmp/paster/

LOG()
{
	logger -s "$*"
}

STREAM_PID_F="/tmp/paster/trex-${STREAM_ID}.lock"
RUNTIME_LOG_F="/tmp/paster/trex-run.log"

[ -z "${RUN_TIMEOUT}" ] && {
	RUN_TIMEOUT=0
}
#!/bin/bash

. ./scripts/iperf3-common.sh

LOG "iperf3 run timeout $RUN_TIMEOUT"

[ -f ${STREAM_PID_F} ] && {
	PID=$(cat ${STREAM_PID_F})
	[ -n "$PID" ] && {
		[ -d /proc/$PID ] && {
			# busy, process running
			LOG "$PID busy running"
			exit 0
		} || {
			# normal error, process exited
			LOG "$PID exit to idle"
			rm ${STREAM_PID_F}
			exit 2
		}
	}
	LOG "$PID killed, restart it"
}

if [ $RUN_TIMEOUT -ge 3 ]; then
	# not short detect running background
	/usr/local/bin/iperf3 $* >>${RUNTIME_LOG_F} &
else
	/usr/local/bin/iperf3 $* >>${RUNTIME_LOG_F}
fi
RC=$?
PID=$!

echo $PID >${STREAM_PID_F}
exit $RC

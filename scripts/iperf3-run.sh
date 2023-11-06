#!/usr/bin/sh

mkdir -p /tmp/paster/

[ -f /tmp/paster/iperf3-${STREAM_ID}.pid ] && {
	PID=`cat /tmp/paster/iperf3-${STREAM_ID}.pid`
	[ -d /proc/$PID ] && {
		# busy, process running
		exit 1
	}
}

/usr/local/bin/iperf3 $*  2>&1 &

RC=$?
PID=$!

echo $PID >  /tmp/paster/iperf3-${STREAM_ID}.pid

exit $RC

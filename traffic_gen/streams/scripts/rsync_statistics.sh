#!/bin/sh

[ -z "$WLAN_CARD_ADDR" ] && {
	WLAN_CARD_ADDR=$1
}

flock -w 1 /tmp/trex/csv -c "rsync -rPh --rsh='ssh' root@\"${WLAN_CARD_ADDR}\":/tmp/csv /tmp/trex/ 2>&1 > /tmp/rsync-stat.log" &

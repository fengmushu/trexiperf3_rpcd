
# import subprocess


# class station(object):
#     __DEFAULT_IPADDR = '192.168.10.230'

#     def stat_rsync(self, tov=5):
#         try:
#             cmd = self.SCRIPTS_STAT_SYNC
#             proc = subprocess.run(cmd, capture_output=True, check=True, timeout=tov, env=self.env_patch({
#                 "WLAN_CARD_ADDR": self.nvitem("WlanCardAddr"),
#             }))
#             rc = proc.returncode
#             if rc == 0:
#                 message = proc.stdout.decode("utf-8")
#             else:
#                 message = proc.stderr.decode('utf-8')
#             print(message)
#         except Exception as e:
#             message = "UHE: rsync - {}".format(e)
#             print(message)
#             pass

#     def statistics(self):
#         ''' load csv '''
#         # print("base statistics")
#         self.stat_rsync(tov=10)

#         ds = []
#         import csv
#         with open('/tmp/trex/csv/OpenWrt/interface-ath16/if_octets-2023-11-02', newline='') as stat:
#             dialect = csv.Sniffer().sniff(stat.read(128))
#             stat.seek(0)
#             stat.readline(128)  # ignore header line
#             rows = csv.reader(stat, dialect)
#             for row in rows:
#                 # print(row)
#                 ds.append(row)
#         if len(ds) > self.MAX_STAT_COUNT:
#             ignore = len(ds) - self.MAX_STAT_COUNT
#             ds = ds[ignore:]

#         # print(ds)
#         return ds


# class station_nodes(object):
#     def __init__(self) -> None:
#         pass

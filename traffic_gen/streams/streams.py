import time
import os

from .trex import Trex
from .iperf3 import Iperf3
from .node import StreamNode


class stream_nodes(object):
    __SERVER_LIST = ['192.168.10.117', '10.10.16.241', '192.168.10.254']

    def __init__(self) -> None:
        self.header = [
            {"title": 'Type'},
            {"title": 'Server'},
            {"title": 'BW(Mbps)'},
            {"title": 'PSize(Byte)'},
            {"title": 'Load(%)'},
            {"title": 'Direction'},
            {"title": 'Status'},
            {"title": 'Action'}
        ]
        self.servers = self.__SERVER_LIST
        self.dataset = {}
        os.popen("./traffic_gen/streams/scripts/paster-init.sh")
        pass

    def get_header(self):
        return self.header

    def get_servers(self):
        return self.servers

    def get_dataset(self):
        ds = []
        for k, v in self.dataset.items():
            n = []
            n.append(v.nvitem('ServerType'))
            n.append(v.nvitem('ServerAddr'))
            n.append(v.nvitem('BandWidth'))
            n.append(v.nvitem('PacketSize'))
            n.append(v.nvitem('Load'))
            n.append(v.nvitem('Direction'))
            n.append(v.nvitem('Status'))
            n.append(v.nvitem('Actions'))
            # ID must keep last, for UI key
            n.append(k)
            ds.append(n)
        return ds

    def update(self, scs):
        for k, c in scs.items():
            n = self.dataset.get(k)
            if n != None:
                print("update: key '{}' not found~!".format(k))
                continue
            n.update(c)
        return True

    def append(self, stype, saddr, bw, psize, load, direct):
        key = time.strftime("%Y%m%H%M%S", time.localtime())
        # print(key)
        if stype == 'iperf3':
            n = Iperf3(key, saddr, bw, psize, load, direct)
        elif stype == 'trex':
            n = Trex(key, saddr, bw, psize, load, direct)
        else:
            n = StreamNode(key,
                           stype, saddr, bw, psize, load, direct)
        self.dataset[key] = n
        return True

    def remove(self, id):
        n = self.dataset.pop(id)
        if n == None:
            return False
        print('remove: ', n.config)
        os.popen('rm /tmp/paster/*-{}.pid'.format(id), 'r')
        return True

    def detect(self, id):
        n = self.dataset.get(id)
        if n == None:
            return False
        return n.detect()

    def start(self, id):
        n = self.dataset.get(id)
        if n == None:
            return False
        return n.start()

    def stop(self, id):
        n = self.dataset.get(id)
        if n == None:
            return False
        return n.stop()

    def halt(self, id):
        n = self.dataset.get(id)
        if n == None:
            return False
        return n.halt()

    def monitor(self):
        m = []
        for k, n in self.dataset.items():
            m.append(n.monitor())
        return m

    def statistics(self):
        m = []
        for k, n in self.dataset.items():
            m.append(n.statistics())
        return m

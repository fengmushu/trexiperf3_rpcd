import subprocess
import json
import os

from .node import StreamNode


class Iperf3(StreamNode):
    def __init__(self, key, saddr, bw, psize, load, direct) -> None:
        super().__init__(key, 'iperf3', saddr, bw, psize, load, direct)
        print("Iperf3 created")
        self.nvitem("StreamNum", 4)
        self.nvitem("TransTime", 30)
        self.nvitem("ScriptStart", './traffic_gen/streams/scripts/iperf3-run.sh')
        self.nvitem("ScriptStop", './traffic_gen/streams/scripts/iperf3-kill.sh')
        pass

    def run(self, num=0, trans_time=None):
        return super().run(num, trans_time)

    def detect(self):
        print('iperf3 detect')
        if self.status() == "running":
            return True
        return self.run(num=1, trans_time=1)

    def start(self):
        print("iperf3 start")
        if self.status() == "running":
            return True
        return self.run(num=4)

    def stop(self):
        print("iperf3 stop")
        return super().stop()

    def halt(self):
        print("iperf3 halt")
        if self.status() == "running":
            return False
        self.set_status('idle')
        return True

    def monitor(self):
        return super().monitor()

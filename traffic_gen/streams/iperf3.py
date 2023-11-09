import subprocess
import json
import os

from .node import StreamNode


class Iperf3(StreamNode):
    __IPERF3_PATH_RUN = './scripts/iperf3-run.sh'
    __IPERF3_PATH_KILL = './scripts/iperf3-kill.sh'
    __DEFAULT_STREAM_NUM = 4
    __DEFAULT_TIMEOUT_VAL = 30

    def __init__(self, key, saddr, bw, psize, load, direct) -> None:
        super().__init__(key, 'iperf3', saddr, bw, psize, load, direct)
        print("Iperf3 created")
        self.nvitem("ScriptStart", self.__IPERF3_PATH_RUN)
        self.nvitem("StreamNum", self.__DEFAULT_STREAM_NUM)
        self.nvitem("TransTime", self.__DEFAULT_TIMEOUT_VAL)
        self.nvitem("ScriptStop", self.__IPERF3_PATH_KILL)
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

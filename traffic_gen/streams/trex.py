import subprocess

from .node import StreamNode
from .scripts.trex_client.interactive.trex.examples.stl.stl_broker import *


class Trex(StreamNode):
    def __init__(self, key, saddr, bw, psize, load, direct) -> None:
        super().__init__(key, 'trex', saddr, bw, psize, load, direct)
        self.nvitem("StreamNum", 4)
        self.nvitem("TransTime", 30)
        self.nvitem("ScriptStart", './traffic_gen/streams/scripts/trex-run.sh')
        self.nvitem("ScriptStop", './traffic_gen/streams/scripts/trex-kill.sh')
        print("Trex created")
        pass

    def detect(self, num=0, trans_time=0):
        print("trex detect")
        if self.status() == "running":
            return True
        return self.run(trans_time=1)

    def start(self):
        print("trex start")
        if self.status() == "running":
            return True
        return self.run()

    def stop(self):
        print("trex stop")
        return super().stop()

    def halt(self):
        print("trex halt")
        if self.status() == "running":
            return False
        self.set_status('idle')
        return True

    def vlan(self, vlanid):
        conf = StlBrokerConfig()
        return True

    def monitor(self):
        return super().monitor()

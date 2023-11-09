import subprocess

from .node import StreamNode


class Trex(StreamNode):
    def __init__(self, key, saddr, bw, psize, load, direct) -> None:
        super().__init__(key, 'trex', saddr, bw, psize, load, direct)
        print("Trex created")
        pass

    def detect(self, num, trans_time):
        print("trex detect")
        return True

    def start(self):
        print("trex start")

        return True

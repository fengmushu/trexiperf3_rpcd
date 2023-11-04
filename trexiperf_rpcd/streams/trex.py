from .node import StreamNode


class Trex(StreamNode):
    def __init__(self, saddr, bw, psize, load, direct) -> None:
        super().__init__('trex', saddr, bw, psize, load, direct)
        print("Trex created")
        pass

    def detect(self):
        print("trex detect")
        return True

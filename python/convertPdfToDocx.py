from contextlib import contextmanager
import sys
from pdf2docx import Converter
import io
import os

argv = sys.argv[1:]

if argv[0] is None or argv[1] is None: raise Exception('Please pass the pdf path')

input_path = argv[0]
output_path = argv[1]


cv = Converter(input_path)
cv.convert(output_path)
cv.close()

@contextmanager
def read_as_stream(output_path: str, size=160):
    '''
        read file as binary 
    '''
    f =io.open(output_path, 'rb') 
    try:
        def gen():
            b = f.read(size)

            while b:
                yield b
                b = f.read(size)
            
        yield gen()#1
    finally:
        f.close()


with read_as_stream(output_path) as chunks:
    '''
        Read and send to the stdout
    '''
    for chunk in chunks:
        sys.stdout.buffer.write(chunk)




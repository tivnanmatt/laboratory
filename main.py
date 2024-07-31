import torch
import torch.nn as nn
import laboratory as lab

print(torch.__version__)

# is cuda available?
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print(device)
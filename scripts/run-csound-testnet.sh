#!/bin/bash

tmux new-session -d -s real

## Create the windows on which each node or .launch file is going to run
## tmux send-keys -t real 'tmux new-window -n rediss ' ENTER
tmux send-keys -t real 'tmux new-window -n mint ' ENTER
tmux send-keys -t real 'tmux new-window -n qworker ' ENTER
tmux send-keys -t real 'tmux new-window -n api ' ENTER
tmux send-keys -t real 'tmux new-window -n scan ' ENTER

## Send the command to each window from window 0
# NAME1
## tmux send-keys -t real "tmux send-keys -t rediss 'sudo service redis-server stop' ENTER" ENTER
## tmux send-keys -t real "tmux send-keys -t rediss 'redis-server' ENTER" ENTER

# NAME2
tmux send-keys -t real "tmux send-keys -t mint 'source cardano-node-1.31.0/cli-workspace/testnet/env.sh' ENTER" ENTER
tmux send-keys -t real "tmux send-keys -t mint 'cd cardanosounds/apps/Csharp.CardanoSounds/CS.MintAndRefund/' ENTER" ENTER
tmux send-keys -t real "tmux send-keys -t mint 'dotnet run' ENTER" ENTER

# NAME3
tmux send-keys -t real "tmux send-keys -t qworker 'cd cardanosounds/apps/Api.CardanoSounds/' ENTER" ENTER
tmux send-keys -t real "tmux send-keys -t qworker 'python3 worker.py' ENTER" ENTER
# NAME4
tmux send-keys -t real "tmux send-keys -t api 'cd cardanosounds/apps/Api.CardanoSounds/' ENTER" ENTER
tmux send-keys -t real "tmux send-keys -t api 'python3 app.py' ENTER" ENTER
# NAME5
tmux send-keys -t real "tmux send-keys -t scan 'source cardano-node-1.31.0/cli-workspace/testnet/env.sh' ENTER" ENTER
tmux send-keys -t real "tmux send-keys -t scan 'cd cardanosounds/apps/Csharp.CardanoSounds/CS.ScanForTxs/' ENTER" ENTER
tmux send-keys -t real "tmux send-keys -t scan 'dotnet run' ENTER" ENTER

## Start a new line on window 0
tmux send-keys -t real ENTER

## Attach to session
tmux send-keys -t real "tmux select-window -t mint" ENTER
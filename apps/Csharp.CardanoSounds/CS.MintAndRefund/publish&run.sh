#!/bin/bash 
sudo mkdir /srv/MintWorker                  # Create directory /srv/Worker
sudo chown azureuser /srv/MintWorker     # Assign ownership to yourself of the directory
dotnet publish -c Release -o /srv/MintWorker


sudo systemctl daemon-reload
sudo systemctl start MintWorker

sudo journalctl -u MintWorker -f
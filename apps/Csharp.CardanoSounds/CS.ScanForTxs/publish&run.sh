#!/bin/bash 
sudo mkdir /srv/ScanWorker                  # Create directory /srv/Worker
sudo chown azureuser /srv/ScanWorker     # Assign ownership to yourself of the directory
dotnet publish -c Release -o /srv/ScanWorker


sudo systemctl daemon-reload
sudo systemctl start ScanWorker

sudo journalctl -u ScanWorker -f
curl -L https://nixos.org/nix/install > install-nix.sh
chmod +x install-nix.sh
./install-nix.sh

sudo mkdir -p /etc/nix
cd .. 
cd ..
cd nix
touch nix.conf
echo 'substituters = https://cache.nixos.org https://hydra.iohk.io' > nix.conf
echo 'trusted-public-keys = iohk.cachix.org-1:DpRUyj7h7V830dp/i6Nti+NEO2/nhblbov/8MW7Rqoo= hydra.iohk.io:f/Ea+s+dFdN+3Y/G+FDgSq+a5NEWhJGzdjvKNGv0/EQ=' >> nix.conf
echo 'cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY=' >> nix.conf
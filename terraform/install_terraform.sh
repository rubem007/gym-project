#!/bin/bash

# Update package list and install prerequisites
sudo apt-get update && sudo apt-get install -y gnupg software-properties-common

#Install the HashiCorp GPG key
wget -O- https://apt.releases.hashicorp.com/gpg | \
gpg --dearmor | \
sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null


# Add the official HashiCorp repository
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
sudo tee /etc/apt/sources.list.d/hashicorp.list

# Update the package list and install Terraform
sudo apt update && apt-get install terraform

# Verify the installation
terraform -version
# Full Stack Boilerplate

This repo contains boilerplate code to deploy a React - Django Rest Framework - PostgreSQL application on AWS. This application facilitates blue-green deployment.

# Local Development
**Prerequisites:**
 -  Docker/Docker-Compose installed and virtualisation enabled
 
 **Commands to execute in the root of the repo:**

 1. Build the Docker images: `docker-compose -f docker-compose.dev.yaml build`
 2. Run the containers: `docker-compose -f docker-compose.dev.yaml up`
 
 **Command to execute in the backend terminal:**
 -  Migrate the Postgres database: `python manage.py migrate`

 
 
# Staging and Production Deployment

**Prerequisites:**
 1. An AWS account
 2. Own a web domain
 3. A Linux system (can use WSL if on Windows)
 4. Terraform installed
 5. Ansible installed (on the Linux system)

## Terraform
Terraform is infrastructure as code (IaC) software that is used to provision cloud infrastructure in a maintainable and scalable manner.

**Follow these steps:**

1. Obtain the AWS access key and secret access key
2. Set these as system environment variables with the following keys:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
3. Create an S3 bucket which will be used to store *terraform.tfstate* file
4. Add an AWS key-pair called "terraform" and securely store the resulting *terraform.pem* file
5. Setup *backend-config.hcl* based on *example.backend-config.hcl*
6. Setup *terraform.tfvars* based on *example.terraform.tfvars*
7. In the same directory, execute: `terraform init -backend-config="backend-config.hcl"` 
8. Configure the AWS infrastructure: `terraform apply` 

## DNS
To transfer the management of the web domain, a nameserver should be setup on the domain registration company to transfer the management of the domain to AWS Route 53.

**Follow these steps:**

1. Navigate to AWS Route 53 hosted zones
2. Click on the hosted zone of the domain that you want to use
3. Use the domains associated with the NS type record to setup a namserver on your domain registrar

## Ansible
Used to configure the software packages on the EC2 instances.

**Follow these steps:**
1. Obtain the public ip addresses of the two running EC2 instances
2. Place the *terraform.pem* file in a suitable location
3. Use this to setup a *hosts.ini* file based off *example.hosts.ini* ensuring that the ssh private key file points to the location of *terraform.pem*
4. Enter the Linux environment (WSL if on Windows)
5. Configure the EC2 instances: `ansible-playbook -i hosts.ini playbook.yaml` 

## Deployment on Instances
**Follow these steps:**
1. Enter terminal of EC2 instance: `aws ssm start-session --t <instance-id>`
2. Swich to ec2-user: `sudo su ec2-user`
3. Clone the repository to your desired location
4. In the root of the repository, add a *.env* file based on *.example.env*
5. Build the Docker images: `docker-compose -f docker-compose.prod.yaml build`
6. Run the Docker images: `docker-compose -f docker-compose.prod.yaml up`
7. Enter the backend image container
8. Migrate the database: `python manage.py migrate`

Your application should now be available on the internet.

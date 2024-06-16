terraform {
  backend "s3" {}
}

provider "aws" {
  region = "eu-west-2"
}

module "network" {
  source = "./modules/network"
}

module "security_groups" {
  source = "./modules/security_groups"
  vpc_id = module.network.vpc.id
}

module "compute" {
  source              = "./modules/compute"
  production_instance = var.production_instance
  ec2_subnet_id       = module.network.ec2_subnet.id
  ec2_sg_id           = module.security_groups.ssh_http_sg.id
}

module "rds" {
  source         = "./modules/rds"
  rds_subnet_ids = [module.network.rds_subnet_1.id, module.network.rds_subnet_2.id]
  rds_sg_id      = module.security_groups.rds_sg.id
  db_port        = var.db_port
  db_name        = var.db_name
  db_username    = var.db_username
  db_password    = var.db_password
}

module "load_balancer" {
  source              = "./modules/load_balancer"
  domain_name         = var.domain_name
  production_instance = var.production_instance
  ip_whitelist        = var.ip_whitelist
  vpc_id              = module.network.vpc.id
  lb_subnet_ids       = [module.network.lb_subnet_1.id, module.network.lb_subnet_2.id]
  lb_sg_id            = module.security_groups.https_sg.id
  ec2_instance_1_id   = module.compute.ec2_instance_1.id
  ec2_instance_2_id   = module.compute.ec2_instance_2.id
  ssl_certificate_arn = module.dns.ssl_certificate.arn
}

module "dns" {
  source      = "./modules/dns"
  domain_name = var.domain_name
  lb_dns_name = module.load_balancer.lb.dns_name
  lb_zone_id  = module.load_balancer.lb.zone_id
}


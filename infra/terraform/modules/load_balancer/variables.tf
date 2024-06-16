variable "vpc_id" {
  type = string
}

variable "lb_subnet_ids" {
  description = "Load balancer subnets (2 minimum)."
  type        = list(string)
}

variable "lb_sg_id" {
  description = "Load balancer security group."
  type        = string
}

variable "ec2_instance_1_id" {
  type = string
}

variable "ec2_instance_2_id" {
  type = string
}

variable "ssl_certificate_arn" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "production_instance" {
  description = "The production instance number (1 or 2)."
  type        = number
}

variable "ip_whitelist" {
  description = "List of ips that have access to the staging environment."
  type        = list(string)
}


variable "rds_subnet_ids" {
  description = "Subnets to be used in the RDS subnet group."
  type        = list(string)
}

variable "rds_sg_id" {
  description = "RDS security group."
  type        = string
}

variable "db_port" {
  type = number
}

variable "db_name" {
  type = string
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type = string
}

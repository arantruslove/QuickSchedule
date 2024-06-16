variable "ec2_subnet_id" {
  description = "The subnet ID used by the EC2 instances."
}

variable "ec2_sg_id" {
  description = "Security group that the EC2 instances use."
}

variable "production_instance" {
  description = "The instance number that should be used for production."
}

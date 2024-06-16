output "vpc" {
  value = aws_vpc.main
}

output "ec2_subnet" {
  value = aws_subnet.ec2_subnet
}

output "rds_subnet_1" {
  value = aws_subnet.rds_subnet_1
}

output "rds_subnet_2" {
  value = aws_subnet.rds_subnet_2
}

output "lb_subnet_1" {
  value = aws_subnet.lb_subnet_1
}

output "lb_subnet_2" {
  value = aws_subnet.lb_subnet_2
}

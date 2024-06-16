output "ssh_http_sg" {
  value = aws_security_group.ssh_http_security_group
}

output "https_sg" {
  value = aws_security_group.https_security_group
}

output "rds_sg" {
  value = aws_security_group.rds_security_group
}


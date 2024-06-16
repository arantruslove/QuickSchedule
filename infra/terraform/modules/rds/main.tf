resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "rds-subnet-group"
  subnet_ids = var.rds_subnet_ids
}

resource "aws_db_instance" "postgres" {
  allocated_storage       = 20
  storage_type            = "gp2"
  engine                  = "postgres"
  engine_version          = "16.3"
  instance_class          = "db.t3.micro"
  port                    = var.db_port
  db_name                 = var.db_name
  username                = var.db_username
  password                = var.db_password
  parameter_group_name    = "default.postgres16"
  publicly_accessible     = true
  skip_final_snapshot     = true
  storage_encrypted       = true
  backup_retention_period = 7
  backup_window           = "02:00-03:00" # When fewest users are expected to be online

  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [var.rds_sg_id]

  tags = {
    Name = "production-db"
  }
}

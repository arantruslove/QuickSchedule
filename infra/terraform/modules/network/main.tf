/**VPC Configuration*/
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "main-vpc"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "main-igw"
  }
}

/**Subnets*/
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "public-route-table"
  }
}

# EC2 subnets
resource "aws_subnet" "ec2_subnet" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "eu-west-2a"

  tags = {
    Name = "ec2-subnet"
  }
}

resource "aws_route_table_association" "ec2_association" {
  subnet_id      = aws_subnet.ec2_subnet.id
  route_table_id = aws_route_table.public.id
}

# RDS subnets
resource "aws_subnet" "rds_subnet_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "eu-west-2a"

  tags = {
    Name = "rds-subnet-1"
  }
}

resource "aws_subnet" "rds_subnet_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "eu-west-2b"

  tags = {
    Name = "rds-subnet-2"
  }
}

# Load balancer subnets
resource "aws_subnet" "lb_subnet_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "eu-west-2a"

  tags = {
    Name = "lb-subnet-1"
  }
}

resource "aws_subnet" "lb_subnet_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.5.0/24"
  availability_zone = "eu-west-2b"

  tags = {
    Name = "lb-subnet-2"
  }
}

# Associations
resource "aws_route_table_association" "lb_subnet_1_association" {
  subnet_id      = aws_subnet.lb_subnet_1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "lb_subnet_2_association" {
  subnet_id      = aws_subnet.lb_subnet_2.id
  route_table_id = aws_route_table.public.id
}


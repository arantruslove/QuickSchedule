# Creating SSM role for the EC2 instance
resource "aws_iam_role" "ssm_role" {
  name = "SSMRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ssm_policy_attachment" {
  role       = aws_iam_role.ssm_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ssm_instance_profile" {
  name = "SSMInstanceProfile"
  role = aws_iam_role.ssm_role.name
}

# Create EC2 instances
resource "aws_instance" "instance_1" {
  ami                         = "ami-01f10c2d6bce70d90"
  instance_type               = "t2.micro"
  subnet_id                   = var.ec2_subnet_id
  vpc_security_group_ids      = [var.ec2_sg_id]
  private_ip                  = "10.0.1.101"
  iam_instance_profile        = aws_iam_instance_profile.ssm_instance_profile.name
  associate_public_ip_address = true

  # Importing existing resources
  key_name = "terraform"

  tags = {
    Name        = "instance-1"
    Environment = var.production_instance == 1 ? "production" : "staging"
  }
}

resource "aws_instance" "instance_2" {
  ami                         = "ami-01f10c2d6bce70d90"
  instance_type               = "t2.micro"
  subnet_id                   = var.ec2_subnet_id
  vpc_security_group_ids      = [var.ec2_sg_id]
  private_ip                  = "10.0.1.102"
  iam_instance_profile        = aws_iam_instance_profile.ssm_instance_profile.name
  associate_public_ip_address = true

  # Importing existing resources
  key_name = "terraform"

  tags = {
    Name        = "instance-2"
    Environment = var.production_instance == 1 ? "staging" : "production"
  }
}

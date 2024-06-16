resource "aws_lb" "main" {
  name               = "main-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.lb_sg_id]
  subnets            = var.lb_subnet_ids
}

# Defining target groups for the two instances
resource "aws_lb_target_group" "target_group_1" {
  name     = "terraform-target-group-1"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    interval            = 30
    path                = "/"
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }

  tags = {
    Name = "terraform-target-group-1"
  }
}

resource "aws_lb_target_group" "target_group_2" {
  name     = "terraform-target-group-2"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    interval            = 30
    path                = "/"
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }

  tags = {
    Name = "terraform-target-group-2"
  }
}

# Attaching EC2 instances to the target groups
resource "aws_lb_target_group_attachment" "attachment_1" {
  target_group_arn = aws_lb_target_group.target_group_1.arn
  target_id        = var.ec2_instance_1_id
  port             = 80
}

resource "aws_lb_target_group_attachment" "attachment-2" {
  target_group_arn = aws_lb_target_group.target_group_2.arn
  target_id        = var.ec2_instance_2_id
  port             = 80
}

# Load balancer listener and rules
resource "aws_lb_listener" "main_listener" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"

  ssl_policy      = "ELBSecurityPolicy-2016-08"
  certificate_arn = var.ssl_certificate_arn

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "404: Not Found"
      status_code  = "404"
    }
  }
}

# Adding www and staging listener rules
# Routes traffic to production instance
resource "aws_lb_listener_rule" "www_rule" {
  listener_arn = aws_lb_listener.main_listener.arn

  action {
    type             = "forward"
    target_group_arn = var.production_instance == 1 ? aws_lb_target_group.target_group_1.arn : aws_lb_target_group.target_group_2.arn
  }

  condition {
    host_header {
      values = ["www.${var.domain_name}"]
    }
  }
  priority = 1

  tags = {
    Name = "production"
  }
}
resource "aws_lb_listener_rule" "staging_rule" {
  listener_arn = aws_lb_listener.main_listener.arn

  action {
    type             = "forward"
    target_group_arn = var.production_instance == 1 ? aws_lb_target_group.target_group_2.arn : aws_lb_target_group.target_group_1.arn
  }

  condition {
    host_header {
      values = ["staging.${var.domain_name}"]
    }
  }

  # Staging environment only accessible from permitted ip addresses
  condition {
    source_ip {
      values = var.ip_whitelist
    }
  }

  tags = {
    Name = "staging"
  }

  priority = 2
}

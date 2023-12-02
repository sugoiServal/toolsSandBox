[tutorial](https://www.youtube.com/watch?v=7xngnjfIlK4)
[code](https://github.com/sidpalas/devops-directive-terraform-course/blob/main/03-basics/web-app/main.tf)
[aws provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

- terraform

  - Function: resources `provisioning` tools. Abstract away different cloud providers' api
  - Declarative: define the end state
  - IaaC: Version Control on git, code review, Collaboration...
  - Cloud Agnostic: interact with any resource that has an api online

- paired uses examples:
  - Ansible (Config Management): setup and manage configs in provisioned resources
  - k8s: start k8s clusters in provisioned resources

# components

- source files

  - State files: information about current resource state
    - may contains sensitive information, so need authorization
  - config files(.tr): declare desired resource state
  - modules: break down large terraform config files, code reuse (third-party modules)
  -

- software component

  - Terraform Core
  - Provider: Plugins for different cloud resources
    - AWS, Azure, GCP, kubernetes, Alibaba...
    - program you custom provider

- terraform backend

  - manage yourself locally (default)
  - manage yourself remotely (eg. S3 + dynamodb),
  - manage by thrid party (Terraform Cloud)

- hcl: hashicorp configuration language (.tr file)

### Install

- [install](https://developer.hashicorp.com/terraform/install)

### cli

```bash
aws configure # use api key to login locally
```

```bash
# think git init, create a terraform workspace, download provider/modules from terraform registry
terraform init
# staging, compare current state with config file, and calculate changes
terraform plan
# apply changes, provision resource
terrafrom apply
# clean up resource associated with the config
terraform destory
```

### example

```python
terraform {   # think package (provider) including block
  backend "s3" {
    bucket = "devops—direictive—tf—state"
    key = "03—basics/web—app/terraform.tfstate"
    region = "us-east-l"
    dynamodb_table = "terraform—state—locking"
    encrypt = true
  }
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}
provider "aws" {
  region = "us-east-1"  # Set your desired AWS region
}

# ec2 instance
resource "aws_instance" "instance_1" {
  ami = "ami—011899242bb902164" # AMI ID: Ubuntu 20.04 LTS
  instance_type = "t2.micro"
  security_groups = [aws_security_group.instances.name]
  tags = {
    Name = "example-instance"  # Set a name tag for your instance
  }
  user_data = <<—EOF
      #!/bin/bash
      echo "Hello, World from 1" > index.html
      python3 -m http.server 8080 &
      EOF
}

resource "aws_instance" "instance_2" {
  ami = "ami—011899242bb902164" # AMI ID: Ubuntu 20.04 LTS
  instance_type = "t2.micro"
  security_groups = [aws_security_group.instances.name]  # reference security group
  tags = {
    Name = "example-instance"  # Set a name tag for your instance
  }
  user_data = <<—EOF
      #!/bin/bash
      echo "Hello, World from 1" > index.html
      python3 -m http.server 8080 &
      EOF
}

# ec2 security groups
resource "aws_security_group" "instances" {
  name = "instance—security—group"
}

resource "aws_security_group_rule" "allow_http_inbound" {
  type = "ingress"
  security_group_id = aws_security_group.instances.id  # reference security group
  from_port = 8080
  to_port = 8080
  protocol = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

# s3
resource "aws_s3_bucket" "bucket" {
  bucket = "devops—directive—web—app—data"
  force_destroy = true
  versioning {
    enabled = true
  }
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

# vpc
data "aws_vpc" "default_vpc" {
  default = true
}

data "aws_subnet_ids" "default_subnet" {
  vpc_id = data.aws_vpc.default_vpc.id   # reference vpc
}



# load balancer
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.load_balancer.arn
  port = 80
  protocol = "HTTP"
  # By default, return a simple 404 page
  default_action {
    type = "fixed—response"
    fixed_response {
      content_type = "text/plain"
      message_body = "404: page not found"
      status_code = 404
    }
  }
}

resource "aws_lb_target_group" "instances" {
  name     = "example-target-group"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default_vpc.id

  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 15
    timeout             = 3
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}
# load balancer: add instances to target group
resource "aws_lb_target_group_attachment" "instance_1" {
  target_group_arn = aws_lb_target_group.instances.arn
  target_id        = aws_instance.instance_1.id
  port             = 8080
}

resource "aws_lb_target_group_attachment" "instance_2" {
  target_group_arn = aws_lb_target_group.instances.arn
  target_id        = aws_instance.instance_2.id
  port             = 8080
}

resource "aws_lb_listener_rule" "instances" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 100

  condition {
    path_pattern {
      values = ["*"]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.instances.arn
  }
}

# load balancer security group
resource "aws_security_group" "alb" {
  name = "alb-security-group"
}

resource "aws_security_group_rule" "allow_alb_http_inbound" {
  type              = "ingress"
  security_group_id = aws_security_group.alb.id

  from_port   = 80
  to_port     = 80
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "allow_alb_all_outbound" {
  type              = "egress"
  security_group_id = aws_security_group.alb.id

  from_port   = 0
  to_port     = 0
  protocol    = "-1"
  cidr_blocks = ["0.0.0.0/0"]
}


resource "aws_lb" "load_balancer" {
  name               = "web-app-lb"
  load_balancer_type = "application"
  subnets            = data.aws_subnet_ids.default_subnet.ids
  security_groups    = [aws_security_group.alb.id]
}

# Route 53: reference load balancer dns name
resource "aws_route53_zone" "primary" {
  name = "devopsdeployed.com"
}

resource "aws_route53_record" "root" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "devopsdeployed.com"
  type    = "A"

  alias {
    name                   = aws_lb.load_balancer.dns_name
    zone_id                = aws_lb.load_balancer.zone_id
    evaluate_target_health = true
  }
}

# RDS
resource "aws_db_instance" "db_instance" {
  allocated_storage = 20
  # This allows any minor version within the major engine_version
  # defined below, but will also result in allowing AWS to auto
  # upgrade the minor version of your DB. This may be too risky
  # in a real production environment.
  auto_minor_version_upgrade = true
  storage_type               = "standard"
  engine                     = "postgres"
  engine_version             = "12"
  instance_class             = "db.t2.micro"
  name                       = "mydb"
  username                   = "foo"
  password                   = "foobarbaz"
  skip_final_snapshot        = true
}
```

# Migrate to S3 backend

- [ref](https://youtu.be/7xngnjfIlK4?t=2490)

# HCL

- [ref](https://youtu.be/7xngnjfIlK4?t=3503)

# Consume Module

# Environment separation

# test

terratest (in golang)

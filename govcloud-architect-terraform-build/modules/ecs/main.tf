
# App Cluster
resource "aws_ecs_cluster" "app_cluster" {
  name = "app-ecs-cluster"
}

resource "aws_ecs_task_definition" "app_task" {
  family                   = "app-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = var.task_execution_role
  
  container_definitions = jsonencode([{
    name        = "app-container"
    image       = "${var.app_ecr_repository_url}:latest"
    essential   = true
    
    portMappings = [{
      containerPort = 80
      hostPort      = 80
      protocol      = "tcp"
    }]
    
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/app-task"
        "awslogs-region"        = "us-gov-west-1"
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

resource "aws_cloudwatch_log_group" "app_log_group" {
  name              = "/ecs/app-task"
  retention_in_days = 30
}

resource "aws_ecs_service" "app_service" {
  name            = "app-service"
  cluster         = aws_ecs_cluster.app_cluster.id
  task_definition = aws_ecs_task_definition.app_task.arn
  desired_count   = 2
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = var.private_subnets
    security_groups  = [var.app_cluster_sg_id]
    assign_public_ip = false
  }
}

# Web Cluster
resource "aws_ecs_cluster" "web_cluster" {
  name = "web-ecs-cluster"
}

resource "aws_ecs_task_definition" "web_task" {
  family                   = "web-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = var.task_execution_role
  
  container_definitions = jsonencode([{
    name        = "web-container"
    image       = "${var.web_ecr_repository_url}:latest"
    essential   = true
    
    portMappings = [{
      containerPort = 80
      hostPort      = 80
      protocol      = "tcp"
    }]
    
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/web-task"
        "awslogs-region"        = "us-gov-west-1"
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

resource "aws_cloudwatch_log_group" "web_log_group" {
  name              = "/ecs/web-task"
  retention_in_days = 30
}

resource "aws_ecs_service" "web_service" {
  name            = "web-service"
  cluster         = aws_ecs_cluster.web_cluster.id
  task_definition = aws_ecs_task_definition.web_task.arn
  desired_count   = 2
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = var.private_subnets
    security_groups  = [var.web_cluster_sg_id]
    assign_public_ip = false
  }
}

# Create load balancers for the clusters
resource "aws_lb" "app_lb" {
  name               = "app-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.app_cluster_sg_id]
  subnets            = var.private_subnets

  enable_deletion_protection = false
}

resource "aws_lb_target_group" "app_target_group" {
  name        = "app-target-group"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"
  
  health_check {
    enabled             = true
    interval            = 30
    path                = "/"
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
}

resource "aws_lb_listener" "app_listener" {
  load_balancer_arn = aws_lb.app_lb.arn
  port              = "80"
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_target_group.arn
  }
}

resource "aws_lb" "web_lb" {
  name               = "web-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.web_cluster_sg_id]
  subnets            = var.private_subnets

  enable_deletion_protection = false
}

resource "aws_lb_target_group" "web_target_group" {
  name        = "web-target-group"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"
  
  health_check {
    enabled             = true
    interval            = 30
    path                = "/"
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
}

resource "aws_lb_listener" "web_listener" {
  load_balancer_arn = aws_lb.web_lb.arn
  port              = "80"
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web_target_group.arn
  }
}

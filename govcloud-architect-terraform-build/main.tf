// Work in progress: Terraform configuration is subject to change.
// Authored by Kartik Shankar
// Authored date: March 26, 2025

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.region
  # GovCloud requires specific endpoints
  endpoints {
    ec2 = "https://ec2.${var.region}.amazonaws.com"
  }
}

# Create the VPC and networking components
module "vpc" {
  source = "./modules/vpc"
  
  vpc_name        = var.vpc_name
  vpc_cidr        = var.vpc_cidr
  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs
}

# Create security groups
module "security_groups" {
  source = "./modules/security"
  
  vpc_id = module.vpc.vpc_id
}

# Create IAM roles and policies
module "iam" {
  source = "./modules/iam"
}

# Create ECR repositories
module "ecr" {
  source = "./modules/ecr"
  
  repository_names = [
    "app-cluster-container",
    "web-app-container",
    "iot-core-container"
  ]
}

# Create ECS clusters
module "ecs_clusters" {
  source = "./modules/ecs"
  
  vpc_id                = module.vpc.vpc_id
  private_subnets       = module.vpc.private_subnet_ids
  task_execution_role   = module.iam.ecs_task_execution_role_arn
  app_cluster_sg_id     = module.security_groups.app_cluster_sg_id
  web_cluster_sg_id     = module.security_groups.web_cluster_sg_id
  app_ecr_repository_url = module.ecr.repository_urls["app-cluster-container"]
  web_ecr_repository_url = module.ecr.repository_urls["web-cluster-container"]
}

# Create API Gateway
module "api_gateway" {
  source = "./modules/api_gateway"
  
  name                  = "app-api-gateway"
  description           = "API Gateway for application services"
  execution_role_arn    = module.iam.api_gateway_execution_role_arn
}

# Create IoT Core infrastructure
module "iot_core" {
  source = "./modules/iot_core"
  
  iot_role_arn = module.iam.iot_role_arn
}

# Create databases (DynamoDB)
module "dynamodb" {
  source = "./modules/dynamodb"
  
  tables = {
    "data-events" = {
      hash_key = "id"
      attributes = [
        {
          name = "id"
          type = "S"
        }
      ]
    }
  }
}

# Create S3 buckets
module "s3" {
  source = "./modules/s3"
  
  buckets = [
    "app-s3-bucket",
    "secure-s3-storage", 
    "data-storage"
  ]
}

# Create Lambda functions
module "lambda" {
  source = "./modules/lambda"
  
  functions = {
    "data-processor" = {
      handler = "index.handler"
      runtime = "nodejs18.x"
      source_dir = "./lambda/data-processor"
    },
    "auth-verifier" = {
      handler = "index.handler"
      runtime = "nodejs18.x"
      source_dir = "./lambda/auth-verifier"
    }
  }
  
  lambda_role_arn = module.iam.lambda_role_arn
}

# Create Amazon MSK (Managed Streaming for Kafka)
module "msk" {
  source = "./modules/msk"
  
  cluster_name     = "app-msk-cluster"
  kafka_version    = "2.8.1"
  instance_type    = "kafka.m5.large"
  ebs_volume_size  = 100
  number_of_nodes  = 3
  vpc_id           = module.vpc.vpc_id
  subnet_ids       = module.vpc.private_subnet_ids
  security_group_id = module.security_groups.msk_security_group_id
}

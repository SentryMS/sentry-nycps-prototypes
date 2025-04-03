# AWS GovCloud Terraform Architecture

![AWS GovCloud Architecture](./public/placeholder.svg)

This project implements a comprehensive AWS GovCloud architecture using Terraform, designed specifically for government cloud environments with enhanced security and compliance features.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [AWS GovCloud Account Setup](#aws-govcloud-account-setup)
- [Installation](#installation)
- [Implementation Steps](#implementation-steps)
- [Module Descriptions](#module-descriptions)
- [Security Considerations](#security-considerations)
- [Monitoring and Logging](#monitoring-and-logging)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Architecture Overview

This architecture provides a secure, scalable foundation for government applications with these key components:

- **VPC & Networking**: Isolated network with public and private subnets across multiple availability zones
- **Container Infrastructure**: ECS clusters for application and web workloads
- **Security**: IAM roles with least privilege, security groups, encryption at rest and in transit
- **Data Storage**: S3 buckets and DynamoDB tables for structured and unstructured data
- **Messaging & Streaming**: MSK (Managed Streaming for Kafka) for event streaming
- **Serverless**: Lambda functions for event-driven processing
- **IoT**: IoT Core for device management and data ingestion
- **API Management**: API Gateway for RESTful APIs

## Prerequisites

Before you begin, ensure you have:

1. **AWS GovCloud Account**: Active account with appropriate permissions
2. **AWS CLI**: [Install](https://aws.amazon.com/cli/) and configure with GovCloud credentials
3. **Terraform**: [Install](https://learn.hashicorp.com/tutorials/terraform/install-cli) version 1.2.0+
4. **Git**: [Install](https://git-scm.com/downloads) for version control
5. **Required IAM Permissions**: Administrator access or specific permissions to create all resources

## AWS GovCloud Account Setup

1. **Request GovCloud Access**:
   - Complete the [AWS GovCloud Access Request Form](https://aws.amazon.com/govcloud-us/contact/)
   - Provide necessary documentation for compliance verification

2. **Set up GovCloud IAM Users**:
   ```bash
   # Create programmatic access keys in the GovCloud partition
   aws iam create-user --user-name terraform-deployer
   aws iam attach-user-policy --user-name terraform-deployer --policy-arn arn:aws-us-gov:iam::aws:policy/AdministratorAccess
   aws iam create-access-key --user-name terraform-deployer
   ```

3. **Configure AWS CLI for GovCloud**:
   ```bash
   aws configure --profile govcloud
   # Enter your GovCloud access key, secret key, and region (us-gov-west-1)
   ```

## Installation

1. **Clone this repository**:
   ```bash
   git clone <repository-url>
   cd aws-govcloud-terraform
   ```

2. **Initialize Terraform**:
   ```bash
   terraform init
   ```

3. **Create a terraform.tfvars file**:
   ```
   region = "us-gov-west-1"
   vpc_name = "government-vpc"
   vpc_cidr = "10.0.0.0/16"
   availability_zones = ["us-gov-west-1a", "us-gov-west-1b", "us-gov-west-1c"]
   private_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
   public_subnet_cidrs = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
   ```

## Implementation Steps

### Step 1: Create Network Infrastructure

1. **Review and customize VPC settings**:
   - Edit `variables.tf` to set VPC CIDR blocks and subnets
   - Modify AZs based on your GovCloud region requirements

2. **Apply Network Infrastructure**:
   ```bash
   terraform apply -target=module.vpc -target=module.security_groups
   ```

3. **Verify VPC creation**:
   ```bash
   aws ec2 describe-vpcs --profile govcloud
   aws ec2 describe-subnets --profile govcloud
   ```

### Step 2: Set Up IAM Roles and Policies

1. **Review IAM configurations**:
   - Check `modules/iam/main.tf` for role definitions
   - Ensure least privilege principles are applied

2. **Apply IAM configuration**:
   ```bash
   terraform apply -target=module.iam
   ```

3. **Verify IAM creation**:
   ```bash
   aws iam list-roles --profile govcloud
   ```

### Step 3: Create ECR Repositories

1. **Customize repository names** if needed:
   - Edit `main.tf` module.ecr section

2. **Apply ECR configuration**:
   ```bash
   terraform apply -target=module.ecr
   ```

3. **Push sample container images**:
   ```bash
   # Authenticate to ECR
   aws ecr get-login-password --region us-gov-west-1 --profile govcloud | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-gov-west-1.amazonaws.com
   
   # Build and push container images
   docker build -t <account-id>.dkr.ecr.us-gov-west-1.amazonaws.com/app-cluster-container:latest ./app-container/
   docker push <account-id>.dkr.ecr.us-gov-west-1.amazonaws.com/app-cluster-container:latest
   
   docker build -t <account-id>.dkr.ecr.us-gov-west-1.amazonaws.com/web-app-container:latest ./web-container/
   docker push <account-id>.dkr.ecr.us-gov-west-1.amazonaws.com/web-app-container:latest
   ```

### Step 4: Deploy Storage Resources (S3, DynamoDB)

1. **Apply S3 configuration**:
   ```bash
   terraform apply -target=module.s3
   ```

2. **Apply DynamoDB configuration**:
   ```bash
   terraform apply -target=module.dynamodb
   ```

3. **Verify storage creation**:
   ```bash
   aws s3 ls --profile govcloud
   aws dynamodb list-tables --profile govcloud
   ```

### Step 5: Set Up Lambda Functions

1. **Prepare Lambda function code**:
   - Place function code in `./lambda/data-processor/` and `./lambda/auth-verifier/`
   - Customize Lambda environment variables if needed

2. **Apply Lambda configuration**:
   ```bash
   terraform apply -target=module.lambda
   ```

3. **Verify Lambda deployment**:
   ```bash
   aws lambda list-functions --profile govcloud
   ```

### Step 6: Deploy Kafka (MSK) Cluster

1. **Apply MSK configuration**:
   ```bash
   terraform apply -target=module.msk
   ```

2. **Verify MSK deployment** (this may take 15-20 minutes):
   ```bash
   aws kafka list-clusters --profile govcloud
   ```

### Step 7: Configure IoT Core

1. **Apply IoT Core configuration**:
   ```bash
   terraform apply -target=module.iot_core
   ```

2. **Register and configure devices**:
   ```bash
   # Get IoT endpoint
   aws iot describe-endpoint --endpoint-type iot:Data-ATS --profile govcloud
   ```

### Step 8: Deploy ECS Clusters

1. **Apply ECS configurations**:
   ```bash
   terraform apply -target=module.ecs_clusters
   ```

2. **Verify ECS cluster creation**:
   ```bash
   aws ecs list-clusters --profile govcloud
   ```

### Step 9: Set Up API Gateway

1. **Apply API Gateway configurations**:
   ```bash
   terraform apply -target=module.api_gateway
   ```

2. **Verify API Gateway creation**:
   ```bash
   aws apigateway get-rest-apis --profile govcloud
   ```

### Step 10: Apply Remaining Resources and Verify

1. **Apply all remaining resources**:
   ```bash
   terraform apply
   ```

2. **Verify complete deployment**:
   ```bash
   terraform output
   ```

## Module Descriptions

### VPC Module
Creates a secure network foundation with public and private subnets across multiple AZs. Includes NAT gateway, internet gateway, and route tables.

### Security Module
Implements security groups for different components:
- App Cluster SG: Controls access to application containers
- Web Cluster SG: Controls access to web tier
- MSK SG: Secures Kafka communication
- IoT SG: Manages IoT device connections

### IAM Module
Creates service roles with least-privilege permissions:
- ECS Task Execution Role
- API Gateway Execution Role
- IoT Role
- Lambda Role

### ECR Module
Creates secure container registries for:
- Application containers
- Web application containers
- IoT containers

### ECS Module
Deploys containerized applications:
- App Cluster: Backend application services
- Web Cluster: Frontend web services
- Load balancers and target groups for each cluster

### API Gateway Module
Creates REST API endpoints with:
- Resource paths
- Methods
- Integration points
- Deployment stages

### IoT Core Module
Configures IoT services:
- IoT Things
- Thing Types
- Policies
- Rules for data processing

### DynamoDB Module
Creates NoSQL tables for:
- Application data
- IoT device data

### S3 Module
Creates secure buckets for:
- Application storage
- Secure file storage
- Data processing

### Lambda Module
Deploys serverless functions:
- Data processor for event handling
- Authentication verifier for security

### MSK Module
Creates Kafka cluster for:
- Event streaming
- Real-time data processing
- Service communication

## Security Considerations

1. **Encryption**:
   - S3 buckets use AES-256 encryption
   - DynamoDB tables use AWS-managed encryption
   - TLS for Kafka communications

2. **Network Security**:
   - Private subnets for sensitive workloads
   - Security groups limit traffic flow
   - NAT gateway for outbound-only internet access

3. **Authentication & Authorization**:
   - IAM roles with least privilege
   - Service-to-service authentication
   - IoT policy-based access control

4. **Compliance**:
   - GovCloud environment for FedRAMP compliance
   - Audit logging enabled
   - Resource tagging for compliance tracking

## Monitoring and Logging

1. **CloudWatch Logs**:
   - ECS task logs
   - Lambda function logs
   - MSK broker logs

2. **Metrics**:
   - CPU and memory utilization for ECS tasks
   - DynamoDB read/write capacity metrics
   - Lambda invocation metrics

3. **Alarms** (to be configured):
   ```hcl
   resource "aws_cloudwatch_metric_alarm" "example" {
     alarm_name          = "cpu-utilization-alarm"
     comparison_operator = "GreaterThanThreshold"
     evaluation_periods  = "2"
     metric_name         = "CPUUtilization"
     namespace           = "AWS/ECS"
     period              = "60"
     statistic           = "Average"
     threshold           = "80"
     alarm_description   = "This alarm monitors ECS task CPU utilization"
     dimensions = {
       ClusterName = module.ecs_clusters.app_cluster_id
     }
   }
   ```

## Troubleshooting

### Common Issues

1. **Terraform State Lock**:
   ```bash
   # Force unlock if needed (use with caution)
   terraform force-unlock LOCK_ID
   ```

2. **Resource Creation Failures**:
   - Check AWS CloudTrail for API errors
   - Verify IAM permissions
   - Check resource quotas in GovCloud

3. **Connectivity Issues**:
   - Verify security group rules
   - Check route tables
   - Test with Network ACL rules

### Debug Commands

```bash
# Get VPC details
aws ec2 describe-vpcs --profile govcloud

# Check security groups
aws ec2 describe-security-groups --profile govcloud

# Test connectivity
aws ec2 describe-network-interfaces --profile govcloud
```

## Best Practices

1. **State Management**:
   - Store Terraform state in an S3 backend with versioning
   - Use state locking with DynamoDB
   - Example configuration:
     ```hcl
     terraform {
       backend "s3" {
         bucket         = "terraform-state-govcloud"
         key            = "terraform.tfstate"
         region         = "us-gov-west-1"
         dynamodb_table = "terraform-lock"
         encrypt        = true
       }
     }
     ```

2. **CI/CD Integration**:
   - Use AWS CodeBuild/CodePipeline in GovCloud
   - Implement terraform plan in CI pipeline
   - Only apply changes after review

3. **Tagging Strategy**:
   ```hcl
   tags = {
     Environment = "Production"
     Project     = "GovernmentApp"
     Owner       = "SecurityTeam"
     Compliance  = "FedRAMP-High"
   }
   ```

4. **Cost Optimization**:
   - Right-size ECS tasks and MSK brokers
   - Use auto-scaling for variable workloads
   - Monitor and set budget alerts

## Maintenance and Updates

1. **Regular Updates**:
   ```bash
   # Update terraform providers
   terraform init -upgrade
   
   # Plan updates
   terraform plan
   ```

2. **Backup Strategy**:
   - Enable versioning on S3 buckets
   - Set up DynamoDB backups
   - Export MSK configurations

3. **Patching and Upgrades**:
   - Update ECS task definitions for container updates
   - Plan for MSK version upgrades
   - Test Lambda runtime updates

## Additional Resources

- [AWS GovCloud Documentation](https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/welcome.html)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)

---

## Project Contributors

- [Your Name] - Initial work and architecture design

## License

This project is licensed under the MIT License - see the LICENSE file for details.

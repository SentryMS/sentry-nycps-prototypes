// Work in progress: Terraform variables are subject to change.
// Authored by Kartik Shankar
// Authored date: March 28, 2025

variable "region" {
  description = "AWS GovCloud region"
  type        = string
  default     = "us-gov-west-1"
}

variable "vpc_name" {
  description = "Name of the VPC"
  type        = string
  default     = "us-gov-east-1"  # Match the name from diagram
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones to use in the VPC"
  type        = list(string)
  default     = ["us-gov-west-1a", "us-gov-west-1b", "us-gov-west-1c"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

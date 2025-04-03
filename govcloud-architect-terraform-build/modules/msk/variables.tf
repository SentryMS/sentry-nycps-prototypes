
variable "cluster_name" {
  description = "Name of the MSK cluster"
  type        = string
}

variable "kafka_version" {
  description = "Kafka version"
  type        = string
}

variable "instance_type" {
  description = "Instance type for the brokers"
  type        = string
}

variable "ebs_volume_size" {
  description = "EBS volume size for the brokers"
  type        = number
}

variable "number_of_nodes" {
  description = "Number of broker nodes"
  type        = number
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "subnet_ids" {
  description = "IDs of the subnets to deploy the brokers into"
  type        = list(string)
}

variable "security_group_id" {
  description = "ID of the security group for the brokers"
  type        = string
}


variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC security groups"
  type        = string
  default     = "0.0.0.0/0"
}

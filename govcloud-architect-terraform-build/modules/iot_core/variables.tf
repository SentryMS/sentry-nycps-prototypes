
variable "iot_role_arn" {
  description = "ARN of the IoT role"
  type        = string
}

variable "thing_name_prefix" {
  description = "Prefix for IoT thing names"
  type        = string
  default     = "gov-iot"
}

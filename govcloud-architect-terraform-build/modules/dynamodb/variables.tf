
variable "tables" {
  description = "DynamoDB tables to create"
  type = map(object({
    hash_key = string
    attributes = list(object({
      name = string
      type = string
    }))
  }))
}

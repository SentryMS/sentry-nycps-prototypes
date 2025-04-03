
resource "aws_dynamodb_table" "table" {
  for_each = var.tables
  
  name         = each.key
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = each.value.hash_key
  
  dynamic "attribute" {
    for_each = each.value.attributes
    
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }
  
  tags = {
    Name = each.key
  }
}

# Create IoT data table
resource "aws_dynamodb_table" "iot_data" {
  name         = "iot_data"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  
  attribute {
    name = "id"
    type = "S"
  }
  
  tags = {
    Name = "iot_data"
  }
}

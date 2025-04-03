
resource "aws_iot_thing_type" "iot_thing_type" {
  name = "gps_device"
  
  properties {
    description = "GPS IoT Device"
  }
}

resource "aws_iot_policy" "iot_policy" {
  name = "iot-device-policy"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "iot:Connect"
        ]
        Resource = [
          "*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "iot:Publish",
          "iot:Subscribe",
          "iot:Receive"
        ]
        Resource = [
          "*"
        ]
      }
    ]
  })
}

resource "aws_iot_topic_rule" "iot_rule" {
  name        = "iot_data_rule"
  description = "Rule to process IoT device data"
  enabled     = true
  sql         = "SELECT * FROM 'iot/device/data'"
  sql_version = "2016-03-23"
  
  dynamodb {
    hash_key_field = "id"
    hash_key_value = "${timestamp()}"
    role_arn       = var.iot_role_arn
    table_name     = "iot_data"
  }
}

# Create sample IoT Thing for GPS device as shown in diagram
resource "aws_iot_thing" "gps_device" {
  name = "gps-iot-device"
  
  attributes = {
    device_type = "gps"
  }
}

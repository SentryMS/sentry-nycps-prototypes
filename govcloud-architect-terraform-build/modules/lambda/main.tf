
data "archive_file" "lambda_zip" {
  for_each = var.functions
  
  type        = "zip"
  source_dir  = each.value.source_dir
  output_path = "${path.module}/${each.key}.zip"
}

resource "aws_lambda_function" "lambda" {
  for_each = var.functions
  
  function_name    = each.key
  filename         = data.archive_file.lambda_zip[each.key].output_path
  source_code_hash = data.archive_file.lambda_zip[each.key].output_base64sha256
  role             = var.lambda_role_arn
  handler          = each.value.handler
  runtime          = each.value.runtime
  
  environment {
    variables = {
      REGION = "us-gov-west-1"
    }
  }
  
  tags = {
    Name = each.key
  }
}

# Create sample code for lambda functions
resource "local_file" "lambda_code" {
  for_each = var.functions
  
  content = <<EOF
exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  
  return response;
};
EOF
  
  filename = "${path.module}/${each.value.source_dir}/index.js"
}

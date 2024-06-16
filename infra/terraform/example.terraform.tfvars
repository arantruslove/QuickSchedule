# Example terraform.tfvars file

# Domain name for the application
domain_name = "example.com"

# Database configuration
db_name     = "postgres"
db_username = "postgres_user"
db_port     = 5432
db_password = "your-db-password"

# IP Whitelist for database access
# List of CIDR blocks for IP addresses allowed to access the database
ip_whitelist = [
  "53.232.19.143/32", # IP address 1
  "198.51.100.42/32"  # IP address 2
]

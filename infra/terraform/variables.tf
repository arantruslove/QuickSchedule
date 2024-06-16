variable "production_instance" {
  description = "Flag to determine which instance is for production."
  type        = number
  validation {
    condition     = var.production_instance == 1 || var.production_instance == 2
    error_message = "The production_instance variable must be either 1 or 2."
  }
}

variable "domain_name" {
  description = "Domain name of the website being deployed."
  type        = string
}

variable "db_name" {
  description = "The database name."
  type        = string
}

variable "db_username" {
  description = "The database username."
  type        = string
}

variable "db_port" {
  description = "The database port number."
  type        = number
}

variable "db_password" {
  description = "The database password."
  type        = string
}

variable "ip_whitelist" {
  description = "List of ip addressess allowed to access staging environment and db."
  type        = list(string)
}



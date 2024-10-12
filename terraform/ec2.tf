# resource "aws_key_pair" "gym_key_pair" {
#   key_name   = "deployer-key"
#   public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQD3F6tyPEFEzV0LX3X8BsXdMsQz1x2cEikKDEY0aIj41qgxMCP/iteneqXSIFZBp5vizPvaoIR3Um9xK7PGoW8giupGn+EPuxIA4cDM4vzOqOkiMPhz5XK0whEjkVzTo4+S0puvDZuwIsdiW9mxhJc7tgBNL0cYlWSYVkz4G/fslNfRPW5mYAM49f4fhtxPb5ok4Q2Lg9dPKVHO/Bgeu5woMc7RY0p1ej6D4CKFE6lymSDJpW0YHX/wqE9+cfEauh7xZcG0q9t2ta6F6fmX0agvpFyZo8aFbXeUBr7osSCJNgvavWbM/06niWrOvYX2xwWdhXmXSrbX8ZbabVohBK41 email@example.com"
# }

resource "aws_key_pair" "gym_key_pair" {
  key_name   = "gym-key-pair"
  public_key = file("gym-key-pair.pub")
}

resource "aws_instance" "ec2_api" {
  ami           = "ami-0e86e20dae9224db8"
  instance_type = "t2.micro"
  subnet_id = aws_subnet.gym_subnet_public.id
  associate_public_ip_address = true
  vpc_security_group_ids = [ aws_security_group.gym_sg_api.id ]
  key_name = aws_key_pair.gym_key_pair.key_name
  #user_data = file("./docker-install.sh")

  tags = {
    Name = "ec2-api"
  }
}

resource "aws_instance" "ec2_db" {
  ami           = "ami-0e86e20dae9224db8"
  instance_type = "t2.micro"
  subnet_id = aws_subnet.gym_subnet_private.id
  vpc_security_group_ids = [ aws_security_group.gym_sg_db.id ]
  key_name = aws_key_pair.gym_key_pair.key_name
  user_data = file("./docker-install.sh")

  tags = {
    Name = "ec2-db"
  }
}

output "ip_api" {
  value = aws_instance.ec2_api.public_ip
}

output "ip_db" {
  value = aws_instance.ec2_db.private_ip
}
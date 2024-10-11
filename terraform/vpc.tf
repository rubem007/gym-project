# 1 - Create VPC
resource "aws_vpc" "gym_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "gym-vpc"
  }
}

# 2 - Create Subnets for VPC
resource "aws_subnet" "gym_subnet_public" {
  vpc_id     = aws_vpc.gym_vpc.id
  cidr_block = "10.0.0.0/24"

  tags = {
    Name = "gym-subnet-public"
  }
}

resource "aws_subnet" "gym_subnet_private" {
  vpc_id     = aws_vpc.gym_vpc.id
  cidr_block = "10.0.1.0/24"

  tags = {
    Name = "gym-subnet-private"
  }
}

# 3 - Create Internet Gateway and attach to VPC
resource "aws_internet_gateway" "gym_igw" {
  vpc_id = aws_vpc.gym_vpc.id

  tags = {
    Name = "gym-igw"
  }
}

# PUBLIC IP
resource "aws_eip" "gym_nat_eip" {

  depends_on = [aws_internet_gateway.gym_igw]

  tags = {
    Name = "gym-nat-eip"
  }
}

# 4 - Create Nat Gateway and associate a subnet
resource "aws_nat_gateway" "gym_nat_gtw" {
  allocation_id = aws_eip.gym_nat_eip.id
  subnet_id     = aws_subnet.gym_subnet_public.id

  tags = {
    Name = "gym-nat-gtw"
  }

  # To ensure proper ordering, it is recommended to add an explicit dependency
  # on the Internet Gateway for the VPC.
  depends_on = [aws_internet_gateway.gym_igw]
}

# 5 - Create Route table for public subnet
resource "aws_route_table" "gym_rt_public" {
  vpc_id = aws_vpc.gym_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gym_igw.id
  }

  tags = {
    Name = "gym-rt-public"
  }
}

resource "aws_route_table_association" "gym_rt_public_a" {
  subnet_id      = aws_subnet.gym_subnet_public.id
  route_table_id = aws_route_table.gym_rt_public.id
}

# 5.1 - Create Route table for private subnet
# resource "aws_route_table" "gym_rt_private" {
#   vpc_id = aws_vpc.gym_vpc.id

#   route {
#     cidr_block     = "0.0.0.0/0"
#     nat_gateway_id = aws_nat_gateway.gym_nat_gtw.id
#   }

#   tags = {
#     Name = "gym-rt-private"
#   }
# }

# resource "aws_route_table_association" "gym_rt_private_a" {
#   subnet_id      = aws_subnet.gym_subnet_private.id
#   route_table_id = aws_route_table.gym_rt_private.id
# }
import paramiko

def run_certbot():
    host = "198.71.54.159"
    user = "root"
    password = "PQsQ3OL6"

    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(host, username=user, password=password)
        
        command = """
        docker stop nginx
        docker run --rm --name certbot-temp -v "/root/app/certbot/conf:/etc/letsencrypt" -v "/root/app/certbot/www:/var/www/certbot" -p 80:80 certbot/certbot certonly --standalone -d khcrf.org -d www.khcrf.org -d api.khcrf.org --non-interactive --agree-tos -m info@khcrf.org
        docker start nginx
        sleep 2
        docker ps -a | grep nginx
        """
        stdin, stdout, stderr = ssh.exec_command(command)
        print("=== STDOUT ===")
        print(stdout.read().decode())
        print("=== STDERR ===")
        print(stderr.read().decode())
        ssh.close()
    except Exception as e:
        print(f"Error: {e}")

run_certbot()

ssh $SSH_USER@$SSH_HOST "cd /home/Sms-BE && && echo Starting to deploy && git pull && sudo docker-compose up -d --build && exit"
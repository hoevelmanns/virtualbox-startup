MACHINE=ODDYC

sudo systemctl stop NetworkManager.service
sudo systemctl start NetworkManager.service

sleep 2

NODE_NO_WARNINGS=1 /home/ubuntu/vmstarter "$MACHINE"

echo "Waiting for machine $MACHINE to poweroff..."

until $(VBoxManage showvminfo --machinereadable $MACHINE | grep -q ^VMState=.poweroff.)
do
  sleep 1
done

echo "Shutdown Host"

shutdown now



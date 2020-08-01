#!/bin/bash

if [[ "$1" = "production" ]]
then
    rsync -delete -e "ssh -i quanht.pem -o StrictHostKeyChecking=no" ./ quanht@34.87.80.48:/home/quanht/$2
    ssh -i quanht.pem -o StrictHostKeyChecking=no quanht@34.87.80.48 'bash -s' < ./deploy/updateAndRestart.sh $nodeHome $2
fi

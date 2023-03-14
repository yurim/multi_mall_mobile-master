#!/bin/bash
current_pwd="`pwd`"
echo -e "현재 repo 업데이트중..\n\n"
git pull
echo -e "현재 repo 업데이트완료.\n\n"
cd ./BACKEND
echo -e "BACKEND repo 업데이트중..\n\n";
git pull
echo -e "BACKEND repo 업데이트완료.\n\n"
cd ${current_pwd}

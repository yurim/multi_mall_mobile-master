#!/bin/bash
echo v$1

TARGET=$2
TARGET=${TARGET:-molly}

echo target_$TARGET

docker build . -t multi-mall-${TARGET}-staging-mobile-ecr --build-arg NODE_ENV=staging --build-arg DEPLOY_TARGET=$TARGET

docker tag multi-mall-${TARGET}-staging-mobile-ecr:latest 844930569506.dkr.ecr.ap-northeast-2.amazonaws.com/multi-mall-${TARGET}-staging-mobile-ecr:latest
docker push 844930569506.dkr.ecr.ap-northeast-2.amazonaws.com/multi-mall-${TARGET}-staging-mobile-ecr:latest

# 이하는 옵션이며, 로컬에서 배포 완료시 배포된 태그의 잔여 파일을 지워줌 ( 저장 용량 확보 )
docker rmi -f $(docker images multi-mall-${TARGET}-staging-mobile-ecr -q)

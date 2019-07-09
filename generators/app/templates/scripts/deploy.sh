#!/bin/bash

NAMESPACE=test #<%= props.projectNamespace %>
install='false'
pull_images='false'
env='dev'
push_config='false'

LOG='\033[0;36m'
NC='\033[0m'
BASENAME=`basename "$CURRENT"`

if [ $BASENAME != 'script' ]; then
  cd scripts
fi

while getopts 'ipe:c' flag; do
  case "${flag}" in
    i) install='true' ;;
    p) pull_images='true' ;;
    e) env=$OPTARG ;;
    c) push_config='true' ;;
  esac
done

. ./configs/config-${env}.sh

if [ $env == 'prod' ]; then
  cd ..
  npm run build
  cd scripts
fi

. ./procedures/copy-${copy_method}.sh

if [ $BASENAME != 'scripts' ]; then
  cd ..
fi
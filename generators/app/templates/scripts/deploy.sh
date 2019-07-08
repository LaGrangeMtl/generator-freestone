#!/bin/bash

NAMESPACE=test #<%= props.projectNamespace %>
install='false'
pull_images='false'
env='dev'
push_config='false'

LOG='\033[0;36m'
NC='\033[0m'

while getopts 'ipe:c' flag; do
  case "${flag}" in
    i) install='true' ;;
    p) pull_images='true' ;;
    e) env=$OPTARG ;;
    c) push_config='true' ;;
  esac
done

. ./configs/config-${env}.sh
. ./procedures/copy-${copy_method}.sh
#!/bin/bash

rsync --stats --recursive --compress dev.enclos.ca:/var/medias/<%= props.projectNamespace %>/* ./dist/


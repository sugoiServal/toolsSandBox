#!/bin/bash
git add :/

d=$(date)
git commit -am "$d"
git push Origin master



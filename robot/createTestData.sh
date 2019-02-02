#!/usr/bin/env bash

OUTPUT_DIR=./testData
for i in DEV PROD TEST BUILD
do
    echo "output: $i"

for j in test-suite-1 test-suite-2 test-suite-3
do
    echo "output: $j"

for k in {1..25}
do
    echo "output: ${i}${j}${k}"


	robot.bat   --outputdir ${OUTPUT_DIR}/${i}/${j}/${k} --xunit xunit.xml ./test

done
done

done



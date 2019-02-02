*** Settings ***
Documentation    Example suite
Force Tags       example
Library          String
*** Keywords ***

Random Wait
    ${random}   Generate Random String  1  [NUMBERS]
    Sleep  ${random}

Random Fail
    ${random}   Generate Random String  1  [NUMBERS]
    Run Keyword If  ${random}>5   Fail


*** Test Cases ***

Hello World Take 1
	Random Wait
	Random Fail
Hello World Take 2
	Random Wait
	Random Fail
Hello World Take 3
	Random Wait
	Random Fail
Hello World Take 4
	Random Wait
	Random Fail
Hello World Take 5
	Random Wait
	Random Fail
Hello World Take 6
	Random Wait
	Random Fail
Hello World Take 7
	Random Wait
	Random Fail
Hello World Take 8
	Random Wait
	Random Fail
Hello World Take 9
	Random Wait
	Random Fail

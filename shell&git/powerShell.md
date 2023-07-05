# [ref](https://www.comparitech.com/net-admin/powershell-cheat-sheet/)\
- misc
    - main use: to help users automate administrative jobs

- terms:
    - Object: Every piece of data output from a cmdlet is an .NET object rather than text
    - `cmdlets`: MS's term of command, used in powerShell
        - they are instances of .NET classes (lines of .NET codes), not stand-alone executables.
        - process `input .NET objects` from pipeline, typically `deliver .NET  objects as output` to the pipeline.
        - cmdlets dont do Parsing, error presentation, and output formatting, which are handled by the PowerShell runtime.
    - `Functions`: command written in powerShell language
    - powerShell script: file with `.ps1` extension
    - Pipelines: 


|||
|-|-|
|ctrl+c|Interrupt|
|Get-Help||return documents of cmdlets|
|h, history|Get-History|


![](https://cdn.comparitech.com/wp-content/uploads/2018/05/Comparitech-Powershell-cheatsheet-1024x695.jpeg)

### directory

|alias|cmdlets|do|
|-|-|-|
|pwd|Get-Location||
|ls|Get-ChildItem||
|cd|Set-Location|Sets the current working location |
|cp|Copy-Item||
|mv|Move-Item||
|rm|Remove-Item||





### file

|alias|cmdlets|do|
|-|-|-|
|ni|New-Item -ItemType File -Path .\play.txt|create empty file|
|ac|Add-Content|add content(append)|
|sc|Set-Content|replaces the content in an item(overwrite)|
|cat|Get-Content|Gets the content of the item |
|rni|Rename-Item|


### misc

|alias|cmdlets|do|
|-|-|-|
|curl/wget|Invoke-WebRequest|Gets content from a web page on the Internet.|

### System/Network

|alias|cmdlets|do|
|-|-|-|
|ps|Get-Process||
||Stop-Process||
||Get-Service|get installed services(running or not)|
||Get-EventLog|print system event log(legacy)|
||Get-WinEvent|print system event log|

```
Stop-Process -Name "explorer"
Get-Process explorer | Stop-Process -Verbose
```
### Variables

```ps
$var="string"
$var=[int]5  # force type
$a,$b=$b,$a  # flip variable
```
- TODO: array variable
### Scripting
```
PS c:\powershell\mynewscript.ps1   # run scrpit 
```

- restricted Execution Policy
    - `Restricted` – The default execution policy that stops scripts from running.
    - `All Signed` – Will run scripts if they are signed by a trusted publisher
    - `Remote Signed` – Allows scripts to run which have been created locally
    - `Unrestricted` – A policy with no restrictions on running scripts
```
Set-ExecutionPolicy  # set Execution Policy
Get-ExecutionPolicy  # see what Execution Policy is in use in the host
```


### TODO: pipeline, Where-Object
```powershell
# If you wanted to restrict output to active services on your computer, input the following command: 
PS C:\ Get-Service | Where-Object {$_.Status -eq “Running”}
```

